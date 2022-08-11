import {
  Abi,
  AbiParameter,
  AbiParameterType,
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
            ChangeAbiParameterType<TAbiParameter, Type>
          >,
          SolidityFixedArraySizeLookup[Size]
        >
      : AbiParameterToPrimitiveType<
          ChangeAbiParameterType<TAbiParameter, Type>
        >[]
    : TAbiParameter['type'] extends `${SolidityTuple}${'' | '[]'}`
    ? {
        [Component in (TAbiParameter & {
          components: AbiParameter[]
        })['components'][number] as Component['name']]: AbiParameterToPrimitiveType<Component>
      }
    : AbiTypeToPrimitiveType<TAbiParameter['type']>

type ChangeAbiParameterType<
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
  // TODO: Convert to named tuple so parameter names show up in autocomplete
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

/**
 * Extracts {@link AbiParameter} types for function name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiParameter}s from
 * @param TFunctionName - String name of function
 * @param TAbiParameterType - {@link AbiParameterType} to extract parameters
 * @returns Array of {@link AbiParameter}
 */
export type ExtractAbiFunctionParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TAbiParameterType extends AbiParameterType,
> = ExtractAbiFunction<TAbi, TFunctionName>[TAbiParameterType]

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

/**
 * Extracts {@link AbiParameter} types for event name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiParameter}s from
 * @param TEventName - String name of event
 * @returns Array of {@link AbiParameter}
 */
export type ExtractAbiEventParameters<
  TAbi extends Abi,
  TEventName extends ExtractAbiEventNames<TAbi>,
> = ExtractAbiEvent<TAbi, TEventName>['inputs']

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
 * Extracts {@link AbiParameter} types for error name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiParameter}s from
 * @param TErrorName - String name of error
 * @returns Array of {@link AbiParameter}
 */
export type ExtractAbiErrorParameters<
  TAbi extends Abi,
  TErrorName extends ExtractAbiErrorNames<TAbi>,
> = ExtractAbiError<TAbi, TErrorName>['inputs']
