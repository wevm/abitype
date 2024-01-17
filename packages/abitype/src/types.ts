/**
 * Prints custom error message
 *
 * @param type - Error message
 * @returns Custom error message
 *
 * @example
 * type Result = Error<'Custom error message'>
 * //   ^? type Result = ['Error: Custom error message']
 */
export type Error<type extends string | string[]> = type extends string
  ? [
      // Surrounding with array to prevent `T` from being widened to `string`
      `Error: ${type}`,
    ]
  : {
      [K in keyof type]: type[K] extends infer message extends string
        ? `Error: ${message}`
        : never
    }

/**
 * Filters out all members of {@link type} that are {@link filter}
 *
 * @param type - Items to filter
 * @param filter - Type to filter out
 * @returns Filtered items
 *
 * @example
 * type Result = Filter<['a', 'b', 'c'], 'b'>
 * //   ^? type Result = ['a', 'c']
 */
export type Filter<
  type extends readonly unknown[],
  filter,
  ///
  acc extends readonly unknown[] = [],
> = type extends readonly [infer head, ...infer rest extends readonly unknown[]]
  ? [head] extends [filter]
    ? Filter<rest, filter, acc>
    : Filter<rest, filter, [...acc, head]>
  : readonly [...acc]

/**
 * Checks if {@link type} can be narrowed further than {@link type2}
 *
 * @param type - Type to check
 * @param type2 - Type to against
 *
 * @example
 * type Result = IsNarrowable<'foo', string>
 * //   ^? true
 */
export type IsNarrowable<type, type2> = IsUnknown<type> extends true
  ? false
  : IsNever<
      (type extends type2 ? true : false) & (type2 extends type ? false : true)
    > extends true
  ? false
  : true

/**
 * Checks if {@link type} is `never`
 *
 * @param type - Type to check
 *
 * @example
 * type Result = IsNever<never>
 * //   ^? type Result = true
 */
export type IsNever<type> = [type] extends [never] ? true : false

/**
 * Checks if {@link type} is `unknown`
 *
 * @param type - Type to check
 * @returns `true` if {@link type} is `unknown`, otherwise `false`
 *
 * @example
 * type Result = IsUnknown<unknown>
 * //   ^? type Result = true
 */
export type IsUnknown<type> = unknown extends type ? true : false

/**
 * Joins array into string
 *
 * @param type - Array to join
 * @param separator - Separator
 * @returns string
 *
 * @example
 * type Result = Join<['a', 'b', 'c'], '-'>
 * //   ^? type Result = 'a-b-c'
 */
export type Join<
  type extends readonly unknown[],
  separator extends string | number,
> = type extends readonly [infer head, ...infer rest]
  ? rest['length'] extends 0
    ? `${head & string}`
    : `${head & string}${separator}${Join<rest, separator>}`
  : never

/**
 * Merges two object types into new type
 *
 * @param object1 - Object to merge into
 * @param object2 - Object to merge and override keys from {@link object1}
 * @returns New object type with keys from {@link object1} and {@link object2}. If a key exists in both {@link object1} and {@link object2}, the key from {@link object2} will be used.
 *
 * @example
 * type Result = Merge<{ foo: string }, { foo: number; bar: string }>
 * //   ^? type Result = { foo: number; bar: string }
 */
export type Merge<object1, object2> = Omit<object1, keyof object2> & object2

/**
 * Makes objects destructurable.
 *
 * @param union - Union to distribute.
 *
 * @example
 * type Result = OneOf<{ foo: boolean } | { bar: boolean }>
 * //   ^? type Result = { foo: boolean; bar?: undefined; } | { bar: boolean; foo?: undefined; }
 */
export type OneOf<
  union extends object,
  keys extends KeyofUnion<union> = KeyofUnion<union>,
> = union extends infer item
  ? Pretty<item & { [_ in Exclude<keys, keyof item>]?: never }>
  : never
type KeyofUnion<type> = type extends type ? keyof type : never

/**
 * Combines members of an intersection into a readable type.
 *
 * @link https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
 * @example
 * type Result = Pretty<{ a: string } | { b: string } | { c: number, d: bigint }>
 * //   ^? type Result = { a: string; b: string; c: number; d: bigint }
 */
export type Pretty<type> = { [key in keyof type]: type[key] } & unknown

/**
 * Check that a type is a subtype of another.
 *
 * Useful for ensuring more complex types conform to a base pattern, e.g. by
 * defining a set of keys.
 *
 * @param base - The type that T must extend.
 * @param type - The type to check.
 * @returns type
 */
export type Satisfy<base, type extends base> = type

/**
 * Creates range between two positive numbers using [tail recursion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types).
 *
 * @param start - Number to start range
 * @param stop - Number to end range
 * @returns Array with inclusive range from {@link start} to {@link stop}
 *
 * @example
 * type Result = Range<1, 3>
 * //   ^? type Result = [1, 2, 3]
 */
// From [Type Challenges](https://github.com/type-challenges/type-challenges/issues/11625)
export type Range<
  start extends number,
  stop extends number,
  result extends number[] = [],
  padding extends 0[] = [],
  current extends number = [...padding, ...result]['length'] & number,
> = current extends stop
  ? current extends start
    ? [current]
    : result extends []
    ? []
    : [...result, current]
  : current extends start
  ? Range<start, stop, [current], padding>
  : result extends []
  ? Range<start, stop, [], [...padding, 0]>
  : Range<start, stop, [...result, current], padding>

/**
 * Trims empty space from type.
 *
 * @param type - Type to trim
 * @param chars - Characters to trim
 * @returns Trimmed type
 *
 * @example
 * type Result = Trim<'      foo  '>
 * //   ^? type Result = "foo"
 */
export type Trim<type, chars extends string = ' '> = TrimLeft<
  TrimRight<type, chars>,
  chars
>
type TrimLeft<
  type,
  chars extends string = ' ',
> = type extends `${chars}${infer next}` ? TrimLeft<next> : type
type TrimRight<
  type,
  chars extends string = ' ',
> = type extends `${infer next}${chars}` ? TrimRight<next> : type

/**
 * Create tuple of {@link type} type with {@link size} size
 *
 * @param type - Type of tuple
 * @param size - Size of tuple
 * @returns Tuple of {@link type} type with {@link size} size
 *
 * @example
 * type Result = Tuple<string, 2>
 * //   ^? type Result = [string, string]
 */
// https://github.com/Microsoft/TypeScript/issues/26223#issuecomment-674500430
export type Tuple<type, size extends number> = size extends size
  ? number extends size
    ? type[]
    : _TupleOf<type, size, []>
  : never
type _TupleOf<
  type,
  size extends number,
  rest extends readonly unknown[],
> = rest['length'] extends size
  ? rest
  : _TupleOf<type, size, readonly [type, ...rest]>
