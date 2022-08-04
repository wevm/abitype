import { test } from 'vitest'

import { expectType } from '../test'
import { InclusiveRange, MultiplesOf8To256 } from './types'

test('InclusiveRange', () => {
  expectType<InclusiveRange<0, 2>>([0, 1, 2])
  expectType<InclusiveRange<10, 12>>([10, 11, 12])
  expectType<InclusiveRange<1, 10>>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  expectType<InclusiveRange<1, 1>>([1])
  expectType<InclusiveRange<1, 0>>([])
  // @ts-expect-error Only positive ranges work
  expectType<InclusiveRange<-2, 0>>([-2, -1, 0])
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
