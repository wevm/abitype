import { assertType, test } from 'vitest'

import type { Narrow } from './narrow.js'
import { narrow } from './narrow.js'

test('Narrow', () => {
  assertType<Narrow<['foo', 'bar', 1]>>(['foo', 'bar', 1])
})

test('narrow', () => {
  const asConst = narrow(['foo', 'bar', 1])
  //    ^?
  type Result = typeof asConst
  assertType<Result>(['foo', 'bar', 1])

  assertType<'foo'>(narrow('foo'))
  assertType<1>(narrow(1))
  assertType<true>(narrow(true))
  assertType<{ foo: 'bar' }>(narrow({ foo: 'bar' }))
})
