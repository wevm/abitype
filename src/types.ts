/**
 * @description Returns error if T contains whitespace.
 *
 * @example
 * type Result = AssertNoWhiteSpace<'foobarbaz'>
 * //   ^? type Result = true
 */
export type AssertNoWhiteSpace<T extends string> =
  Trim<T> extends infer Trimmed extends string
    ? HasWhiteSpace<Trimmed> extends true
      ? `Error: "${Trimmed}" contains whitespace"`
      : Trimmed
    : never
type HasWhiteSpace<T extends string> = T extends `${string}${' '}${string}`
  ? true
  : false

/**
 * Filters out all members of {@link T} that are {@link P}
 *
 * @param T - Items to filter
 * @param P - Type to filter out
 * @returns Filtered items
 *
 * @example
 * type Result = Filter<['a', 'b', 'c'], 'b'>
 * //   ^? type Result = ['a', 'c']
 */
export type Filter<T extends readonly unknown[], P> = T extends [
  infer A,
  ...infer Rest,
]
  ? [...([A] extends [P] ? [] : [A]), ...Filter<Rest, P>]
  : []

/**
 * Checks if {@link T} is `unknown`
 *
 * @param T - Type to check
 * @returns `true` if {@link T} is `unknown`, otherwise `false`
 *
 * @example
 * type Result = IsUnknown<unknown>
 * //   ^? type Result = true
 */
export type IsUnknown<T> = unknown extends T ? true : false

/**
 * Merges two object types into new type
 *
 * @param Object1 - Object to merge into
 * @param Object2 - Object to merge and override keys from {@link Object1}
 * @returns New object type with keys from {@link Object1} and {@link Object2}. If a key exists in both {@link Object1} and {@link Object2}, the key from {@link Object2} will be used.
 *
 * @example
 * type Result = Merge<{ foo: string }, { foo: number; bar: string }>
 * //   ^? { foo: number; bar: string }
 */
export type Merge<Object1, Object2> = Omit<Object1, keyof Object2> & Object2

/**
 * @description Combines members of an intersection into a readable type.
 *
 * @link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
 * @example
 * type Result = Prettify<{ a: string } | { b: string } | { c: number, d: bigint }>
 * //   ^? { a: string; b: string; c: number; d: bigint }
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & object

/**
 * Creates range between two positive numbers using [tail recursion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types).
 *
 * @param Start - Number to start range
 * @param Stop - Number to end range
 * @returns Array with inclusive range from {@link Start} to {@link Stop}
 *
 * @example
 * type Result = Range<1, 3>
 * //   ^? [1, 2, 3]
 */
// From [Type Challenges](https://github.com/type-challenges/type-challenges/issues/11625)
export type Range<
  Start extends number,
  Stop extends number,
  Result extends number[] = [],
  Padding extends 0[] = [],
  Current extends number = [...Padding, ...Result]['length'] & number,
> = Current extends Stop
  ? Current extends Start
    ? [Current]
    : Result extends []
    ? []
    : [...Result, Current]
  : Current extends Start
  ? Range<Start, Stop, [Current], Padding>
  : Result extends []
  ? Range<Start, Stop, [], [...Padding, 0]>
  : Range<Start, Stop, [...Result, Current], Padding>

/**
 * @description Splits string by separator.
 *
 * @example
 * type Result = Split<'foo,bar,baz', ','>
 * //   ^? type Result = ["foo", "bar", "baz"]
 */
export type Split<
  T extends string,
  Separator extends string,
> = Separator extends ''
  ? T extends `${infer F}${infer R}`
    ? [F, ...Split<R, Separator>]
    : []
  : Separator extends T
  ? T[]
  : T extends `${infer F}${Separator}${infer R}`
  ? [F, ...Split<R, Separator>]
  : [T]

/**
 * @description Trims empty space from type T.
 *
 * @param T - Type to trim
 * @param Chars - Characters to trim
 * @returns Trimmed type
 *
 * @example
 * type Result = Trim<'      foo  '>
 * //   ^? type Result = "foo"
 */
export type Trim<T, Chars extends string = ' '> = TrimLeft<
  TrimRight<T, Chars>,
  Chars
>
type TrimLeft<T, Chars extends string = ' '> = T extends `${Chars}${infer R}`
  ? TrimLeft<R>
  : T
type TrimRight<T, Chars extends string = ' '> = T extends `${infer R}${Chars}`
  ? TrimRight<R>
  : T

/**
 * @description Create tuple of {@link Type} type with {@link Size} size
 *
 * @param Type - Type of tuple
 * @param Size - Size of tuple
 * @returns Tuple of {@link Type} type with {@link Size} size
 *
 * @example
 * type Result = Tuple<string, 2>
 * //   ^? [string, string]
 */
// https://github.com/Microsoft/TypeScript/issues/26223#issuecomment-674500430
export type Tuple<Type, Size extends number> = Size extends Size
  ? number extends Size
    ? Type[]
    : _TupleOf<Type, Size, []>
  : never
type _TupleOf<
  TNumber,
  TSize extends number,
  R extends readonly unknown[],
> = R['length'] extends TSize
  ? R
  : _TupleOf<TNumber, TSize, readonly [TNumber, ...R]>
