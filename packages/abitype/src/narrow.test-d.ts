import { assertType, expectTypeOf, test } from 'vitest'

import type { Narrow } from './narrow.js'
import { narrow } from './narrow.js'

test('Narrow', () => {
  expectTypeOf<Narrow<['foo', 'bar', 1]>>().toEqualTypeOf<['foo', 'bar', 1]>()
  expectTypeOf<Narrow<unknown>>().toEqualTypeOf<unknown>()
})

test('narrow', () => {
  const asConst = narrow(['foo', 'bar', 1])
  //    ^?
  type Result = typeof asConst
  expectTypeOf<Result>().toEqualTypeOf<['foo', 'bar', 1]>()

  assertType<'foo'>(narrow('foo'))
  assertType<1>(narrow(1))
  assertType<true>(narrow(true))
  assertType<{ foo: 'bar' }>(narrow({ foo: 'bar' }))
})
