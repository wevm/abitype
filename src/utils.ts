import {
  Abi,
  AbiEvent,
  AbiFunction,
  AbiParameter,
  AbiStateMutability,
  AbiType,
  Address,
  SolidityAddress,
  SolidityArray,
  SolidityBool,
  SolidityBytes,
  SolidityFixedArrayRange,
  SolidityFixedArraySizeLookup,
  SolidityFunction,
  SolidityInt,
  SolidityString,
  SolidityTuple,
  TypedData,
} from './abi'
import { Merge, Tuple } from './types'

/**
 * Converts {@link AbiType} to corresponding TypeScript primitive type.
 *
 * Does not include full array or tuple conversion. Use {@link AbiParameterToPrimitiveType} to fully convert arrays and tuples.
 *
 * @param TAbiType - {@link AbiType} to convert to TypeScript representation
 * @returns TypeScript primitive type
 */
export type AbiTypeToPrimitiveType<TAbiType extends AbiType> =
  PrimitiveTypeLookup[TAbiType]

// Using a map to look up types faster
// s/o https://twitter.com/SeaRyanC/status/1538971176357113858
type PrimitiveTypeLookup = {
  [_ in SolidityAddress]: Address
} & {
  [_ in SolidityBool]: boolean
} & {
  [_ in SolidityBytes]: string | ArrayLike<number>
} & {
  [_ in SolidityFunction]: `${Address}${string}`
} & {
  [_ in SolidityInt]: number | bigint
} & {
  [_ in SolidityString]: string
} & {
  [_ in SolidityTuple]: Record<string, unknown>
} & {
  [_ in SolidityArray]: unknown[]
}

/**
 * Converts {@link AbiParameter} to corresponding TypeScript primitive type.
 *
 * @param TAbiParameter - {@link AbiParameter} to convert to TypeScript representation
 * @returns TypeScript primitive type
 */
export type AbiParameterToPrimitiveType<
  TAbiParameter extends AbiParameter | { name: string; type: unknown },
> = TAbiParameter['type'] extends Exclude<
  AbiType,
  SolidityTuple | SolidityArray
>
  ? AbiTypeToPrimitiveType<TAbiParameter['type']>
  : TAbiParameter['type'] extends SolidityTuple
  ? {
      [Component in (TAbiParameter & {
        components: AbiParameter[]
      })['components'][number] as Component['name']]: AbiParameterToPrimitiveType<Component>
    }
  : TAbiParameter['type'] extends `${infer Head}[${
      | ''
      | `${SolidityFixedArrayRange}`}]`
  ? TAbiParameter['type'] extends `${Head}[${infer Size}]`
    ? Size extends keyof SolidityFixedArraySizeLookup
      ? Tuple<
          AbiParameterToPrimitiveType<Merge<TAbiParameter, { type: Head }>>,
          SolidityFixedArraySizeLookup[Size]
        >
      : AbiParameterToPrimitiveType<Merge<TAbiParameter, { type: Head }>>[]
    : never
  : unknown

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

/**
 * Converts {@link AbiFunction} into TypeScript function signature.
 *
 * @param TAbiFunction - {@link AbiFunction} to convert
 * @returns Function signature
 */
export type AbiFunctionSignature<
  TAbiFunction extends AbiFunction & { type: 'function' },
> = (
  ...args: AbiParametersToPrimitiveTypes<
    TAbiFunction['inputs']
  > extends infer Inputs
    ? Inputs extends readonly any[]
      ? Inputs
      : never
    : never
) => AbiParametersToPrimitiveTypes<
  TAbiFunction['outputs']
> extends infer Outputs extends readonly any[]
  ? Outputs['length'] extends 0
    ? void
    : Outputs['length'] extends 1
    ? Outputs[0]
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Outputs extends readonly [...infer _]
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
 * Converts {@link AbiEvent} into TypeScript function signature.
 *
 * @param AbiEvent - {@link AbiEvent} to convert
 * @returns Function signature
 */
export type AbiEventSignature<TAbiEvent extends AbiEvent> = (
  ...args: AbiParametersToPrimitiveTypes<
    TAbiEvent['inputs']
  > extends infer Inputs
    ? Inputs extends readonly any[]
      ? Inputs
      : never
    : never
) => void

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

////////////////////////////////////////////////////////////////////////////////////////////////////
// Typed Data

/**
 * Converts {@link TTypedData} to corresponding TypeScript primitive types.
 *
 * @param TTypedData - {@link TypedData} to convert
 * @returns Union of TypeScript primitive types
 */
export type TypedDataToPrimitiveTypes<TTypedData extends TypedData> = {
  [K in keyof TTypedData]: {
    [K2 in TTypedData[K][number] as K2['name']]: K2['type'] extends keyof TTypedData
      ? TypedDataToPrimitiveTypes<Exclude<TTypedData, K>>[K2['type']]
      : K2['type'] extends `${infer TType extends keyof TTypedData &
          string}[${infer Tail}]`
      ? AbiParameterToPrimitiveType<
          Merge<
            K2,
            {
              type: `tuple[${Tail}]`
              components: _ConvertObjectsToComponents<
                TTypedData[TType],
                TTypedData
              >
            }
          >
        >
      : AbiParameterToPrimitiveType<K2>
  }
}

type _ConvertObjectsToComponents<
  TObjects extends readonly { name: string; type: unknown }[],
  TTypes extends TypedData,
> = {
  [K in keyof TObjects]: TObjects[K] extends infer TObject extends {
    name: string
    type: unknown
  }
    ? TObject['type'] extends keyof TTypes
      ? Merge<
          TObject,
          {
            type: `tuple`
            components: _ConvertObjectsToComponents<
              TTypes[TObject['type']],
              TTypes
            >
          }
        >
      : TObject['type'] extends `${infer TType extends keyof TTypes &
          string}[${infer Tail}]`
      ? Merge<
          TObject,
          {
            type: `tuple[${Tail}]`
            components: _ConvertObjectsToComponents<TTypes[TType], TTypes>
          }
        >
      : TObject
    : never
}
