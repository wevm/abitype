import type { AbiParameter } from '../abi'
import type { Trim } from '../types'
import type { StructSignature } from './signatures'
import type { ParseAbiParameter } from './utils'

export type StructMap = Record<string, readonly AbiParameter[]>

export type ParseStructProperties<
  T extends string,
  TStructs extends StructMap | unknown = unknown,
  Options extends { throwUnknownType: boolean } = { throwUnknownType: true },
  Result extends any[] = [],
> = Trim<T> extends `${infer Head};${infer Tail}`
  ? ParseStructProperties<
      Tail,
      TStructs,
      Options,
      [...Result, ParseAbiParameter<Head, TStructs, Options>]
    >
  : Result

export type ParseStruct<
  TSignature extends string,
  TStructs extends StructMap | unknown = unknown,
  Options extends { throwUnknownType: boolean } = { throwUnknownType: true },
> = TSignature extends StructSignature<infer Name, infer Properties>
  ? {
      name: Trim<Name>
      components: ParseStructProperties<Properties, TStructs, Options>
    }
  : never

// TODO: Disallow recursive and self-referencing structs
export type ResolveStructs<
  TAbiParameters extends readonly (AbiParameter & { type: string })[],
  TStructs extends Record<string, readonly (AbiParameter & { type: string })[]>,
> = {
  [K in keyof TAbiParameters]: TAbiParameters[K]['type'] extends `${infer Head extends string &
    keyof TStructs}[${infer Tail}]`
    ? {
        name: TAbiParameters[K]['name']
        type: `tuple[${Tail}]`
        components: ResolveStructs<TStructs[Head], TStructs>
      }
    : TAbiParameters[K]['type'] extends keyof TStructs
    ? {
        name: TAbiParameters[K]['name']
        type: 'tuple'
        components: ResolveStructs<
          TStructs[TAbiParameters[K]['type']],
          TStructs
        >
      }
    : TAbiParameters[K]
}

export type ParseStructs<TSignatures extends readonly string[]> = {
  [Signature in TSignatures[number] as ParseStruct<
    Signature,
    unknown,
    { throwUnknownType: false }
  > extends infer Struct extends {
    name: string
  }
    ? Struct['name']
    : never]: ParseStruct<
    Signature,
    unknown,
    { throwUnknownType: false }
  >['components']
} extends infer Structs extends Record<
  string,
  readonly (AbiParameter & { type: string })[]
>
  ? {
      [StructName in keyof Structs]: ResolveStructs<
        Structs[StructName],
        Structs
      >
    }
  : never
