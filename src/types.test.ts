import { test } from 'vitest'

import { expectType } from '../test'
import {
  Equal,
  LengthOfString,
  MultiplesOf8To256,
  Range,
  Replace,
} from './types'

test('Equal', () => {
  expectType<Equal<'foo', 'foo'>>(true)
  expectType<Equal<'foo', 'bar'>>(false)
})

test('LengthOfString', () => {
  expectType<LengthOfString<''>>(0)
  expectType<LengthOfString<'foo'>>(3)
  expectType<LengthOfString<'0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'>>(42)
})

test('MultiplesOf8To256', () => {
  expectType<MultiplesOf8To256>(8)
  expectType<MultiplesOf8To256>(16)
  expectType<MultiplesOf8To256>(256)
  // @ts-expect-error 264 is greater than 256
  expectType<MultiplesOf8To256>(264)
  // @ts-expect-error Zero is not multiple of eight
  expectType<MultiplesOf8To256>(0)
})

test('Range', () => {
  expectType<Range<0, 2>>([0, 1, 2])
  expectType<Range<10, 12>>([10, 11, 12])
  expectType<Range<1, 10>>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  expectType<Range<1, 1>>([1])
  expectType<Range<1, 0>>([])
  // @ts-expect-error Only positive ranges work
  expectType<Range<-2, 0>>([-2, -1, 0])
})

test('Replace', () => {
  expectType<Replace<'foo', 'f', 'b'>>('boo')
  expectType<Replace<'foo bar', 'bar', 'baz'>>('foo baz')
})
