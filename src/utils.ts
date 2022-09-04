import {
  Abi,
  AbiParameter,
  AbiStateMutability,
  AbiType,
  Address,
  Solidity2DArray,
  SolidityAddress,
  SolidityArray,
  SolidityBool,
  SolidityBytes,
  SolidityFixed2DArraySizeLookup,
  SolidityFixedArraySizeLookup,
  SolidityFunction,
  SolidityInt,
  SolidityString,
  SolidityTuple,
} from './abi'
import { Tuple } from './types'

/**
 * Converts {@link AbiType} to corresponding TypeScript primitive type.
 *
 * Does not include full array or tuple conversion. Use {@link AbiParameterToPrimitiveType} to fully convert arrays and tuples.
 *
 * @param TAbiType - {@link AbiType} to convert to TypeScript representation
 * @returns TypeScript primitive type
 */
// TODO: Clean this up with a map
// https://twitter.com/SeaRyanC/status/1538971176357113858
export type AbiTypeToPrimitiveType<TAbiType extends AbiType> =
  TAbiType extends SolidityAddress
    ? Address
    : TAbiType extends SolidityFunction
    ? `${Address}${string}`
    : TAbiType extends SolidityString
    ? string
    : TAbiType extends SolidityBool
    ? boolean
    : TAbiType extends SolidityBytes
    ? string | ArrayLike<number>
    : TAbiType extends SolidityInt
    ? bigint | number
    : TAbiType extends SolidityTuple
    ? Record<string, unknown>
    : TAbiType extends SolidityArray
    ? unknown[]
    : TAbiType extends Solidity2DArray
    ? unknown[][]
    : unknown

/**
 * Converts {@link AbiParameter} to corresponding TypeScript primitive type.
 *
 * @param TAbiParameter - {@link AbiParameter} to convert to TypeScript representation
 * @returns TypeScript primitive type
 */
export type AbiParameterToPrimitiveType<TAbiParameter extends AbiParameter> =
  TAbiParameter['type'] extends `${infer Type}[${infer Size}]`
    ? Size extends keyof SolidityFixedArraySizeLookup
      ? Tuple<
          AbiParameterToPrimitiveType<
            ConvertAbiParameterType<TAbiParameter, Type>
          >,
          SolidityFixedArraySizeLookup[Size]
        >
      : Size extends `${infer Size1}][${infer Size2}`
      ? Size2 extends keyof SolidityFixed2DArraySizeLookup
        ? Tuple<
            AbiParameterToPrimitiveType<
              ConvertAbiParameterType<TAbiParameter, `${Type}[${Size1}]`>
            >,
            SolidityFixed2DArraySizeLookup[Size2]
          >
        : AbiParameterToPrimitiveType<
            ConvertAbiParameterType<TAbiParameter, `${Type}[${Size1}]`>
          >[]
      : AbiParameterToPrimitiveType<
          ConvertAbiParameterType<TAbiParameter, Type>
        >[]
    : TAbiParameter['type'] extends SolidityTuple
    ? {
        [Component in (TAbiParameter & {
          components: AbiParameter[]
        })['components'][number] as Component['name']]: AbiParameterToPrimitiveType<Component>
      }
    : AbiTypeToPrimitiveType<TAbiParameter['type']>

type ConvertAbiParameterType<
  TAbiParameter extends AbiParameter,
  TType extends AbiType | string,
> = {
  [Property in keyof Omit<TAbiParameter, 'type'>]: TAbiParameter[Property]
} & { type: TType extends AbiType ? TType : any }

/**
 * Converts array of {@link AbiParameter} to corresponding TypeScript primitive types.
 *
 * @param TAbiParameters - Array of {@link AbiParameter} to convert to TypeScript representations
 * @returns Array of TypeScript primitive types
 */
export type AbiParametersToPrimitiveTypes<
  TAbiParameters extends readonly AbiParameter[],
> = {
  // TODO: Convert to labeled tuple so parameter names show up in autocomplete
  // e.g. [foo: string, bar: string]
  // https://github.com/microsoft/TypeScript/issues/44939
  [K in keyof TAbiParameters]: AbiParameterToPrimitiveType<TAbiParameters[K]>
}

/**
 * Checks if type is {@link Abi}.
 *
 * @param TAbi - {@link Abi} to check
 * @returns Boolean for whether {@link TAbi} is {@link Abi}
 */
export type IsAbi<TAbi> = TAbi extends Abi ? true : false

////////////////////////////////////////////////////////////////////////////////////////////////////

// Abi Functions

/**
 * Extracts all {@link AbiFunction} types from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract functions from
 * @param TAbiStateMutibility - {@link AbiStateMutability} to filter by
 * @returns All {@link AbiFunction} types from {@link Abi}
 */
export type ExtractAbiFunctions<
  TAbi extends Abi,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: 'function'; stateMutability: TAbiStateMutibility }
