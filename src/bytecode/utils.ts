import type { SplitParameters } from '../human-readable/types'
import type { OPCODES } from './opcodes'

export type Slice<
  T extends string,
  TNumber extends number,
  Depth extends 0[] = [],
  TResult extends string = '',
> = Depth['length'] extends TNumber
  ? TResult
  : T extends `${infer Char}${infer Rest}`
  ? Slice<Rest, TNumber, [0, ...Depth], `${TResult}${Char}`>
  : never

export type SplitByChunks<T extends string, TResult extends any[] = []> = [
  Slice<T, 64>,
] extends [never]
  ? TResult
  : T extends `${Slice<T, 64>}${infer Rest}`
  ? SplitByChunks<Rest, [Slice<T, 64>, ...TResult]>
  : TResult

export type ToSelector<
  T extends string,
  Depth extends any[] = [],
  TResult extends string = '',
> = Depth['length'] extends 8
  ? TResult
  : T extends `${infer Char}${infer Rest extends string}`
  ? ToSelector<Rest, [Char, ...Depth], `${TResult}${Char}`>
  : never

export type RecurseSelector<T extends string> =
  T extends `${string}${OPCODES['DUP1']}${OPCODES['PUSH4']}${infer Tail}`
    ? RecurseSelector<Tail>
    : `0x${T}`

export type IsErrorSelector<T extends string> =
  T extends `${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${infer Rest}`
    ? Rest extends ''
      ? true
      : Rest extends `${string}${string}${infer Rest}`
      ? Rest extends ''
        ? true
        : Rest extends `${string}${string}${string}${string}${infer Rest}`
        ? Rest extends ''
          ? true
          : Rest extends `${string}${string}${infer Rest}`
          ? Rest extends ''
            ? true
            : Rest extends `${string}${string}${string}${string}${infer Rest}`
            ? Rest extends ''
              ? true
              : Rest extends `${string}${string}${infer Rest}`
              ? Rest extends ''
                ? true
                : Rest extends `${string}${string}${infer Rest}`
                ? Rest extends ''
                  ? true
                  : Rest extends `${string}${string}${string}${string}${infer Rest}`
                  ? Rest extends ''
                    ? true
                    : Rest extends `${string}${string}${string}${string}${infer Rest}`
                    ? Rest extends ''
                      ? true
                      : Rest extends `${string}${string}${string}${string}${string}${string}${infer Rest}`
                      ? Rest extends ''
                        ? true
                        : false
                      : false
                    : false
                  : false
                : false
              : false
            : false
          : false
        : false
      : false
    : false

export type ExtractName<T> = T extends `${infer Name}(${string})` ? Name : ''

export type ExtractParameters<T> = T extends `${string}(${infer Parameters})`
  ? SplitParameters<Parameters>
  : []
