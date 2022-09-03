import {
  Abi,
  AbiParameter,
  AbiStateMutability,
  AbiType,
  Address,
  SolidityAddress,
  SolidityArray,
  SolidityBool,
  SolidityBytes,
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

export type Contract<TAbi extends Abi> = {
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
          > extends readonly any[]
            ? AbiParametersToPrimitiveTypes<K['inputs']>
            : never
        ) => AbiParametersToPrimitiveTypes<K['outputs']>['length'] extends 0
          ? void
          : AbiParametersToPrimitiveTypes<K['outputs']>['length'] extends 1
          ? AbiParametersToPrimitiveTypes<K['outputs']>[0]
          : AbiParametersToPrimitiveTypes<K['outputs']>
      : never
  }
}
