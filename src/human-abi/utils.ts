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
  T extends `${string}tuple${string}` ? true : false

export type isTupleValue<T extends string> =
  T extends `tuple(${string})${string}` ? true : false

export type CustomSplit<S extends string> = isTupleValue<S> extends true
  ? S extends `tuple(tuple(${string})${string}, ${string})${string}`
    ? [Trim<S>]
    : S extends `tuple(${string}, tuple(${string})${string})`
    ? [Trim<S>]
    : S extends `tuple(tuple(${string})${string})${string}`
    ? [Trim<S>]
    : S extends `tuple(${infer Args})${infer Name},${infer Tail}`
    ? [...CustomSplit<Tail>, Trim<`tuple(${Args})${Name}`>]
    : S extends `${infer Head}, tuple(${infer Args})${string}`
    ? [...CustomSplit<Head>, Trim<`tuple(${Args})`>]
    : S extends `tuple(${infer Args})${infer Tail}`
    ? [Trim<`tuple(${Args})${Tail}`>]
    : []
  : S extends `${infer L},${infer Tail}`
  ? [Trim<L>, ...CustomSplit<Trim<Tail>>]
  : S extends ''
  ? []
  : [Trim<S>]

export type Remove<
  T,
  K extends string,
> = T extends `${infer Head}${K}${infer Tail}` ? `${Head}${Tail}` : T
