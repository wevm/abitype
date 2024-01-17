import type {
  Abi,
  AbiParameter,
  AbiParameterKind,
  AbiStateMutability,
  AbiType,
  MBits,
  SolidityArray,
  SolidityBytes,
  SolidityFixedArrayRange,
  SolidityFixedArraySizeLookup,
  SolidityInt,
  SolidityTuple,
  TypedData,
  TypedDataParameter,
  TypedDataType,
} from './abi.js'
import type { ResolvedRegister } from './register.js'
import type { Error, Merge, Pretty, Tuple } from './types.js'

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
> = TAbiType extends SolidityBytes
  ? // If PrimitiveTypeLookup is missing key values from AbiType,
    // there will be an error on this property access
    PrimitiveTypeLookup[TAbiType][TAbiParameterKind]
  : PrimitiveTypeLookup[TAbiType]

interface PrimitiveTypeLookup
  extends SolidityIntMap,
    SolidityByteMap,
    SolidityArrayMap {
  address: ResolvedRegister['AddressType']
  bool: boolean
  function: `${ResolvedRegister['AddressType']}${string}`
  string: string
  tuple: Record<string, unknown>
}

type SolidityIntMap = {
  [_ in SolidityInt]: _ extends `${
    | 'u'
    | ''}int${infer TBits extends keyof BitsTypeLookup}`
    ? BitsTypeLookup[TBits]
    : never
}

type SolidityByteMap = {
  [_ in SolidityBytes]: ResolvedRegister['BytesType']
}

type SolidityArrayMap = { [_ in SolidityArray]: readonly unknown[] }

type GreaterThan48Bits = Exclude<MBits, 8 | 16 | 24 | 32 | 40 | 48 | NoBits>
type LessThanOrEqualTo48Bits = Exclude<MBits, GreaterThan48Bits | NoBits>
type NoBits = ''

type BitsTypeLookup = {
  [K in MBits]: ResolvedRegister[K extends LessThanOrEqualTo48Bits
    ? 'IntType'
    : 'BigIntType']
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
  // 1. Check to see if type is basic (not tuple or array) and can be looked up immediately.
> = TAbiParameter['type'] extends AbiBasicType
  ? AbiTypeToPrimitiveType<TAbiParameter['type'], TAbiParameterKind>
  : // 2. Check if type is tuple and covert each component
  TAbiParameter extends {
      type: SolidityTuple
      components: infer TComponents extends readonly AbiParameter[]
    }
  ? AbiComponentsToPrimitiveType<TComponents, TAbiParameterKind>
  : // 3. Check if type is array.
  MaybeExtractArrayParameterType<TAbiParameter['type']> extends [
      infer Head extends string,
      infer Size,
    ]
  ? AbiArrayToPrimitiveType<TAbiParameter, TAbiParameterKind, Head, Size>
  : // 4. If type is not basic, tuple, or array, we don't know what the type is.
  // This can happen when a fixed-length array is out of range (`Size` doesn't exist in `SolidityFixedArraySizeLookup`),
  // the array has depth greater than `Config['ArrayMaxDepth']`, etc.
  ResolvedRegister['StrictAbiType'] extends true
  ? Error<`Unknown type '${TAbiParameter['type'] & string}'.`>
  : // 5. If we've gotten this far, let's check for errors in tuple components.
  // (Happens for recursive tuple typed data types.)
  TAbiParameter extends { components: Error<string> }
  ? TAbiParameter['components']
  : unknown

type AbiBasicType = Exclude<AbiType, SolidityTuple | SolidityArray>

type AbiComponentsToPrimitiveType<
  Components extends readonly AbiParameter[],
  TAbiParameterKind extends AbiParameterKind,
> = Components extends readonly []
  ? []
  : // Compare the original set of names to a "validated"
  // set where each name is coerced to a string and undefined|"" are excluded
  Components[number]['name'] extends Exclude<
      Components[number]['name'] & string,
      undefined | ''
    >
  ? // If all the original names are present, all tuple parameters are named so return as object
    {
      [Component in
        Components[number] as Component['name'] & {}]: AbiParameterToPrimitiveType<
        Component,
        TAbiParameterKind
      >
    }
  : // Otherwise, has unnamed tuple parameters so return as array
    {
      [I in keyof Components]: AbiParameterToPrimitiveType<
        Components[I],
        TAbiParameterKind
      >
    }

type MaybeExtractArrayParameterType<T> =
  /**
   * First, infer `Head` against a known size type (either fixed-length array value or `""`).
   *
   * | Input           | Head         |
   * | --------------- | ------------ |
   * | `string[]`      | `string`     |
   * | `string[][][3]` | `string[][]` |
   */
  T extends `${infer Head}[${'' | `${SolidityFixedArrayRange}`}]`
    ? //   * Then, infer in the opposite direction, using the known `Head` to infer the exact `Size` value.
      //   *
      //   * | Input        | Size |
      //   * | ------------ | ---- |
      //   * | `${Head}[]`  | `""` |
      //   * | `${Head}[3]` | `3`  |
      //   */
      T extends `${Head}[${infer Size}]`
      ? [Head, Size]
      : undefined
    : undefined

type AbiArrayToPrimitiveType<
  TAbiParameter extends AbiParameter | { name: string; type: unknown },
  TAbiParameterKind extends AbiParameterKind,
  Head extends string,
  Size,
> = Size extends keyof SolidityFixedArraySizeLookup
  ? // Check if size is within range for fixed-length arrays, if so create a tuple.
    Tuple<
      AbiParameterToPrimitiveType<
        Merge<TAbiParameter, { type: Head }>,
        TAbiParameterKind
      >,
      SolidityFixedArraySizeLookup[Size]
    >
  : // Otherwise, create an array. Tuples and arrays are created with `[${Size}]` popped off the end
    // and passed back into the function to continue reducing down to the basic types found in Step 1.
    readonly AbiParameterToPrimitiveType<
      Merge<TAbiParameter, { type: Head }>,
      TAbiParameterKind
    >[]

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
> = Pretty<{
  // TODO: Convert to labeled tuple so parameter names show up in autocomplete
  // e.g. [foo: string, bar: string]
  // https://github.com/microsoft/TypeScript/issues/44939
  [K in keyof TAbiParameters]: AbiParameterToPrimitiveType<
    TAbiParameters[K],
    TAbiParameterKind
  >
}>

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
 * @param TAbiStateMutability - {@link AbiStateMutability} to filter by
 * @returns All {@link AbiFunction} types from {@link Abi}
 */
export type ExtractAbiFunctions<
  TAbi extends Abi,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: 'function'; stateMutability: TAbiStateMutability }
