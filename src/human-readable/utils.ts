import type { AbiParameter } from '../abi'
import type { IsUnknown, Prettify, Trim } from '../types'
import type {
  ConstructorSignature,
  ErrorSignature,
  EventSignature,
  FallbackSignature,
  IsErrorSignature,
  IsEventSignature,
  IsFunctionSignature,
  ReceiveSignature,
  Signatures,
} from './signatures'
import type { ParseStructs, StructLookup } from './structs'

export type ParseAbi<
  TSignatures extends Signatures<
    TSignatures extends readonly string[] ? TSignatures : never
  >,
> = TSignatures extends infer Validated extends Signatures<
  Validated extends readonly string[] ? Validated : never
>
  ? ParseStructs<Validated> extends infer Structs
    ? {
        [K in keyof Validated]: Validated[K] extends infer Signature extends string
          ? ParseSignature<Signature, Structs>
          : never
      }
    : never
  : never

export declare function parseAbi<
  TSignatures extends Signatures<
    TSignatures extends readonly string[] ? TSignatures : never
  >,
  // TODO: Add `Narrow<TSignatures>` support
>(signatures: TSignatures): ParseAbi<TSignatures>

// 1. Get params from signature (e.g. `function foo(uint256, uint256)` -> `uint256, uint256`)
// 2. Parse params into array (e.g. `uint256, uint256` -> `['uint256', 'uint256']`)
// 3. Convert each param string to basic abi parameter (e.g. `uint256` -> `{ type: 'uint256' }`)
// 3a. If inline tuple repeat steps 1-3

// TODO
// - [x] Struct lookup
// - [x] modifiers (e.g. `indexed`)
// - [ ] Tuple conversion
// - [ ] Function signature
// - [ ] `void` param
// - [ ] Convert uint to uint256
// - [ ] Remove unused utility types

export type ParseSignature<
  TSignature extends string,
  TStructs extends StructLookup | unknown = unknown,
> =
  | (IsErrorSignature<TSignature> extends true
      ? TSignature extends ErrorSignature<infer Name, infer Params>
        ? {
            name: Name
            type: 'error'
            inputs: ParseAbiParameters<
              ParseParams<Params>,
              { AllowIndexed: false; Structs: TStructs }
            >
          }
        : never
      : never)
  | (IsEventSignature<TSignature> extends true
      ? TSignature extends EventSignature<infer Name, infer Params>
        ? {
            name: Name
            type: 'event'
            inputs: ParseAbiParameters<
              ParseParams<Params>,
              { AllowIndexed: true; Structs: TStructs }
            >
          }
        : never
      : never)
  | (IsFunctionSignature<TSignature> extends true
      ? {
          type: 'function'
          // TODO
        }
      : never)
  | (TSignature extends ConstructorSignature<infer Params>
      ? {
          type: 'constructor'
          inputs: ParseAbiParameters<
            ParseParams<Params>,
            { AllowIndexed: false; Structs: TStructs }
          >
        }
      : never)
  | (TSignature extends FallbackSignature
      ? {
          type: 'fallback'
        }
      : never)
  | (TSignature extends ReceiveSignature
      ? {
          type: 'receive'
          stateMutability: 'payable'
        }
      : never)

export type ParseAbiParameters<
  T extends readonly string[],
  Options extends ParseOptions = DefaultParseOptions,
> = T extends ['']
  ? []
  : {
      [K in keyof T]: ParseAbiParameter<T[K], Options>
    }
type ParseOptions = { AllowIndexed: boolean; Structs: StructLookup | unknown }
type DefaultParseOptions = { AllowIndexed: false; Structs: unknown }

export type ParseAbiParameter<
  T extends string,
  Options extends ParseOptions = DefaultParseOptions,
> = T extends `(${string})${string}`
  ? { type: 'TODO: tuple' }
  : // Convert string to basic AbiParameter (structs resolved yet)
  // Check for `${Type} ${Modifier} ${Name}` format (e.g. `uint256 indexed foo`)
  (
      T extends `${infer Type} ${infer Mod extends Modifier<
        Options['AllowIndexed']
      >} ${infer Name}`
        ? Prettify<
            { type: Trim<Type>; name: Trim<Name> } & (Mod extends 'indexed'
              ? { indexed: true }
              : object)
          >
        : // Check for `${Type} ${NameOrModifier}` format (e.g. `uint256 foo`, `uint256 indexed`)
        T extends `${infer Type} ${infer NameOrModifier}`
        ? Trim<NameOrModifier> extends infer Trimmed
          ? Prettify<
              { type: Trim<Type> } & (Trimmed extends Modifier<false>
                ? object
                : Options['AllowIndexed'] extends true
                ? Trimmed extends 'indexed'
                  ? { indexed: true }
                  : { name: Trimmed }
                : { name: Trimmed })
            >
          : never
        : // Must be `${Type}` format (e.g. `uint256`)
          { type: T }
    ) extends infer Parameter extends AbiParameter & {
      type: string
      indexed?: boolean
    }
  ? // Resolve struct types
    // Starting with plain struct types (e.g. `Foo`)
    Parameter['type'] extends keyof Options['Structs']
    ? Prettify<
        {
          type: 'tuple'
          components: Options['Structs'][Parameter['type']]
        } & (IsUnknown<Parameter['name']> extends false
          ? { name: Parameter['name'] }
          : object) &
          (Parameter['indexed'] extends true ? { indexed: true } : object)
      >
    : // Resolve tuple structs (e.g. `Foo[]`, `Foo[2]`, `Foo[][2]`, etc.)
    Parameter['type'] extends `${infer Type extends string &
        keyof Options['Structs']}[${infer Tail}]`
    ? Prettify<
        {
          type: `tuple[${Tail}]`
          components: Options['Structs'][Type]
        } & (IsUnknown<Parameter['name']> extends false
          ? { name: Parameter['name'] }
          : object) &
          (Parameter['indexed'] extends true ? { indexed: true } : object)
      >
    : // Return existing parameter without modification
      Parameter
  : never

type Modifier<AllowIndexed extends boolean> = Exclude<
  'calldata' | 'indexed' | 'memory' | 'storage',
  AllowIndexed extends true ? '' : 'indexed'
>

export type ParseParams<
  T extends string,
  Result extends unknown[] = [],
  Current extends string = '',
  Depth extends ReadonlyArray<number> = [],
> = T extends ''
  ? Current extends ''
    ? [...Result] // empty string was passed in to `ParseParams`
    : [...Result, Trim<Current>]
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
