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
// From [Type Challenges #734](https://github.com/type-challenges/type-challenges/issues/11625)
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
 * Create tuple of {@link TType} type with {@link TSize} size
 *
 * @param TType - Type of tuple
 * @param TSize - Size of tuple
 * @returns Tuple of {@link TType} type with {@link TSize} size
 *
 * @example
 * type Result = Tuple<string, 2>
 * [string, string]
 */
// https://github.com/Microsoft/TypeScript/issues/26223#issuecomment-674500430
export type Tuple<TType, TSize extends number> = TSize extends TSize
  ? number extends TSize
    ? TType[]
    : _TupleOf<TType, TSize, []>
  : never
type _TupleOf<
  TNumber,
  TSize extends number,
  R extends unknown[],
> = R['length'] extends TSize ? R : _TupleOf<TNumber, TSize, [TNumber, ...R]>

/**
 * Positive multiples of eight from eight to 256
 */
export type MultiplesOf8To256 =
  | 8
  | 16
  | 24
  | 32
  | 40
  | 48
  | 56
  | 64
  | 72
  | 80
  | 88
  | 96
  | 104
  | 112
  | 120
  | 128
  | 136
  | 144
  | 152
  | 160
  | 168
  | 176
  | 184
  | 192
  | 200
  | 208
  | 216
  | 224
  | 232
  | 240
  | 248
  | 256
