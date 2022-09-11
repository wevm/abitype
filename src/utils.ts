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
  TypedDataParameter,
  TypedDataType,
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

// Using a map to look up types is faster, than nested conditional types
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
> =
  // 1. Check to see if type is basic (not tuple or array) and can be looked up immediately.
  TAbiParameter['type'] extends Exclude<AbiType, SolidityTuple | SolidityArray>
    ? AbiTypeToPrimitiveType<TAbiParameter['type']>
    : // 2. Check if type is tuple and covert each component
    TAbiParameter['type'] extends SolidityTuple
    ? TAbiParameter extends {
        components: infer TComponents extends readonly AbiParameter[]
      }
      ? _HasUnnamedAbiParameter<TComponents> extends true
        ? // Has unnamed tuple parameters so return as array
          {
            [K in keyof TComponents]: AbiParameterToPrimitiveType<
              TComponents[K]
            >
          }
        : // All tuple parameters are named so return as object
          {
            [Component in TComponents[number] as Component['name']]: AbiParameterToPrimitiveType<Component>
          }
      : never
    : // 3. Check if type is array.
    /**
     * First, infer `Head` against a known size type (either fixed-length array value or `""`).
     *
     * | Input           | Head         |
     * | --------------- | ------------ |
     * | `string[]`      | `string`     |
     * | `string[][][3]` | `string[][]` |
     */
    TAbiParameter['type'] extends `${infer Head}[${
        | ''
        | `${SolidityFixedArrayRange}`}]`
    ? /**
       * Then, infer in the opposite direction, using the known `Head` to infer the exact `Size` value.
       *
       * | Input        | Size |
       * | ------------ | ---- |
       * | `${Head}[]`  | `""` |
       * | `${Head}[3]` | `3`  |
       */
      TAbiParameter['type'] extends `${Head}[${infer Size}]`
      ? // Check if size is within range for fixed-length arrays, if so create a tuple.
        // Otherwise, create an array. Tuples and arrays are created with `[${Size}]` popped off the end
        // and passed back into the function to continue reduing down to the basic types found in Step 1.
        Size extends keyof SolidityFixedArraySizeLookup
        ? Tuple<
            AbiParameterToPrimitiveType<Merge<TAbiParameter, { type: Head }>>,
            SolidityFixedArraySizeLookup[Size]
          >
        : AbiParameterToPrimitiveType<Merge<TAbiParameter, { type: Head }>>[]
      : never
    : // 4. If type is not basic, tuple, or array, we don't know what the type is.
      // This can happen when a fixed-length array is out of range (`Size` doesn't exist in `SolidityFixedArraySizeLookup`),
      // the array has depth greater than `Config['ArrayMaxDepth']`, etc.
      unknown

type _HasUnnamedAbiParameter<TAbiParameters extends readonly AbiParameter[]> =
  TAbiParameters extends [
    infer Head extends AbiParameter,
    ...infer Tail extends AbiParameter[],
  ]
    ? Head['name'] extends ''
      ? true
      : _HasUnnamedAbiParameter<Tail>
    : false

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
  // Evem though this is for generating a function signature,
  // we don't care about `constructor`, `fallback`, or `receive` functions.
  // This could change if folks think they are useful.
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
 * Checks if type is {@link TypedData}.
 *
 * @param TTypedData - {@link TypedData} to check
 * @returns Boolean for whether {@link TTypedData} is {@link TypedData}
 */
export type IsTypedData<TTypedData> = TTypedData extends TypedData
  ? {
      [K in keyof TTypedData]: {
        // Map over typed data values and turn into key-value pairs
        [K2 in TTypedData[K][number] as K2['type'] extends keyof TTypedData
          ? never
          : K2['type'] extends `${keyof TTypedData & string}[${string}]`
          ? never
          : K2['type'] extends TypedDataType
          ? never
          : K2['name']]: false
      }
    } extends {
      [K in keyof TTypedData]: Record<string, never>
    }
    ? true
    : false
  : false

/**
 * Converts {@link TTypedData} to corresponding TypeScript primitive types.
 *
 * @param TTypedData - {@link TypedData} to convert
 * @returns Union of TypeScript primitive types
 */
export type TypedDataToPrimitiveTypes<TTypedData extends TypedData> = {
  [K in keyof TTypedData]: {
    // Map over typed data values and turn into key-value pairs
    [K2 in TTypedData[K][number] as K2['name']]: K2['type'] extends keyof TTypedData // 1. Check if type is struct
      ? TypedDataToPrimitiveTypes<Exclude<TTypedData, K>>[K2['type']]
      : // 2. Check if type is array of structs
      K2['type'] extends `${infer TType extends keyof TTypedData &
          string}[${infer Tail}]`
      ? AbiParameterToPrimitiveType<
          Merge<
            K2,
            {
              type: `tuple[${Tail}]`
              components: _TypedDataParametersToAbiParameters<
                TTypedData[TType],
                TTypedData
              >
            }
          >
        >
      : // 3. Known type to covert
        AbiParameterToPrimitiveType<K2>
  }
}

type _TypedDataParametersToAbiParameters<
  TTypedDataParameters extends readonly TypedDataParameter[],
  TTypedData extends TypedData,
> = {
  // Map over typed data parameters and convert into ABI parameters
  [K in keyof TTypedDataParameters]: TTypedDataParameters[K] extends infer TTypedDataParameter extends {
    name: string
    type: unknown
  }
    ? // 1. Check if type is struct
      TTypedDataParameter['type'] extends keyof TTypedData
      ? Merge<
          TTypedDataParameter,
          {
            type: `tuple`
            components: _TypedDataParametersToAbiParameters<
              TTypedData[TTypedDataParameter['type']],
              TTypedData
            >
          }
        >
      : // 2. Check if type is array of structs
      TTypedDataParameter['type'] extends `${infer TType extends keyof TTypedData &
          string}[${infer Tail}]`
      ? Merge<
          TTypedDataParameter,
          {
            type: `tuple[${Tail}]`
            components: _TypedDataParametersToAbiParameters<
              TTypedData[TType],
              TTypedData
            >
          }
        >
      : // 3. Type is already ABI parameter
        TTypedDataParameter
    : never
}
