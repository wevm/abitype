import { expectType, test } from '../test'
import { Narrow, narrow } from './narrow'

test('Narrow', () => {
  expectType<Narrow<['foo', 'bar', 1]>>(['foo', 'bar', 1])
})

test('narrow', () => {
  const asConst = narrow(['foo', 'bar', 1])
  //    ^?
  type Result = typeof asConst
  expectType<Result>(['foo', 'bar', 1])

  expectType<'foo'>(narrow('foo'))
  expectType<1>(narrow(1))
  expectType<true>(narrow(true))
  expectType<{ foo: 'bar' }>(narrow({ foo: 'bar' }))
})
