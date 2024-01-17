import {
  type AbiParameter,
  type AbiStateMutability,
  type AbiType,
  type SolidityFixedArrayRange,
} from '../../abi.js'
import { type ResolvedRegister } from '../../register.js'
import {
  type Error,
  type IsUnknown,
  type Merge,
  type Pretty,
  type Trim,
} from '../../types.js'
import {
  type ErrorSignature,
  type EventModifier,
  type EventSignature,
  type FallbackSignature,
  type FunctionModifier,
  type FunctionSignature,
  type IsConstructorSignature,
  type IsErrorSignature,
  type IsEventSignature,
  type IsFunctionSignature,
  type Modifier,
  type ReceiveSignature,
  type Scope,
  type ValidateName,
} from './signatures.js'
import { type StructLookup } from './structs.js'

export type ParseSignature<
  signature extends string,
  structs extends StructLookup | unknown = unknown,
> =
  | (IsErrorSignature<signature> extends true
      ? signature extends ErrorSignature<infer name, infer parameters>
        ? {
            readonly name: name
            readonly type: 'error'
            readonly inputs: ParseAbiParameters<
              SplitParameters<parameters>,
              { Structs: structs }
            >
          }
        : never
      : never)
  | (IsEventSignature<signature> extends true
      ? signature extends EventSignature<infer name, infer parameters>
        ? {
            readonly name: name
            readonly type: 'event'
            readonly inputs: ParseAbiParameters<
              SplitParameters<parameters>,
              { Modifier: EventModifier; Structs: structs }
            >
          }
        : never
      : never)
  | (IsFunctionSignature<signature> extends true
      ? signature extends FunctionSignature<infer name, infer tail>
        ? {
            readonly name: name
            readonly type: 'function'
            readonly stateMutability: _ParseFunctionParametersAndStateMutability<signature>['StateMutability']
            readonly inputs: ParseAbiParameters<
              SplitParameters<
                _ParseFunctionParametersAndStateMutability<signature>['Inputs']
              >,
              { Modifier: FunctionModifier; Structs: structs }
            >
            readonly outputs: tail extends
              | `${string}returns (${infer returns})`
              | `${string}returns(${infer returns})`
              ? ParseAbiParameters<
                  SplitParameters<returns>,
                  { Modifier: FunctionModifier; Structs: structs }
                >
              : readonly []
          }
        : never
      : never)
  | (IsConstructorSignature<signature> extends true
      ? {
          readonly type: 'constructor'
          readonly stateMutability: _ParseConstructorParametersAndStateMutability<signature>['StateMutability']
          readonly inputs: ParseAbiParameters<
            SplitParameters<
              _ParseConstructorParametersAndStateMutability<signature>['Inputs']
            >,
            { Structs: structs }
          >
        }
      : never)
  | (signature extends FallbackSignature<infer stateMutability>
      ? {
          readonly type: 'fallback'
          readonly stateMutability: stateMutability extends `${string}payable`
            ? 'payable'
            : 'nonpayable'
        }
      : never)
  | (signature extends ReceiveSignature
      ? {
          readonly type: 'receive'
          readonly stateMutability: 'payable'
        }
      : never)

type ParseOptions = {
  Modifier?: Modifier
  Structs?: StructLookup | unknown
}
type DefaultParseOptions = object

export type ParseAbiParameters<
  type extends readonly string[],
  options extends ParseOptions = DefaultParseOptions,
> = type extends ['']
  ? readonly []
  : readonly [
      ...{
        [K in keyof type]: ParseAbiParameter<type[K], options>
      },
    ]

export type ParseAbiParameter<
  type extends string,
  options extends ParseOptions = DefaultParseOptions,
