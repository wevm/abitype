/**
 * Prints custom error message
 *
 * @param T - Error message
 * @returns Custom error message
 *
 * @example
 * type Result = Error<'Custom error message'>
 * //   ^? type Result = ['Error: Custom error message']
 */
export type Error<T extends string | string[]> = T extends string
  ? [
      // Surrounding with array to prevent `T` from being widened to `string`
      `Error: ${T}`,
    ]
  : {
      [K in keyof T]: T[K] extends infer Message extends string
        ? `Error: ${Message}`
        : never
    }

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
export type Filter<
  T extends readonly unknown[],
  U,
  Acc extends readonly unknown[] = [],
> = T extends readonly [infer F, ...infer Rest extends readonly unknown[]]
  ? [F] extends [U]
    ? Filter<Rest, U, Acc>
    : Filter<Rest, U, [...Acc, F]>
  : readonly [...Acc]

/**
 * Checks if {@link T} can be narrowed further than {@link U}
 *
 * @param T - Type to check
 * @param U - Type to against
 *
 * @example
 * type Result = IsNarrowable<'foo', string>
 * //   ^? true
 */
export type IsNarrowable<T, U> = IsNever<
  (T extends U ? true : false) & (U extends T ? false : true)
> extends true
  ? false
  : true

/**
 * Checks if {@link T} is `never`
 *
 * @param T - Type to check
 *
 * @example
 * type Result = IsNever<never>
 * //   ^? type Result = true
 */
export type IsNever<T> = [T] extends [never] ? true : false

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
 * Joins array into string
 *
 * @param T - Array to join
 * @param U - Separator
 * @returns string
 *
 * @example
 * type Result = Join<['a', 'b', 'c'], '-'>
 * //   ^? type Result = 'a-b-c'
 */
export type Join<
  T extends readonly unknown[],
  U extends string | number,
> = T extends readonly [infer F, ...infer R]
  ? R['length'] extends 0
    ? `${F & string}`
    : `${F & string}${U}${Join<R, U>}`
  : never

/**
 * Merges two object types into new type
 *
 * @param Object1 - Object to merge into
 * @param Object2 - Object to merge and override keys from {@link Object1}
 * @returns New object type with keys from {@link Object1} and {@link Object2}. If a key exists in both {@link Object1} and {@link Object2}, the key from {@link Object2} will be used.
 *
 * @example
 * type Result = Merge<{ foo: string }, { foo: number; bar: string }>
 * //   ^? type Result = { foo: number; bar: string }
 */
export type Merge<Object1, Object2> = Omit<Object1, keyof Object2> & Object2

/**
 * Makes objects destructurable.
 *
 * @param Union - Union to distribute.
 *
 * @example
 * type Result = OneOf<{ foo: boolean } | { bar: boolean }>
 * //   ^? type Result = { foo: boolean; bar?: undefined; } | { bar: boolean; foo?: undefined; }
 */
export type OneOf<
  Union extends object,
  AllKeys extends KeyofUnion<Union> = KeyofUnion<Union>,
> = Union extends infer Item
  ? Pretty<Item & { [K in Exclude<AllKeys, keyof Item>]?: never }>
  : never
type KeyofUnion<T> = T extends T ? keyof T : never

/**
 * Combines members of an intersection into a readable type.
 *
 * @link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
 * @example
 * type Result = Pretty<{ a: string } | { b: string } | { c: number, d: bigint }>
 * //   ^? type Result = { a: string; b: string; c: number; d: bigint }
 */
export type Pretty<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * Creates range between two positive numbers using [tail recursion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types).
 *
 * @param Start - Number to start range
 * @param Stop - Number to end range
 * @returns Array with inclusive range from {@link Start} to {@link Stop}
 *
 * @example
 * type Result = Range<1, 3>
 * //   ^? type Result = [1, 2, 3]
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
 * Trims empty space from type T.
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
 * Create tuple of {@link Type} type with {@link Size} size
 *
 * @param Type - Type of tuple
 * @param Size - Size of tuple
 * @returns Tuple of {@link Type} type with {@link Size} size
 *
 * @example
 * type Result = Tuple<string, 2>
 * //   ^? type Result = [string, string]
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

/**
 * Check if a given object has no keys.
 *
 * @param T - Object to check
 * @param AllKeys - Keys to check. Default to keyof {@link T}
 * @returns true if empty false if not
 *
 * @example
 * type Result = IsEmptyObject<{}>
 * //   ^? type Result = true
 */
export type IsEmptyObject<
  T extends object,
  AllKeys extends keyof T = keyof T,
> = IsNever<AllKeys>

/**
 * Flattens array of nested arrays into a single array with all of the elements.
 * This also filters any `never` elements that the arrays might have.
 *
 * @param T - Array with nested arrays.
 * @returns an array with all the elements of the nested arrays.
 *
 * @example
 * type Result = Flatten<[1, [2], [[3]]]>
 * //   ^? type Result = [1, 2, 3]
 */
export type Flatten<
  T extends readonly unknown[],
  Result extends readonly unknown[] = [],
> = T extends readonly [infer Head, ...infer Rest extends readonly unknown[]]
  ? [Head] extends [never]
    ? Flatten<[...Rest], Result>
    : Head extends readonly any[]
    ? Flatten<[...Head, ...Rest], Result>
    : Flatten<[...Rest], [...Result, Head]>
  : Result

/**
 * Checks if a string literal is an array.
 *
 * @param T - String to check.
 * @returns The extracted value if an array or {@link T} if not.
 *
 * @example
 * type Result = IsArrayString<"Foo[]">
 * //   ^? type Result = "Foo"
 */
export type IsArrayString<T extends string> =
  T extends `${infer Name}[${string}]` ? Name : T

/**
 * Pops the last elements of an array of numbers.
 *
 * @param T - Array with numbers.
 * @returns the array without the last element.
 *
 * @example
 * type Result = Pop<[1, 2, 3]>
 * //   ^? type Result = [1, 2]
 */
export type Pop<T extends readonly number[]> = T extends [...infer R, any]
  ? R
  : []
