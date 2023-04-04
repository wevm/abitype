import { assertType, test } from 'vitest'

import type { uniswap, weth } from '../test/bytecodes'
import type { InferConstructorArguments } from './bytecode'
import type {
  ExtractSelectors,
  FindConstructorArgs,
  FindEventSelectors,
  FindFunctionSelectors,
} from './selectors'
import type { SplitByChunks } from './utils'

test('Find Function Selectors', () => {
  assertType<FindFunctionSelectors<typeof weth>>([
    { type: 'function', selector: '0x06fdde03' },
    { type: 'function', selector: '0x095ea7b3' },
    { type: 'function', selector: '0x18160ddd' },
    { type: 'function', selector: '0x23b872dd' },
    { type: 'function', selector: '0x2e1a7d4d' },
    { type: 'function', selector: '0x313ce567' },
    { type: 'function', selector: '0x70a08231' },
    { type: 'function', selector: '0x95d89b41' },
    { type: 'function', selector: '0xa9059cbb' },
    { type: 'function', selector: '0xd0e30db0' },
    { type: 'function', selector: '0xdd62ed3e' },
  ])
})

test('Find Event Selectors', () => {
  assertType<FindEventSelectors<typeof weth>>([
    { type: 'event', selector: '0xe1fffcc4' },
    { type: 'event', selector: '0xddf252ad' },
    { type: 'event', selector: '0x7fcf532c' },
  ])
})

test('Find Constructor Args', () => {
  assertType<FindConstructorArgs<typeof uniswap>>(
    '0000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  )
})

test('Infer Constructor Args', () => {
  assertType<
    InferConstructorArguments<
      SplitByChunks<FindConstructorArgs<typeof uniswap>>
    >
  >([{ type: 'address' }, { type: 'address' }])
})

test('Extract Selectors', () => {
  assertType<ExtractSelectors<typeof weth>>([
    { type: 'constructor', selector: '' },
    { type: 'event', selector: '0xe1fffcc4' },
    { type: 'event', selector: '0xddf252ad' },
    { type: 'event', selector: '0x7fcf532c' },
    { type: 'function', selector: '0x06fdde03' },
    { type: 'function', selector: '0x095ea7b3' },
    { type: 'function', selector: '0x18160ddd' },
    { type: 'function', selector: '0x23b872dd' },
    { type: 'function', selector: '0x2e1a7d4d' },
    { type: 'function', selector: '0x313ce567' },
    { type: 'function', selector: '0x70a08231' },
    { type: 'function', selector: '0x95d89b41' },
    { type: 'function', selector: '0xa9059cbb' },
    { type: 'function', selector: '0xd0e30db0' },
    { type: 'function', selector: '0xdd62ed3e' },
  ])

  assertType<ExtractSelectors<typeof uniswap>>([
    {
      type: 'constructor',
      selector:
        '0000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
    {
      type: 'function',
      selector: '0xe8e33700',
    },
    { type: 'function', selector: '0xf305d719' },
    { type: 'function', selector: '0xfb3bdb41' },
    { type: 'function', selector: '0xc45a0155' },
    { type: 'function', selector: '0xd06ca61f' },
    { type: 'function', selector: '0xded9382a' },
    { type: 'function', selector: '0xaf2979eb' },
    { type: 'function', selector: '0xb6f9de95' },
    { type: 'function', selector: '0xbaa2abde' },
    { type: 'function', selector: '0x8803dbee' },
    { type: 'function', selector: '0xad5c4648' },
    { type: 'function', selector: '0xad615dec' },
    {
      type: 'function',
      selector: '0x791ac947',
    },
    { type: 'function', selector: '0x7ff36ab5' },
    { type: 'function', selector: '0x85f8c259' },
    { type: 'function', selector: '0x4a25d94a' },
    { type: 'function', selector: '0x5b0d5984' },
    { type: 'function', selector: '0x5c11d795' },
    { type: 'function', selector: '0x1f00ca74' },
    { type: 'function', selector: '0x2195995c' },
    { type: 'function', selector: '0x38ed1739' },
    { type: 'function', selector: '0x02751cec' },
    { type: 'function', selector: '0x054d50d4' },
    { type: 'function', selector: '0x18cbafe5' },
  ])
})
