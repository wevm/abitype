import type {
  AbiParameter,
  AbiStateMutability,
  SolidityFixedArrayRange,
} from '../../abi'
import type { IsUnknown, Prettify, Trim } from '../../types'
import type {
  ConstructorSignature,
  ErrorSignature,
  EventModifiers,
  EventSignature,
  FallbackSignature,
  FunctionModifiers,
  FunctionSignature,
  IsErrorSignature,
  IsEventSignature,
  IsFunctionSignature,
  Modifier,
  ReceiveSignature,
  Scope,
} from './signatures'
import type { StructLookup } from './structs'

export type ParseSignature<
  TSignature extends string,
  TStructs extends StructLookup | unknown = unknown,
> =
  | (IsErrorSignature<TSignature> extends true
      ? TSignature extends ErrorSignature<infer Name, infer Parameters>
        ? {
            readonly name: Name
            readonly type: 'error'
            readonly inputs: ParseAbiParameters<
              SplitParameters<Parameters>,
              { Structs: TStructs }
            >
          }
        : never
      : never)
  | (IsEventSignature<TSignature> extends true
      ? TSignature extends EventSignature<infer Name, infer Parameters>
        ? {
            readonly name: Name
            readonly type: 'event'
            readonly inputs: ParseAbiParameters<
              SplitParameters<Parameters>,
              { Modifier: EventModifiers; Structs: TStructs }
            >
          }
        : never
      : never)
  | (IsFunctionSignature<TSignature> extends true
      ? TSignature extends FunctionSignature<infer Name, infer Tail>
        ? {
            readonly name: Name
            readonly type: 'function'
            readonly stateMutability: ParseFunctionInputsAndStateMutability<TSignature>['StateMutability']
            readonly inputs: ParseAbiParameters<
              SplitParameters<
                ParseFunctionInputsAndStateMutability<TSignature>['Inputs']
              >,
              {
                Modifier: FunctionModifiers
                Structs: TStructs
              }
            >
            readonly outputs: Tail extends `${string}returns (${infer Returns})`
              ? ParseAbiParameters<
                  SplitParameters<Returns>,
                  {
                    Modifier: FunctionModifiers
                    Structs: TStructs
                  }
                >
              : readonly []
          }
        : never
      : never)
  | (TSignature extends ConstructorSignature<infer Parameters>
      ? {
          readonly type: 'constructor'
          readonly stateMutability: 'nonpayable'
          readonly inputs: ParseAbiParameters<
            SplitParameters<Parameters>,
            { Structs: TStructs }
          >
        }
      : never)
  | (TSignature extends FallbackSignature
      ? {
          readonly type: 'fallback'
        }
      : never)
  | (TSignature extends ReceiveSignature
      ? {
          readonly type: 'receive'
          readonly stateMutability: 'payable'
        }
      : never)

type ParseFunctionInputsAndStateMutability<TSignature extends string> =
  TSignature extends `${infer Head}returns (${string})`
    ? ParseFunctionInputsAndStateMutability<Trim<Head>>
    : TSignature extends `function ${string}(${infer Parameters})`
    ? { Inputs: Parameters; StateMutability: 'nonpayable' }
    : TSignature extends `function ${string}(${infer Parameters}) ${infer ScopeOrStateMutability extends
        | Scope
        | AbiStateMutability
        | `${Scope} ${AbiStateMutability}`}`
    ? {
        Inputs: Parameters
        StateMutability: ScopeOrStateMutability extends `${Scope} ${infer StateMutability extends AbiStateMutability}`
          ? StateMutability
          : ScopeOrStateMutability
      }
    : never

export type ParseAbiParameters<
  T extends readonly string[],
  Options extends ParseOptions = DefaultParseOptions,
> = T extends ['']
  ? readonly []
  : readonly [
      ...{
        [K in keyof T]: ParseAbiParameter<T[K], Options>
      },
    ]
type ParseOptions = { Modifier?: Modifier; Structs?: StructLookup | unknown }
type DefaultParseOptions = object

export type ParseAbiParameter<
  T extends string,
  Options extends ParseOptions = DefaultParseOptions,
