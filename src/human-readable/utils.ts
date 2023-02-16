import type {
  AbiParameter,
  AbiStateMutability,
  SolidityFixedArrayRange,
} from '../abi'
import type { Filter, IsUnknown, Prettify, Trim } from '../types'
import type {
  ConstructorSignature,
  ErrorSignature,
  EventSignature,
  FallbackSignature,
  FunctionSignature,
  IsErrorSignature,
  IsEventSignature,
  IsFunctionSignature,
  ReceiveSignature,
  Scope,
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
      } extends infer Mapped extends readonly unknown[]
      ? Filter<Mapped, never>
      : never
    : never
  : never

// TODO
// - [ ] Vitest typechecks not working
// - [ ] TSDoc and comments
// - [ ] ParseAbi work for `string | readonly string[]`
// - [ ] Review signatures from contracts in the wild
// - [ ] ParseAbiParams  https://wagmi-dev.slack.com/archives/C041LADTUJH/p1676325558652399

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
              { Structs: TStructs }
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
              { Modifier: EventModifiers; Structs: TStructs }
            >
          }
        : never
      : never)
  | (IsFunctionSignature<TSignature> extends true
      ? TSignature extends FunctionSignature<infer Name, infer Tail>
        ? {
            name: Name
            type: 'function'
            stateMutability: ParseFunctionInputsAndStateMutability<TSignature>['StateMutability']
            inputs: ParseAbiParameters<
              ParseParams<
                ParseFunctionInputsAndStateMutability<TSignature>['Inputs']
              >,
              {
                Modifier: FunctionModifiers
                Structs: TStructs
              }
            >
            outputs: Tail extends `${string}returns (${infer Returns})`
              ? ParseAbiParameters<
                  ParseParams<Returns>,
                  {
                    Modifier: FunctionModifiers
                    Structs: TStructs
                  }
                >
              : []
          }
        : never
      : never)
  | (TSignature extends ConstructorSignature<infer Params>
      ? {
          type: 'constructor'
          inputs: ParseAbiParameters<ParseParams<Params>, { Structs: TStructs }>
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

type ParseFunctionInputsAndStateMutability<TSignature extends string> =
  TSignature extends `${infer Head}returns (${string})`
    ? ParseFunctionInputsAndStateMutability<Trim<Head>>
    : TSignature extends `function ${string}(${infer Params})`
    ? { Inputs: Params; StateMutability: 'nonpayable' }
    : TSignature extends `function ${string}(${infer Params}) ${infer ScopeOrStateMutability extends
        | Scope
        | AbiStateMutability
        | `${Scope} ${AbiStateMutability}`}`
    ? {
        Inputs: Params
        StateMutability: ScopeOrStateMutability extends `${Scope} ${infer StateMutability extends AbiStateMutability}`
          ? StateMutability
          : ScopeOrStateMutability
      }
    : never

export type ParseAbiParameters<
  T extends readonly string[],
  Options extends ParseOptions = DefaultParseOptions,
> = T extends ['']
  ? []
  : {
      [K in keyof T]: ParseAbiParameter<T[K], Options>
    }
type ParseOptions = { Modifier?: Modifier; Structs?: StructLookup | unknown }
type DefaultParseOptions = object
type Modifier = 'calldata' | 'indexed' | 'memory' | 'storage'
type FunctionModifiers = Exclude<Modifier, 'indexed'>
type EventModifiers = Extract<Modifier, 'indexed'>

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
      // TODO: Throw if struct (e.g. `{ type: 'Foo' }`) and name was not found in `Structs`
      Parameter
  : never

export type ParseTuple<
  T extends `(${string})${string}`,
  Options extends ParseOptions = DefaultParseOptions,
> =
  // Tuples without name or modifier (e.g. `(string)`, `(string foo)`)
  T extends `(${infer Params})`
    ? {
        type: 'tuple'
        components: ParseAbiParameters<
          ParseParams<Params>,
          Omit<Options, 'Modifier'>
        >
      }
    : // Array or fixed-length array tuples (e.g. `(string)[]`, `(string)[5]`)
    T extends `(${infer Head})[${'' | `${SolidityFixedArrayRange}`}]`
    ? T extends `(${Head})[${infer Size}]`
      ? {
          type: `tuple[${Size}]`
          components: ParseAbiParameters<
            ParseParams<Head>,
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
              ParseParams<Head>,
              Omit<Options, 'Modifier'>
            >
          } & SplitNameOrModifier<NameOrModifier, Options>
        >
      : never
    : // Tuples with name and/or modifier attached (e.g. `(string) foo`, `(string bar) foo`)
    T extends `(${infer Params}) ${infer NameOrModifier}`
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
                ParseParams<`${Params}) ${Parts['End']}`>,
                Omit<Options, 'Modifier'>
              >
            } & SplitNameOrModifier<Parts['NameOrModifier'], Options>
          >
        : never
      : Prettify<
          {
            type: 'tuple'
            components: ParseAbiParameters<
              ParseParams<Params>,
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
