export type WS = ' '
export type TrimLeft<S extends string> = S extends `${WS}${infer L}`
  ? TrimLeft<L>
  : S

export type TrimRight<S extends string> = S extends `${infer R}${WS}`
  ? TrimRight<R>
  : S

export type Trim<S extends string> = TrimLeft<TrimRight<S>>

export type SolidityType<T extends string> = T extends 'uint' ? 'uint256' : T

export type AbiTypes = 'function' | 'event' | 'error'

export type AbiIndexed = ' indexed '

export type AbiMutability = 'view' | 'pure' | 'payable' | 'nonpayable'

export type hasTupleValue<T extends string> =
  T extends `${string}(${string})${string}` ? true : false

export type isTupleValue<T extends string> = T extends `(${string})${string}`
  ? true
  : false

export type Remove<
  T,
  K extends string,
> = T extends `${infer Head}${K}${infer Tail}` ? `${Head}${Tail}` : T

export type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = From extends ''
  ? S
  : S extends `${infer Prefix}${From}${infer Suffix}`
  ? `${ReplaceAll<Prefix, From, To>}${To}${ReplaceAll<Suffix, From, To>}`
  : S

type Pop<T extends any[]> = T extends [...infer R, any] ? R : []

export type SplitNesting<
  T extends string,
  TResult extends any[] = [],
  TStr extends string = '',
  Depth extends any[] = [],
> = T extends ''
  ? [...TResult, Trim<TStr>]
  : Depth['length'] extends 0
  ? T extends `${infer Char}${infer Rest}`
    ? Char extends ','
      ? SplitNesting<Rest, [...TResult, Trim<TStr>], ''>
      : Char extends '('
      ? SplitNesting<Rest, TResult, `${TStr}${Char}`, [...Depth, 1]>
      : SplitNesting<Rest, TResult, `${TStr}${Char}`>
    : []
  : T extends `${infer Char}${infer Rest}`
  ? Char extends '('
    ? SplitNesting<Rest, TResult, `${TStr}${Char}`, [...Depth, 1]>
    : Char extends ')'
    ? SplitNesting<Rest, TResult, `${TStr}${Char}`, Pop<Depth>>
    : SplitNesting<Rest, TResult, `${TStr}${Char}`, Depth>
  : []

export type ReOrderArray<
  T extends string[],
  TRemain extends any[] = [],
> = T extends ['']
  ? []
  : T extends [infer Head extends string, ...infer Rest extends string[]]
  ? Head extends `(${string})${string}`
    ? [...TRemain, ...Rest, Head]
    : ReOrderArray<Rest, [...TRemain, Head]>
  : TRemain
