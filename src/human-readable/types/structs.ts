import type { AbiParameter } from '../../abi'
import type { Trim } from '../../types'
import type { StructSignature } from './signatures'
import type { ParseAbiParameter } from './utils'

export type StructLookup = Record<string, readonly AbiParameter[]>

export type ParseStructs<TSignatures extends readonly string[]> =
  // Create "shallow" version of each struct (and filter out non-structs or invalid structs)
  {
    [Signature in TSignatures[number] as ParseStruct<Signature> extends infer Struct extends {
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
      name: Trim<Name>
      components: ParseStructProperties<Properties, TStructs>
    }
  : never

// TODO: Disallow recursive and self-referencing structs
export type ResolveStructs<
  TAbiParameters extends readonly (AbiParameter & { type: string })[],
  TStructs extends Record<string, readonly (AbiParameter & { type: string })[]>,
> = {
  [K in keyof TAbiParameters]: TAbiParameters[K]['type'] extends `${infer Head extends string &
    keyof TStructs}[${infer Tail}]` // Struct arrays (e.g. `type: 'Struct[]'`, `type: 'Struct[10]'`, `type: 'Struct[][]'`)
    ? {
        name: TAbiParameters[K]['name']
        type: `tuple[${Tail}]`
        components: ResolveStructs<TStructs[Head], TStructs>
      }
    : // Basic struct (e.g. `type: 'Struct'`)
    TAbiParameters[K]['type'] extends keyof TStructs
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
