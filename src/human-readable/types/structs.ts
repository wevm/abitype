import type {
  AbiParameter,
  SolidityFixedArraySizeLookup,
  TypedData,
  TypedDataParameter,
  TypedDataType,
} from '../../abi.js'
import type { Error, Pretty, Trim, Tuple } from '../../types.js'
import type { PrimitiveTypeLookup } from '../../utils.js'
import type { IsStructSignature, StructSignature } from './signatures.js'
import type { ParseAbiParameter } from './utils.js'

export type StructLookup = Record<string, readonly AbiParameter[]>

export type ParseStructs<TSignatures extends readonly string[]> =
  // Create "shallow" version of each struct (and filter out non-structs or invalid structs)
  {
    [Signature in
      TSignatures[number] as ParseStruct<Signature> extends infer Struct extends {
        name: string
      }
        ? Struct['name']
        : never]: ParseStruct<Signature>['components']
  } extends infer Structs extends Record<
    string,
    readonly (AbiParameter & { type: string })[]
  >
    ? // Resolve nested structs inside each struct
      {
        [StructName in keyof Structs]: ResolveStructs<
          Structs[StructName],
          Structs
        >
      }
    : never

export type ParseStruct<
  TSignature extends string,
  TStructs extends StructLookup | unknown = unknown,
> = TSignature extends StructSignature<infer Name, infer Properties>
  ? {
      readonly name: Trim<Name>
      readonly components: ParseStructProperties<Properties, TStructs>
    }
  : never

export type ResolveStructs<
  TAbiParameters extends readonly (AbiParameter & { type: string })[],
  TStructs extends Record<string, readonly (AbiParameter & { type: string })[]>,
  TKeyReferences extends { [_: string]: unknown } | unknown = unknown,
> = readonly [
  ...{
    [K in
      keyof TAbiParameters]: TAbiParameters[K]['type'] extends `${infer Head extends string &
      keyof TStructs}[${infer Tail}]` // Struct arrays (e.g. `type: 'Struct[]'`, `type: 'Struct[10]'`, `type: 'Struct[][]'`)
      ? Head extends keyof TKeyReferences
        ? Error<`Circular reference detected. Struct "${TAbiParameters[K]['type']}" is a circular reference.`>
        : {
            readonly name: TAbiParameters[K]['name']
            readonly type: `tuple[${Tail}]`
            readonly components: ResolveStructs<
              TStructs[Head],
              TStructs,
              TKeyReferences & { [_ in Head]: true }
            >
          }
      : // Basic struct (e.g. `type: 'Struct'`)
      TAbiParameters[K]['type'] extends keyof TStructs
      ? TAbiParameters[K]['type'] extends keyof TKeyReferences
        ? Error<`Circular reference detected. Struct "${TAbiParameters[K]['type']}" is a circular reference.`>
        : {
            readonly name: TAbiParameters[K]['name']
            readonly type: 'tuple'
            readonly components: ResolveStructs<
              TStructs[TAbiParameters[K]['type']],
              TStructs,
              TKeyReferences & { [_ in TAbiParameters[K]['type']]: true }
            >
          }
      : TAbiParameters[K]
  },
]

export type ParseStructProperties<
  T extends string,
  TStructs extends StructLookup | unknown = unknown,
  Result extends any[] = [],
> = Trim<T> extends `${infer Head};${infer Tail}`
  ? ParseStructProperties<
      Tail,
      TStructs,
      [...Result, ParseAbiParameter<Head, { Structs: TStructs }>]
    >
  : Result

////////////////////////////////////////////////////////////////////////////////////////////////////
// Typed Data

export type ShallowStruct = { [x: string]: TypedDataParameter[] }

export type ResolvedTypedData = {
  [x: string]: TypedDataType | ResolvedTypedData | ResolvedTypedData[]
}

export type ValidateStructSignature<
  T extends string,
  K extends string | unknown = unknown,
> = IsStructSignature<T> extends true
  ? T
  : string extends T // if exactly `string` (not narrowed), then pass through as valid
  ? T
  : Error<`Signature "${T}" is invalid${K extends string
      ? ` at position ${K}`
      : ''}.`>

export type StructSignatures<T extends readonly string[]> = {
  [K in keyof T]: ValidateStructSignature<T[K], K>
}

export type ParseTypedData<
  signatures extends readonly string[],
  resolveTypedData extends boolean = false,
> = {
  // Create "shallow" version of each struct (and filter out non-structs or invalid structs)
  [Signature in
    signatures[number] as ParseStruct<Signature> extends infer Struct extends {
      name: string
    }
      ? Struct['name']
      : never]: ParseStruct<Signature>['components']
} extends infer Structs extends TypedData
  ? resolveTypedData extends true
    ? ResolveTypedData<Structs>
    : Structs
  : never

export type ResolveTypedData<
  typedData extends TypedData,
  keyReferences extends { [_: string]: unknown } | unknown = unknown,
> = {
  [K in keyof typedData]: {
    [K2 in typedData[K][number] as K2['name']]: K2['type'] extends K
      ? Error<`Cannot convert self-referencing struct '${K2['type']}' to primitive type.`>
      : K2['type'] extends keyof typedData
      ? K2['type'] extends keyof keyReferences
        ? Error<`Circular reference detected. '${K2['type']}' is a circular reference.`>
        : ResolveTypedData<
            Exclude<typedData, K>,
            keyReferences & { [_ in K2['type']]: true }
          >[K2['type']]
      : K2['type'] extends `${infer Type extends keyof typedData &
          string}[${infer Tail}]`
      ? Tail extends keyof SolidityFixedArraySizeLookup
        ? Tuple<
            ResolveTypedData<
              Exclude<typedData, K>,
              keyReferences & { [_ in K2['type']]: true }
            >[Type],
            SolidityFixedArraySizeLookup[Tail]
          >
        : ResolveTypedData<
            Exclude<typedData, K>,
            keyReferences & { [_ in K2['type']]: true }
          >[Type][]
      : K2['type'] extends TypedDataType
      ? K2['type']
      : Error<`Cannot convert unknown type '${K2['type']}' to primitive type.`>
  }
}

export type ResolvedTypedDataToPrimativeType<
  resolvedTypedData extends ResolvedTypedData,
> = Pretty<{
  [K in keyof resolvedTypedData]: resolvedTypedData[K] extends Exclude<
    ResolvedTypedData,
    TypedDataType
  >
    ? ResolvedTypedDataToPrimativeType<resolvedTypedData[K]>
    : resolvedTypedData[K] extends infer Type extends TypedDataType
    ? Type extends `${infer Head extends TypedDataType}[${infer Size}]`
      ? Size extends keyof SolidityFixedArraySizeLookup
        ? Tuple<
            PrimitiveTypeLookup<Head>[Head],
            SolidityFixedArraySizeLookup[Size]
          >
        : PrimitiveTypeLookup<Head>[Head][]
      : PrimitiveTypeLookup<Type>[Type]
    : never
}>
