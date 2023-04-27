import { assertType, expectTypeOf, test } from 'vitest'

import type {
  Error,
  Filter,
  IsUnknown,
  Merge,
  Range,
  Trim,
  Tuple,
} from './types.js'

test('Error', () => {
  expectTypeOf<Error<'Custom error message'>>().toEqualTypeOf<
    ['Error: Custom error message']
  >()
  expectTypeOf<
    Error<['Custom error message', 'Another custom message']>
  >().toEqualTypeOf<
    ['Error: Custom error message', 'Error: Another custom message']
  >()
})

test('Filter', () => {
  expectTypeOf<Filter<[1, 'foo', false, 'baz'], boolean>>().toEqualTypeOf<
    readonly [1, 'foo', 'baz']
  >()
})

test('IsUnknown', () => {
  expectTypeOf<IsUnknown<unknown>>().toEqualTypeOf<true>()
  expectTypeOf<IsUnknown<number | bigint>>().toEqualTypeOf<false>()
})

test('Merge', () => {
  assertType<Merge<{ foo: number }, { bar: string }>>({ foo: 123, bar: 'abc' })
  assertType<Merge<{ foo: number }, { foo: string; bar: string }>>({
    foo: 'xyz',
    bar: 'abc',
  })
})

test('Range', () => {
  assertType<Range<0, 2>>([0, 1, 2])
  assertType<Range<10, 12>>([10, 11, 12])
  assertType<Range<1, 10>>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  assertType<Range<1, 1>>([1])
  assertType<Range<1, 0>>([])
  // @ts-expect-error Only positive ranges work
  assertType<Range<-2, 0>>([-2, -1, 0])
})

test('Trim', () => {
  assertType<Trim<'foo bar baz                 '>>('foo bar baz')
  assertType<Trim<'                 foo bar baz'>>('foo bar baz')
  assertType<Trim<'                 foo bar baz                 '>>(
    'foo bar baz',
  )
})

test('Tuple', () => {
  expectTypeOf<Tuple<string, 2>>().toEqualTypeOf<readonly [string, string]>()
  expectTypeOf<Tuple<string | number, 2>>().toEqualTypeOf<
    readonly [string | number, string | number]
  >()
})