>

/**
 * Extracts all {@link AbiFunction} names from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract function names from
 * @param TAbiStateMutibility - {@link AbiStateMutability} to filter by
 * @returns Union of function names
 */
export type ExtractAbiFunctionNames<
  TAbi extends Abi,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = ExtractAbiFunctions<TAbi, TAbiStateMutibility>['name']

/**
 * Extracts {@link AbiFunction} with name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiFunction} from
 * @param TFunctionName - String name of function to extract from {@link Abi}
 * @returns Matching {@link AbiFunction}
 */
export type ExtractAbiFunction<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = Extract<ExtractAbiFunctions<TAbi>, { name: TFunctionName }>

////////////////////////////////////////////////////////////////////////////////////////////////////

// Abi Events

/**
 * Extracts all {@link AbiEvent} types from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract events from
 * @returns All {@link AbiEvent} types from {@link Abi}
 */
export type ExtractAbiEvents<TAbi extends Abi> = Extract<
  TAbi[number],
  { type: 'event' }
>

/**
 * Extracts all {@link AbiEvent} names from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract event names from
 * @returns Union of event names
 */
export type ExtractAbiEventNames<TAbi extends Abi> =
  ExtractAbiEvents<TAbi>['name']

/**
 * Extracts {@link AbiEvent} with name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiEvent} from
 * @param TEventName - String name of event to extract from {@link Abi}
 * @returns Matching {@link AbiEvent}
 */
export type ExtractAbiEvent<
  TAbi extends Abi,
  TEventName extends ExtractAbiEventNames<TAbi>,
> = Extract<ExtractAbiEvents<TAbi>, { name: TEventName }>

////////////////////////////////////////////////////////////////////////////////////////////////////

// Abi Errors

/**
 * Extracts all {@link AbiError} types from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract errors from
 * @returns All {@link AbiError} types from {@link Abi}
 */
export type ExtractAbiErrors<TAbi extends Abi> = Extract<
  TAbi[number],
  { type: 'error' }
>

/**
 * Extracts all {@link AbiError} names from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract error names from
 * @returns Union of error names
 */
export type ExtractAbiErrorNames<TAbi extends Abi> =
  ExtractAbiErrors<TAbi>['name']

/**
 * Extracts {@link AbiError} with name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiError} from
 * @param TErrorName - String name of error to extract from {@link Abi}
 * @returns Matching {@link AbiError}
 */
export type ExtractAbiError<
  TAbi extends Abi,
  TErrorName extends ExtractAbiErrorNames<TAbi>,
> = Extract<ExtractAbiErrors<TAbi>, { name: TErrorName }>

/**
 * Generates object containing {@link AbiFunction} and {@link AbiEvent} signatures.
 *
 * @param TAbi - {@link Abi} to generate signatures from
 * @returns Object containing {@link AbiFunction} and {@link AbiEvent} signatures
 */
export type Contract<TAbi extends readonly unknown[]> = TAbi extends Abi
  ? {
      events: {
        [K in TAbi[number] as K extends { name: infer TName; type: 'event' }
          ? TName
          : never]: K extends { name: string; type: 'event' }
          ? (
              ...args: AbiParametersToPrimitiveTypes<
                K['inputs']
              > extends readonly any[]
                ? AbiParametersToPrimitiveTypes<K['inputs']>
                : never
            ) => void
          : never
      }
      functions: {
        [K in TAbi[number] as K extends { name: infer TName; type: 'function' }
          ? TName
          : never]: K extends { name: string; type: 'function' }
          ? (
              ...args: AbiParametersToPrimitiveTypes<
                K['inputs']
              > extends infer Inputs
                ? Inputs extends readonly any[]
                  ? Inputs
                  : never
                : never
            ) => AbiParametersToPrimitiveTypes<
              K['outputs']
            > extends infer Outputs extends readonly any[]
              ? Outputs['length'] extends 0
                ? void
                : Outputs['length'] extends 1
                ? Outputs[0]
                : // eslint-disable-next-line @typescript-eslint/no-unused-vars
                Outputs extends readonly [infer _Head, ...infer _Tail]
                ? Outputs
                : /**
                   * TODO: Infer non-constant array types
                   * Expected: [{ type: 'string', name: 'foo' }] => string, actual: string[]
                   * Expected: [{ type: 'string[]', name: 'foo' }] => string[], actual: string[][]
                   * Expected: [{ type: 'string[]', name: 'foo' }, { type: 'uint256', name: 'bar' }] => (string[] | number | bigint)[], actual: (number | bigint | unknown[])[]
                   *
                   * Until then, we'll just return `any` for non-constant array types
                   */
                  any
              : never
          : never
      }
    }
  : {
      events: {
        [key: string]: (...args: any | any[]) => void
      }
      functions: {
        [key: string]: (...args: any | any[]) => any
      }
    }