> = (
  type extends `(${string})${string}`
    ? _ParseTuple<type, options>
    : // Convert string to shallow AbiParameter (structs resolved yet)
    // Check for `${Type} ${NameOrModifier}` format (e.g. `uint256 foo`, `uint256 indexed`, `uint256 indexed foo`)

    type extends `${infer type2} ${infer tail}`
    ? Trim<tail> extends infer Trimmed extends string
      ? // TODO: data location modifiers only allowed for struct/array types
        { readonly type: Trim<type2> } & _SplitNameOrModifier<Trimmed, options>
      : never
    : // Must be `${Type}` format (e.g. `uint256`)
      { readonly type: type }
) extends infer shallowParameter extends AbiParameter & {
  type: string
  indexed?: boolean
}
  ? // Resolve struct types
    // Starting with plain struct types (e.g. `Foo`)
    (
      shallowParameter['type'] extends keyof options['Structs']
        ? {
            readonly type: 'tuple'
            readonly components: options['Structs'][shallowParameter['type']]
          } & (IsUnknown<shallowParameter['name']> extends false
            ? { readonly name: shallowParameter['name'] }
            : object) &
            (shallowParameter['indexed'] extends true
              ? { readonly indexed: true }
              : object)
        : // Resolve tuple structs (e.g. `Foo[]`, `Foo[2]`, `Foo[][2]`, etc.)
        shallowParameter['type'] extends `${infer type extends string &
            keyof options['Structs']}[${infer tail}]`
        ? {
            readonly type: `tuple[${tail}]`
            readonly components: options['Structs'][type]
          } & (IsUnknown<shallowParameter['name']> extends false
            ? { readonly name: shallowParameter['name'] }
            : object) &
            (shallowParameter['indexed'] extends true
              ? { readonly indexed: true }
              : object)
        : // Not a struct, just return
          shallowParameter
    ) extends infer parameter extends AbiParameter & {
      type: string
      indexed?: boolean
    }
    ? Pretty<_ValidateAbiParameter<parameter>>
    : never
  : never

export type SplitParameters<
  type extends string,
  result extends unknown[] = [],
  current extends string = '',
  depth extends readonly number[] = [],
> = type extends ''
  ? current extends ''
    ? [...result] // empty string was passed in to `SplitParameters`
    : depth['length'] extends 0
    ? [...result, Trim<current>]
    : Error<`Unbalanced parentheses. "${current}" has too many opening parentheses.`>
  : type extends `${infer char}${infer rest}`
  ? char extends ','
    ? depth['length'] extends 0
      ? SplitParameters<rest, [...result, Trim<current>], ''>
      : SplitParameters<rest, result, `${current}${char}`, depth>
    : char extends '('
    ? SplitParameters<rest, result, `${current}${char}`, [...depth, 1]>
    : char extends ')'
    ? depth['length'] extends 0
      ? Error<`Unbalanced parentheses. "${current}" has too many closing parentheses.`>
      : SplitParameters<rest, result, `${current}${char}`, Pop<depth>>
    : SplitParameters<rest, result, `${current}${char}`, depth>
  : []
type Pop<type extends readonly number[]> = type extends [...infer rest, any]
  ? rest
  : []

export type _ValidateAbiParameter<abiParameter extends AbiParameter> =
  // Validate `name`
  (
    abiParameter extends { name: string }
      ? ValidateName<abiParameter['name']> extends infer name
        ? name extends abiParameter['name']
          ? abiParameter
          : // Add `Error` as `name`
            Merge<abiParameter, { readonly name: name }>
        : never
      : abiParameter
  ) extends infer parameter
    ? // Validate `type` against `AbiType`
      (
        ResolvedRegister['StrictAbiType'] extends true
          ? parameter extends { type: AbiType }
            ? parameter
            : Merge<
                parameter,
                {
                  readonly type: Error<`Type "${parameter extends {
                    type: string
                  }
                    ? parameter['type']
                    : string}" is not a valid ABI type.`>
                }
              >
          : parameter
      ) extends infer parameter2 extends { type: unknown }
      ? // Convert `(u)int` to `(u)int256`
        parameter2['type'] extends `${infer prefix extends
          | 'u'
          | ''}int${infer suffix extends `[${string}]` | ''}`
        ? Pretty<
            Merge<parameter2, { readonly type: `${prefix}int256${suffix}` }>
          >
        : parameter2
      : never
    : never

export type _ParseFunctionParametersAndStateMutability<
  signature extends string,
> = signature extends
  | `${infer head}returns (${string})`
  | `${infer head}returns(${string})`
  ? _ParseFunctionParametersAndStateMutability<Trim<head>>
  : signature extends `function ${string}(${infer parameters})`
  ? { Inputs: parameters; StateMutability: 'nonpayable' }
  : signature extends `function ${string}(${infer parameters}) ${infer scopeOrStateMutability extends
      | Scope
      | AbiStateMutability
      | `${Scope} ${AbiStateMutability}`}`
  ? {
      Inputs: parameters
      StateMutability: scopeOrStateMutability extends `${Scope} ${infer stateMutability extends AbiStateMutability}`
        ? stateMutability
        : scopeOrStateMutability extends AbiStateMutability
        ? scopeOrStateMutability
        : 'nonpayable'
    }
  : never

