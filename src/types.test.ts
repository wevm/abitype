import { expectType, test } from '../test'
import { MultiplesOf8To256, Range, Tuple } from './types'

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

test('Tuple', () => {
  expectType<Tuple<string, 2>>(['foo', 'bar'])
  expectType<Tuple<string | number, 2>>(['foo', 1])
})
