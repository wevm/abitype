import type { AbiType, SolidityArrayWithTuple, SolidityTuple } from '../abi'
import type { Trim } from '../types'
import type {
  ConstructorSignature,
  FunctionSignatureWithReturn,
  FunctionSignatureWithoutReturn,
  IsConstructorSignature,
  IsFallbackSignature,
  IsFunctionSignature,
  IsReceiveSignature,
} from './signatures'

// 1. Get params from signature
// 2. Parse params into array
// 3. Convert each param string to basic abi parameter
// 4. Resolve types for each param to create full param (if inline tuple repeat steps 1-4)

export type ParseSignature<TSignature extends string> =
  | (IsFunctionSignature<TSignature> extends true
      ? TSignature extends FunctionSignatureWithReturn<
          infer Name,
          infer Params,
          infer Return
        >
        ? {
            name: Trim<Name>
            type: 'function'
            inputs: Trim<Params> extends '' ? [] : ParseParams<Trim<Params>>
            outputs: Return extends `${string}returns (${infer Outputs})`
              ? ParseParams<Trim<Outputs>>
              : []
          }
        : TSignature extends FunctionSignatureWithoutReturn<
            infer Name,
            infer Params
          >
        ? {
            name: Trim<Name>
            type: 'function'
            stateMutability: 'nonpayable'
            inputs: ParseParams<Trim<Params>>
            outputs: []
          }
        : never
      : never)
  | (IsConstructorSignature<TSignature> extends true
      ? {
          type: 'constructor'
          inputs: TSignature extends ConstructorSignature<infer Params>
            ? ParseParams<Trim<Params>>
            : []
        }
      : never)
  | (IsFallbackSignature<TSignature> extends true
      ? {
          type: 'fallback'
        }
      : never)
  | (IsReceiveSignature<TSignature> extends true
      ? {
          type: 'receive'
          stateMutability: 'payable'
        }
      : never)

export type ParseParams<
  T extends string,
  Result extends unknown[] = [],
  Current extends string = '',
  Depth extends ReadonlyArray<number> = [],
> = T extends ''
  ? [...Result, Trim<Current>]
  : Depth['length'] extends 0
  ? T extends `${infer Head}${infer Tail}`
    ? Head extends ','
      ? ParseParams<Tail, [...Result, Trim<Current>], ''>
      : Head extends '('
      ? ParseParams<Tail, Result, `${Current}${Head}`, [...Depth, 1]>
      : ParseParams<Tail, Result, `${Current}${Head}`>
    : []
  : T extends `${infer Char}${infer Rest}`
  ? Char extends '('
    ? ParseParams<Rest, Result, `${Current}${Char}`, [...Depth, 1]>
    : Char extends ')'
    ? ParseParams<Rest, Result, `${Current}${Char}`, Pop<Depth>>
    : ParseParams<Rest, Result, `${Current}${Char}`, Depth>
  : []
type Pop<T extends ReadonlyArray<number>> = T extends [...infer R, any] ? R : []

export type ParseAbiParameter<T extends string> =
  T extends `(${string})${string}`
    ? ParseComponents<[T]>
    : T extends `${infer Type} indexed ${infer Name}`
    ? { type: Trim<Type>; name: Trim<Name>; indexed: true }
    : T extends `${infer Type} ${infer Name}`
    ? { type: Trim<Type>; name: Trim<Name> }
    : T extends `${infer Type}`
    ? { type: Type }
    : never

type Result = ParseAbiParameter<'(string)[][] foo'>

type ParseAbiParameters<T extends readonly string[]> = {
  [K in keyof T]: ParseAbiParameter<T[K]>
}

//////////////////////////////////////////////////////////////////////////////////////////////////

type UnnamedArgs = Exclude<AbiType, SolidityTuple | SolidityArrayWithTuple>
type Modifier = 'calldata' | 'indexed' | 'memory' | 'storage'
type AbiArgs =
  | UnnamedArgs
  | ''
  | 'void'
  | `${string}${Modifier}${string}`
  | `${string} ${string}`
type TupleValue = `(${string})${string}`
type AbiArgsWithTuple = AbiArgs | TupleValue
type AbiArgsTypeWithTuple = readonly AbiArgsWithTuple[]
type IsIndexed<T extends string> = T extends `${string} indexed ${string}`
  ? true
  : unknown
type ExtractTArgs<T extends string> =
  T extends `(${infer Args})${ExtractTupleInfo<T>}`
    ? Args
    : T extends `(${infer Args}) ${ExtractTupleInfo<T>}`
    ? Args
    : ''
// type Result = ExtractTArgs<'(string bar, address foo)[] foo'>
type ExtractTupleInfo<T extends string> = T extends `${string})${infer Info}`
  ? Info extends `${string})`
    ? ''
    : Info extends `${string})${infer TInfo}`
    ? TInfo extends ''
      ? Trim<Info>
      : ExtractTupleInfo<Trim<TInfo>>
    : Trim<Info>
  : T
type ExtractTupleType<T extends string> = T extends `[${infer K}]${string}`
  ? `tuple[${K}]`
  : 'tuple'
type ExtractTupleName<T extends string> =
  T extends `[${string}] indexed ${infer Name}`
    ? Name
    : T extends `[${string}]${infer Name}`
    ? Trim<Name>
    : T extends `indexed ${infer Name}`
    ? Name
    : T

type ParseComponents<T extends AbiArgsTypeWithTuple> = T extends [never]
  ? never
  : T extends ['']
  ? never
  : T extends [
      infer Head extends AbiArgsWithTuple,
      ...infer Last extends AbiArgsTypeWithTuple,
    ]
  ? Head extends `(${string}`
    ? [
        {
          type: ExtractTupleType<ExtractTupleInfo<Head>>
          name: ExtractTupleName<ExtractTupleInfo<Head>>
          // internalType: ExtractTupleInternalType<ExtractTupleInfo<Head>>
          components: [
            ...ParseComponents<[...ParseParams<ExtractTArgs<Head>>, ...Last]>,
          ]
        } & (IsIndexed<Head> extends true ? { indexed: true } : unknown),
      ]
    : [
        ...ParseAbiParameters<[Exclude<Head, TupleValue>]>,
        ...ParseComponents<Last>,
      ]
  : []
