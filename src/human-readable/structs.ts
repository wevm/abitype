import type { AbiParameter } from '../abi'
import type { Trim } from '../types'
import type { Signatures } from './signatures'
import type { ParseAbiParameter } from './utils'

export type StructLookup = Record<string, readonly AbiParameter[]>

export type ParseStructProperties<
  T extends string,
  TStructs extends StructLookup | unknown = unknown,
  Result extends any[] = [],
> = Trim<T> extends `${infer Head};${infer Tail}`
  ? ParseStructProperties<
      Tail,
      TStructs,
      [
        ...Result,
        ParseAbiParameter<Head, { AllowIndexed: false; Structs: TStructs }>,
      ]
    >
  : Result

export type ParseStruct<
  TSignature extends string,
  TStructs extends StructLookup | unknown = unknown,
> = TSignature extends `struct ${infer Name} {${infer Properties}}`
  ? {
      name: Trim<Name>
      components: ParseStructProperties<Properties, TStructs>
    }
  : never

export type ParseStructs<
  TSignatures extends Signatures<
    TSignatures extends readonly string[] ? TSignatures : never
  >,
> = {
  [Signature in TSignatures[number] as ParseStruct<
    Signature extends string ? Signature : never
  > extends infer Struct extends {
    name: string
  }
    ? Struct['name']
    : never]: ParseStruct<
    Signature extends string ? Signature : never
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
