/**
 * Creates range between two positive numbers using [tail recursion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-5.html#tail-recursion-elimination-on-conditional-types)
 *
 * From: https://github.com/type-challenges/type-challenges/issues/11625
 */
export type InclusiveRange<
  Start extends number,
  Stop extends number,
  Res extends number[] = [],
  Padding extends 0[] = [],
  Current extends number = [...Padding, ...Res]['length'] & number,
> = Current extends Stop
  ? Current extends Start
    ? [Current]
    : Res extends []
    ? []
    : [...Res, Current]
  : Current extends Start
  ? InclusiveRange<Start, Stop, [Current], Padding>
  : Res extends []
  ? InclusiveRange<Start, Stop, [], [...Padding, 0]>
  : InclusiveRange<Start, Stop, [...Res, Current], Padding>

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