type _ParseConstructorParametersAndStateMutability<signature extends string,> =
  signature extends `constructor(${infer parameters}) payable`
    ? { Inputs: parameters; StateMutability: 'payable' }
    : signature extends `constructor(${infer parameters})`
    ? { Inputs: parameters; StateMutability: 'nonpayable' }
    : never

export type _ParseTuple<
  type extends `(${string})${string}`,
  options extends ParseOptions = DefaultParseOptions,
> = /** Tuples without name or modifier (e.g. `(string)`, `(string foo)`) */
type extends `(${infer parameters})`
  ? {
      readonly type: 'tuple'
      readonly components: ParseAbiParameters<
        SplitParameters<parameters>,
        Omit<options, 'Modifier'>
      >
    }
  : // Array or fixed-length array tuples (e.g. `(string)[]`, `(string)[5]`)
  type extends `(${infer head})[${'' | `${SolidityFixedArrayRange}`}]`
  ? type extends `(${head})[${infer size}]`
    ? {
        readonly type: `tuple[${size}]`
        readonly components: ParseAbiParameters<
          SplitParameters<head>,
          Omit<options, 'Modifier'>
        >
      }
    : never
  : // Array or fixed-length array tuples with name and/or modifier attached (e.g. `(string)[] foo`, `(string)[5] foo`)
  type extends `(${infer parameters})[${
      | ''
      | `${SolidityFixedArrayRange}`}] ${infer nameOrModifier}`
  ? type extends `(${parameters})[${infer size}] ${nameOrModifier}`
    ? nameOrModifier extends `${string}) ${string}`
      ? _UnwrapNameOrModifier<nameOrModifier> extends infer parts extends {
          NameOrModifier: string
          End: string
        }
        ? {
            readonly type: 'tuple'
            readonly components: ParseAbiParameters<
              SplitParameters<`${parameters})[${size}] ${parts['End']}`>,
              Omit<options, 'Modifier'>
            >
          } & _SplitNameOrModifier<parts['NameOrModifier'], options>
        : never
      : {
          readonly type: `tuple[${size}]`
          readonly components: ParseAbiParameters<
            SplitParameters<parameters>,
            Omit<options, 'Modifier'>
          >
        } & _SplitNameOrModifier<nameOrModifier, options>
    : never
  : // Tuples with name and/or modifier attached (e.g. `(string) foo`, `(string bar) foo`)
  type extends `(${infer parameters}) ${infer nameOrModifier}`
  ? // Check that `NameOrModifier` didn't get matched to `baz) bar) foo` (e.g. `(((string) baz) bar) foo`)
    nameOrModifier extends `${string}) ${string}`
    ? _UnwrapNameOrModifier<nameOrModifier> extends infer parts extends {
        NameOrModifier: string
        End: string
      }
      ? {
          readonly type: 'tuple'
          readonly components: ParseAbiParameters<
            SplitParameters<`${parameters}) ${parts['End']}`>,
            Omit<options, 'Modifier'>
          >
        } & _SplitNameOrModifier<parts['NameOrModifier'], options>
      : never
    : {
        readonly type: 'tuple'
        readonly components: ParseAbiParameters<
          SplitParameters<parameters>,
          Omit<options, 'Modifier'>
        >
      } & _SplitNameOrModifier<nameOrModifier, options>
  : never

// Split name and modifier (e.g. `indexed foo` => `{ name: 'foo', indexed: true }`)
export type _SplitNameOrModifier<
  type extends string,
  options extends ParseOptions = DefaultParseOptions,
> = Trim<type> extends infer trimmed
  ? options extends { Modifier: Modifier }
    ? // TODO: Check that modifier is allowed
      trimmed extends `${infer mod extends options['Modifier']} ${infer name}`
      ? Pretty<
          { readonly name: Trim<name> } & (mod extends 'indexed'
            ? { readonly indexed: true }
            : object)
        >
      : trimmed extends options['Modifier']
      ? trimmed extends 'indexed'
        ? { readonly indexed: true }
        : object
      : { readonly name: trimmed }
    : { readonly name: trimmed }
  : never

// `baz) bar) foo` (e.g. `(((string) baz) bar) foo`)
export type _UnwrapNameOrModifier<
  type extends string,
  current extends string = '',
> = type extends `${infer head}) ${infer tail}`
  ? _UnwrapNameOrModifier<
      tail,
      `${current}${current extends '' ? '' : ') '}${head}`
    >
  : { End: Trim<current>; NameOrModifier: Trim<type> }
