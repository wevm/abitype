import type { AbiParameter, SolidityFixedArrayRange } from '../abi'
import type { Filter, IsUnknown, Prettify, Trim } from '../types'
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
      } extends infer Mapped extends readonly unknown[]
      ? Filter<Mapped, never>
      : never
    : never
  : never

// TODO
// - [ ] Function signatures (parse out params and returns, make sure function overloads work)
// - [ ] Modifiers only allowed at top-level (e.g. `indexed`), extract out name/modifier parse logic
// - [ ] TSDoc and comments
// - [ ] ParseAbi work for string | readonly string[]
// - [ ] Review signatures from contracts in the wild

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
          name: unknown
          type: 'function'
          stateMutability: unknown
          inputs: unknown[]
          outputs: unknown[]
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
  ? ParseTuple<T, Options>
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

export type ParseTuple<
  T extends `(${string})${string}`,
  Options extends ParseOptions = DefaultParseOptions,
> =
  // Tuples without name or modifier (e.g. `(string)`, `(string foo)`)
  T extends `(${infer Params})`
    ? {
        type: 'tuple'
        components: ParseAbiParameters<ParseParams<Params>, Options>
      }
    : // Array or fixed-length array tuples (e.g. `(string)[]`, `(string)[5]`)
    T extends `${infer Head}[${'' | `${SolidityFixedArrayRange}`}]`
    ? T extends `${Head}[${infer Size}]`
      ? {
          type: `tuple[${Size}]`
          components: ParseAbiParameters<ParseParams<Head>, Options>
        }
      : never
    : // Array or fixed-length array tuples with name and/or modifier attached (e.g. `(string)[] foo`, `(string)[5] foo`)
    T extends `${infer Head}[${
        | ''
        | `${SolidityFixedArrayRange}`}] ${infer NameOrModifier}`
    ? T extends `${Head}[${infer Size}] ${NameOrModifier}`
      ? Prettify<
          {
            type: `tuple[${Size}]`
            components: ParseAbiParameters<ParseParams<Head>, Options>
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
                Options
              >
            } & SplitNameOrModifier<Parts['NameOrModifier'], Options>
          >
        : never
      : Prettify<
          {
            type: 'tuple'
            components: ParseAbiParameters<ParseParams<Params>, Options>
          } & SplitNameOrModifier<NameOrModifier, Options>
        >
    : never

// Split name and modifier (e.g. `indexed foo` => `{ name: 'foo', indexed: true }`)
type SplitNameOrModifier<
  T extends string,
  Options extends ParseOptions = DefaultParseOptions,
> = Trim<T> extends infer Trimmed
  ? Trimmed extends `${infer Mod extends Modifier<
      Options['AllowIndexed']
    >} ${infer Name}`
    ? { name: Trim<Name> } & (Mod extends 'indexed'
        ? { indexed: true }
        : object)
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