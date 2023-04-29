import type {
  Abi,
  AbiParameter,
  AbiParameterKind,
  AbiStateMutability,
  AbiType,
  MBits,
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
} from './abi.js'
import type { ResolvedConfig } from './config.js'
import type { Error, Merge, Tuple } from './types.js'

/**
 * Converts {@link AbiType} to corresponding TypeScript primitive type.
 *
 * Does not include full array or tuple conversion. Use {@link AbiParameterToPrimitiveType} to fully convert arrays and tuples.
 *
 * @param TAbiType - {@link AbiType} to convert to TypeScript representation
 * @param TAbiParameterKind - Optional {@link AbiParameterKind} to narrow by parameter type
 * @returns TypeScript primitive type
 */
export type AbiTypeToPrimitiveType<
  TAbiType extends AbiType,
  TAbiParameterKind extends AbiParameterKind = AbiParameterKind,
> = PrimitiveTypeLookup<TAbiType, TAbiParameterKind>[TAbiType]

// Using a map to look up types is faster, than nested conditional types
// s/o https://twitter.com/SeaRyanC/status/1538971176357113858
type PrimitiveTypeLookup<
  TAbiType extends AbiType,
  TAbiParameterKind extends AbiParameterKind = AbiParameterKind,
> = {
  [_ in SolidityAddress]: ResolvedConfig['AddressType']
} & {
  [_ in SolidityBool]: boolean
} & {
  [_ in SolidityBytes]: ResolvedConfig['BytesType'][TAbiParameterKind]
} & {
  [_ in SolidityFunction]: `${ResolvedConfig['AddressType']}${string}`
} & {
  [_ in SolidityInt]: TAbiType extends `${'u' | ''}int${infer TBits}`
    ? TBits extends keyof BitsTypeLookup
      ? BitsTypeLookup[TBits]
      : Error<'Unknown bits value.'>
    : Error<`Unknown 'SolidityInt' format.`>
} & {
  [_ in SolidityString]: string
} & {
  [_ in SolidityTuple]: Record<string, unknown>
} & {
  [_ in SolidityArray]: readonly unknown[]
}

type GreaterThan48Bits = Exclude<MBits, 8 | 16 | 24 | 32 | 40 | 48 | ''>
type LessThanOrEqualTo48Bits = Exclude<MBits, GreaterThan48Bits | ''>
type NoBits = Exclude<MBits, GreaterThan48Bits | LessThanOrEqualTo48Bits>
type BitsTypeLookup = {
  [_ in `${LessThanOrEqualTo48Bits}`]: ResolvedConfig['IntType']
} & {
  [_ in `${GreaterThan48Bits}`]: ResolvedConfig['BigIntType']
} & {
  [_ in NoBits]: ResolvedConfig['BigIntType']
}

/**
 * Converts {@link AbiParameter} to corresponding TypeScript primitive type.
 *
 * @param TAbiParameter - {@link AbiParameter} to convert to TypeScript representation
 * @param TAbiParameterKind - Optional {@link AbiParameterKind} to narrow by parameter type
 * @returns TypeScript primitive type
 */
export type AbiParameterToPrimitiveType<
  TAbiParameter extends AbiParameter | { name: string; type: unknown },
  TAbiParameterKind extends AbiParameterKind = AbiParameterKind,
> = TAbiParameter['type'] extends Exclude<
  // 1. Check to see if type is basic (not tuple or array) and can be looked up immediately.
  AbiType,
  SolidityTuple | SolidityArray
>
  ? AbiTypeToPrimitiveType<TAbiParameter['type'], TAbiParameterKind>
  : // 2. Check if type is tuple and covert each component
  TAbiParameter extends {
      type: SolidityTuple
      components: infer TComponents extends readonly AbiParameter[]
    }
  ? TComponents extends readonly []
    ? []
    : _HasUnnamedAbiParameter<TComponents> extends true
    ? // Has unnamed tuple parameters so return as array
      readonly [
        ...{
          [K in keyof TComponents]: AbiParameterToPrimitiveType<
            TComponents[K],
            TAbiParameterKind
          >
        },
      ]
    : // All tuple parameters are named so return as object
      {
        [Component in
          TComponents[number] as Component extends {
            name: string
          }
            ? Component['name']
            : never]: AbiParameterToPrimitiveType<Component, TAbiParameterKind>
      }
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
          AbiParameterToPrimitiveType<
            Merge<TAbiParameter, { type: Head }>,
            TAbiParameterKind
          >,
          SolidityFixedArraySizeLookup[Size]
        >
      : readonly AbiParameterToPrimitiveType<
          Merge<TAbiParameter, { type: Head }>,
          TAbiParameterKind
        >[]
    : never
  : // 4. If type is not basic, tuple, or array, we don't know what the type is.
  // This can happen when a fixed-length array is out of range (`Size` doesn't exist in `SolidityFixedArraySizeLookup`),
  // the array has depth greater than `Config['ArrayMaxDepth']`, etc.
  ResolvedConfig['StrictAbiType'] extends true
  ? TAbiParameter['type'] extends infer TAbiType extends string
    ? Error<`Unknown type '${TAbiType}'.`>
    : never
  : unknown

