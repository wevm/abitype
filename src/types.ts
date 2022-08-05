/**
 * Calculate length of template string (supports several hundred characters).
 *
 * @param TString - String to calculate length
 * @returns Length of string
 *
 * @example
 *
 * ```ts
 * // Returns 3
 * type Result = LengthOfString<'baz'>
 * ```
 */
// From [Type Challenges #651](https://github.com/type-challenges/type-challenges/issues/11438)
export type LengthOfString<
  TString extends string,
  _Res extends 1[] = [],
> = TString extends `${string}${infer Rest}`
  ? LengthOfString<Rest, [..._Res, 1]>
  : _Res['length']

/**
 * Converts value to array if type ends in `[]`
 *
 * @param TString - String to check
 * @param Value - Value to turn into array or return
 * @returns Either {@link Value} or {@link Value} as an array
 *
 * @example
 *
 * ```ts
 * // Returns { name: string }[]
 * type Result = Equal<'tuple[]', { name: string }}>
 * ```
 */
export type MaybeArray<
  TString extends string,
  Value,
> = TString extends `${any}[]` ? Value[] : Value

/**
 * Creates range between two positive numbers using [tail recursion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types).
 *
 * @param Start - Number to start range
 * @param Stop - Number to end range
 * @returns Array with inclusive range from {@link Start} to {@link Stop}
 *
 * @example
 *
 * ```ts
 * // Returns [1, 2, 3]
 * type Result = Range<1, 3>
 *```
 */
// From [Type Challenges #734](https://github.com/type-challenges/type-challenges/issues/11625)
export type Range<
  Start extends number,
  Stop extends number,
  _Res extends number[] = [],
  _Padding extends 0[] = [],
  _Current extends number = [..._Padding, ..._Res]['length'] & number,
> = _Current extends Stop
  ? _Current extends Start
    ? [_Current]
    : _Res extends []
    ? []
    : [..._Res, _Current]
  : _Current extends Start
  ? Range<Start, Stop, [_Current], _Padding>
  : _Res extends []
  ? Range<Start, Stop, [], [..._Padding, 0]>
  : Range<Start, Stop, [..._Res, _Current], _Padding>

/**
 * Replaces value in string with provided value.
 *
 * @param TString - String to replace value in
 * @param From - Substring of {@link TString} to replace with {@link To}
 * @param To - String to replace {@link From}
 * @returns Array with inclusive range from {@link Start} to {@link Stop}
 *
 * @example
 *
 * ```ts
 * // Returns foobaz
 * type Result = Replace<'foobar', 'bar', 'baz'>
 *```
 */
// From [Type Challenges #116](https://github.com/type-challenges/type-challenges/issues/12825)
export type Replace<
  TString extends string,
  From extends string,
  To extends string,
> = From extends ''
  ? TString
  : TString extends `${infer H}${From}${infer R}`
  ? `${H}${To}${R}`
  : TString

/**
 * Create tuple of {@link T} type with {@link N} size
 *
 * @param T - Type of tuple
 * @param N - Size of tuple
 * @returns Tuple of {@link T} type with {@link N} size
 *
 * @example
 *
 * ```ts
 * // Returns [string, string]
 * type Result = Tuple<string, 2>
 * ```
 */
// https://github.com/Microsoft/TypeScript/issues/26223#issuecomment-674500430
export type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>

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
