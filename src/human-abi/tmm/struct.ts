import type { AbiParameter, AbiType } from '../../abi'

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false

type Includes<T extends readonly any[], TMatch> = T extends [
  infer Head,
  ...infer Rest,
]
  ? Equals<Head, TMatch> extends true
    ? true
    : Includes<Rest, TMatch>
  : false

export type ResolveStructs<
  TAbiParameters extends readonly (AbiParameter & { type: string })[],
  TStructs extends Record<string, readonly (AbiParameter & { type: string })[]>,
  TKeyReferences extends readonly (keyof TStructs)[] = [],
> = {
  [K in keyof TAbiParameters]: Includes<
    TKeyReferences,
    TAbiParameters[K]['type']
  > extends true
    ? `Error: Circular reference on type "${TAbiParameters[K]['type']}" and name "${TAbiParameters[K]['name']}"`
    : TAbiParameters[K]['type'] extends `${infer Head extends string &
        keyof TStructs}[${infer Tail}]`
    ? {
        name: TAbiParameters[K]['name']
        type: `tuple[${Tail}]`
        components: ResolveStructs<
          TStructs[Head],
          TStructs,
          [...TKeyReferences, TAbiParameters[K]['type']]
        >
      }
    : Includes<TKeyReferences, TAbiParameters[K]['type']> extends true
    ? `Error: Circular reference on type "${TAbiParameters[K]['type']}" and name "${TAbiParameters[K]['name']}"`
    : TAbiParameters[K]['type'] extends keyof TStructs
    ? {
        name: TAbiParameters[K]['name']
        type: 'tuple'
        components: ResolveStructs<
          TStructs[TAbiParameters[K]['type']],
          TStructs,
          [...TKeyReferences, TAbiParameters[K]['type']]
        >
      }
    : TAbiParameters[K]['type'] extends AbiType
    ? TAbiParameters[K]
    : `Error: Unknow type found "${TAbiParameters[K]['type']}"`
}