>

/**
 * Extracts all {@link AbiFunction} names from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract function names from
 * @param TAbiStateMutability - {@link AbiStateMutability} to filter by
 * @returns Union of function names
 */
export type ExtractAbiFunctionNames<
  TAbi extends Abi,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = ExtractAbiFunctions<TAbi, TAbiStateMutability>['name']

/**
 * Extracts {@link AbiFunction} with name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiFunction} from
 * @param TFunctionName - String name of function to extract from {@link Abi}
 * @param TAbiStateMutability - {@link AbiStateMutability} to filter by
 * @returns Matching {@link AbiFunction}
 */
export type ExtractAbiFunction<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = Extract<
  ExtractAbiFunctions<TAbi, TAbiStateMutability>,
  { name: TFunctionName }
>

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
            TKeyReferences & { [_ in K2['type'] | K]: true }
          >[K2['type']]
      : // 3. Check if type is array of structs
      K2['type'] extends `${infer TType extends keyof TTypedData &
          string}[${infer Tail}]`
      ? AbiParameterToPrimitiveType<
          {
            name: K2['name']
            type: `tuple[${Tail}]`
            components: _TypedDataParametersToAbiParameters<
              TTypedData[TType],
              TTypedData,
              TKeyReferences & { [_ in TType | K]: true }
            >
          },
          TAbiParameterKind
        >
      : K2['type'] extends TypedDataType // 4. Known type to convert
      ? AbiParameterToPrimitiveType<K2, TAbiParameterKind>
      : Error<`Cannot convert unknown type '${K2['type']}' to primitive type.`>
  }
  // Ensure the result is "Prettied"
} & unknown

type _TypedDataParametersToAbiParameters<
  TTypedDataParameters extends readonly TypedDataParameter[],
  TTypedData extends TypedData,
  TKeyReferences extends { [_: string]: unknown } | unknown = unknown,
> = {
  // Map over typed data parameters and convert into ABI parameters
  [K in
    keyof TTypedDataParameters]: TTypedDataParameters[K] extends infer TTypedDataParameter extends {
    name: string
    type: unknown
  }
    ? // 1. Check if type is struct
      TTypedDataParameter['type'] extends keyof TTypedData & string
      ? {
          name: TTypedDataParameter['name']
          type: 'tuple'
          components: TTypedDataParameter['type'] extends keyof TKeyReferences
            ? Error<`Circular reference detected. '${TTypedDataParameter['type']}' is a circular reference.`>
            : _TypedDataParametersToAbiParameters<
                TTypedData[TTypedDataParameter['type']],
                TTypedData,
                TKeyReferences & { [_ in TTypedDataParameter['type']]: true }
              >
        }
      : // 2. Check if type is array of structs
      TTypedDataParameter['type'] extends `${infer TType extends keyof TTypedData &
          string}[${infer Tail}]`
      ? {
          name: TTypedDataParameter['name']
          type: `tuple[${Tail}]`
          components: TType extends keyof TKeyReferences
            ? Error<`Circular reference detected. '${TTypedDataParameter['type']}' is a circular reference.`>
            : _TypedDataParametersToAbiParameters<
                TTypedData[TType],
                TTypedData,
                TKeyReferences & { [_ in TType]: true }
              >
        }
      : // 3. Type is already ABI parameter
        TTypedDataParameter
    : never
}
