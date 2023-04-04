import { assertType, test } from 'vitest'

import type {
  ExtractName,
  ExtractParameters,
  Slice,
  SplitByChunks,
  ToSelector,
} from './utils'

test('Slice', () => {
  assertType<Slice<'HelloWorld', 5>>('Hello')
  assertType<Slice<'Hello           World', 6>>('Hello ')
  assertType<
    Slice<
      '0000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      32
    >
  >('0000000000000000000000005c69bee7')
  assertType<
    Slice<
      '0000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      64
    >
  >('0000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f')
})

test('Split by chunks', () => {
  assertType<
    SplitByChunks<'0000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'>
  >([
    '000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    '0000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
  ])
})

test('To Selector', () => {
  assertType<ToSelector<'5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f'>>('5c69bee7')
  assertType<ToSelector<'01ef814a2b6a3edd4b1652cb9cc5aa6f'>>('01ef814a')
})

test('ExtractName', () => {
  assertType<ExtractName<'name(string)'>>('name')
  assertType<ExtractName<'nam(string)'>>('nam')
  assertType<ExtractName<'n(string)'>>('n')
  assertType<ExtractName<'getName(string)'>>('getName')
  assertType<ExtractName<'nameS(string)'>>('nameS')
  assertType<ExtractName<'(string)'>>('')
})

test('ExtractParameters', () => {
  assertType<ExtractParameters<'name(string, hello)'>>(['string', 'hello'])
  assertType<ExtractParameters<'(string)'>>(['string'])
  assertType<ExtractParameters<'name()'>>([])
  assertType<ExtractParameters<'(string, (name))'>>(['string', '(name)'])
})