> = T extends `(${string})${string}`
  ? ParseTuple<T, Options>
  : // Convert string to basic AbiParameter (structs resolved yet)
  // Check for `${Type} ${NameOrModifier}` format (e.g. `uint256 foo`, `uint256 indexed`, `uint256 indexed foo`)
  (
      T extends `${infer Type} ${infer Tail}`
        ? Trim<Tail> extends infer Trimmed extends string
          ? Prettify<
              { type: Trim<Type> } & SplitNameOrModifier<Trimmed, Options>
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
      // TODO: Bubble up error if struct (e.g. `{ type: 'Foo' }`) and name was not found in `Structs`
      Parameter
  : never

export type ParseTuple<
  T extends `(${string})${string}`,
  Options extends ParseOptions = DefaultParseOptions,
> =
  // Tuples without name or modifier (e.g. `(string)`, `(string foo)`)
  T extends `(${infer Parameters})`
    ? {
        type: 'tuple'
        components: ParseAbiParameters<
          SplitParameters<Parameters>,
          Omit<Options, 'Modifier'>
        >
      }
    : // Array or fixed-length array tuples (e.g. `(string)[]`, `(string)[5]`)
    T extends `(${infer Head})[${'' | `${SolidityFixedArrayRange}`}]`
    ? T extends `(${Head})[${infer Size}]`
      ? {
          type: `tuple[${Size}]`
          components: ParseAbiParameters<
            SplitParameters<Head>,
            Omit<Options, 'Modifier'>
          >
        }
      : never
    : // Array or fixed-length array tuples with name and/or modifier attached (e.g. `(string)[] foo`, `(string)[5] foo`)
    T extends `(${infer Head})[${
        | ''
        | `${SolidityFixedArrayRange}`}] ${infer NameOrModifier}`
    ? T extends `(${Head})[${infer Size}] ${NameOrModifier}`
      ? Prettify<
          {
            type: `tuple[${Size}]`
            components: ParseAbiParameters<
              SplitParameters<Head>,
              Omit<Options, 'Modifier'>
            >
          } & SplitNameOrModifier<NameOrModifier, Options>
        >
      : never
    : // Tuples with name and/or modifier attached (e.g. `(string) foo`, `(string bar) foo`)
    T extends `(${infer Parameters}) ${infer NameOrModifier}`
    ? // Check that `NameOrModifier` didn't get matched to `baz) bar) foo` (e.g. `(((string) baz) bar) foo`)
      NameOrModifier extends `${string}) ${string}`
      ? UnwrapNameOrModifier<NameOrModifier> extends infer Parts extends {
          NameOrModifier: string
          End: string
        }
        ? Prettify<
            {
              type: 'tuple'
              components: ParseAbiParameters<
                SplitParameters<`${Parameters}) ${Parts['End']}`>,
                Omit<Options, 'Modifier'>
              >
            } & SplitNameOrModifier<Parts['NameOrModifier'], Options>
          >
        : never
      : Prettify<
          {
            type: 'tuple'
            components: ParseAbiParameters<
              SplitParameters<Parameters>,
              Omit<Options, 'Modifier'>
            >
          } & SplitNameOrModifier<NameOrModifier, Options>
        >
    : never

// Split name and modifier (e.g. `indexed foo` => `{ name: 'foo', indexed: true }`)
type SplitNameOrModifier<
  T extends string,
  Options extends ParseOptions = DefaultParseOptions,
> = Trim<T> extends infer Trimmed
  ? Options extends { Modifier: Modifier }
    ? Trimmed extends `${infer Mod extends Options['Modifier']} ${infer Name}`
      ? { name: Trim<Name> } & (Mod extends 'indexed'
          ? { indexed: true }
          : object)
      : Trimmed extends Options['Modifier']
      ? Trimmed extends 'indexed'
        ? { indexed: true }
        : object
      : { name: Trimmed }
    : { name: Trimmed }
  : never

// `baz) bar) foo` (e.g. `(((string) baz) bar) foo`)
type UnwrapNameOrModifier<
  T extends string,
  Current extends string = '',
> = T extends `${infer Head}) ${infer Tail}`
  ? UnwrapNameOrModifier<
      Tail,
      `${Current}${Current extends '' ? '' : ') '}${Head}`
    >
  : { End: Trim<Current>; NameOrModifier: Trim<T> }

export type SplitParameters<
  T extends string,
  Result extends unknown[] = [],
  Current extends string = '',
  Depth extends ReadonlyArray<number> = [],
> = T extends ''
  ? Current extends ''
    ? [...Result] // empty string was passed in to `ParseParameters`
    : [...Result, Trim<Current>]
  : Depth['length'] extends 0
  ? T extends `${infer Head}${infer Tail}`
    ? Head extends ','
      ? SplitParameters<Tail, [...Result, Trim<Current>], ''>
      : Head extends '('
      ? SplitParameters<Tail, Result, `${Current}${Head}`, [...Depth, 1]>
      : SplitParameters<Tail, Result, `${Current}${Head}`>
    : []
  : T extends `${infer Char}${infer Rest}`
  ? Char extends '('
    ? SplitParameters<Rest, Result, `${Current}${Char}`, [...Depth, 1]>
    : Char extends ')'
    ? SplitParameters<Rest, Result, `${Current}${Char}`, Pop<Depth>>
    : SplitParameters<Rest, Result, `${Current}${Char}`, Depth>
  : []
type Pop<T extends ReadonlyArray<number>> = T extends [...infer R, any] ? R : []
