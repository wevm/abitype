/**
 * Checks if {@link T} is `unknown`
 *
 * @param T - Type to check
 * @returns `true` if `T` is `unknown`, otherwise `false`
 *
 * @example
 * type Result = IsUnknown<unknown>
 */
export type IsUnknown<T> = unknown extends T ? true : false

/**
 * Merges two object types into new type
 *
 * @param Object1 - Object to merge into
 * @param Object2 - Object to merge and override keys from {@link Object1}
 *
 * @example
 * type Result = Merge<{ foo: string }, { foo: number; bar: string }>
 * { foo: number; bar: string }
 */
export type Merge<Object1, Object2> = Omit<Object1, keyof Object2> & Object2

/**
 * Creates range between two positive numbers using [tail recursion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types).
 *
 * @param Start - Number to start range
 * @param Stop - Number to end range
 * @returns Array with inclusive range from {@link Start} to {@link Stop}
 *
 * @example
 * type Result = Range<1, 3>
 * [1, 2, 3]
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
 * Create tuple of {@link Type} type with {@link Size} size
 *
 * @param Type - Type of tuple
 * @param Size - Size of tuple
 * @returns Tuple of {@link Type} type with {@link Size} size
 *
 * @example
 * type Result = Tuple<string, 2>
 * [string, string]
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