// TODO: Speed up by returning immediately as soon as named parameter is found.
type _HasUnnamedAbiParameter<TAbiParameters extends readonly AbiParameter[]> =
  TAbiParameters extends readonly [
    infer Head extends AbiParameter,
    ...infer Tail extends readonly AbiParameter[],
  ]
    ? Head extends { name: string }
      ? Head['name'] extends ''
        ? true
        : _HasUnnamedAbiParameter<Tail>
      : true
    : false

/**
 * Converts array of {@link AbiParameter} to corresponding TypeScript primitive types.
 *
 * @param TAbiParameters - Array of {@link AbiParameter} to convert to TypeScript representations
 * @param TAbiParameterKind - Optional {@link AbiParameterKind} to narrow by parameter type
 * @returns Array of TypeScript primitive types
 */
export type AbiParametersToPrimitiveTypes<
  TAbiParameters extends readonly AbiParameter[],
  TAbiParameterKind extends AbiParameterKind = AbiParameterKind,
> = {
  // TODO: Convert to labeled tuple so parameter names show up in autocomplete
  // e.g. [foo: string, bar: string]
  // https://github.com/microsoft/TypeScript/issues/44939
  [K in keyof TAbiParameters]: AbiParameterToPrimitiveType<
    TAbiParameters[K],
    TAbiParameterKind
  >
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
        // Map over typed data values and turn into key-value pairs.
        // Valid types are set to `never` so we can weed out invalid types more easily.
        [K2 in
          TTypedData[K][number] as K2['type'] extends keyof TTypedData
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
 * @param TAbiParameterKind - Optional {@link AbiParameterKind} to narrow by parameter type
 * @returns Union of TypeScript primitive types
 */
export type TypedDataToPrimitiveTypes<
  TTypedData extends TypedData,
  TAbiParameterKind extends AbiParameterKind = AbiParameterKind,
  TKeyReferences extends { [_: string]: unknown } | unknown = unknown,
> = {
  [K in keyof TTypedData]: {
    // Map over typed data values and turn into key-value pairs
    [K2 in TTypedData[K][number] as K2['name']]: K2['type'] extends K // 1. Eliminate self-referencing structs
      ? Error<`Cannot convert self-referencing struct '${K2['type']}' to primitive type.`>
      : K2['type'] extends keyof TTypedData // 2. Check if type is struct
      ? K2['type'] extends keyof TKeyReferences
        ? Error<`Circular reference detected. '${K2['type']}' is a circular reference.`>
        : TypedDataToPrimitiveTypes<
            Exclude<TTypedData, K>,
            TAbiParameterKind,
            TKeyReferences & { [_ in K2['type']]: true }
          >[K2['type']]
      : // 3. Check if type is array of structs
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
          >,
          TAbiParameterKind
        >
      : K2['type'] extends TypedDataType // 4. Known type to convert
      ? AbiParameterToPrimitiveType<K2, TAbiParameterKind>
      : Error<`Cannot convert unknown type '${K2['type']}' to primitive type.`>
  }
}

type _TypedDataParametersToAbiParameters<
  TTypedDataParameters extends readonly TypedDataParameter[],
  TTypedData extends TypedData,
> = {
  // Map over typed data parameters and convert into ABI parameters
  [K in
    keyof TTypedDataParameters]: TTypedDataParameters[K] extends infer TTypedDataParameter extends {
    name: string
    type: unknown
  }
    ? // 1. Check if type is struct
      TTypedDataParameter['type'] extends keyof TTypedData
      ? Merge<
          TTypedDataParameter,
          {
            type: 'tuple'
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
