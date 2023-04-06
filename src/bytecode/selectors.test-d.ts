import { assertType, test } from 'vitest'

import type { seaport, uniswap, weth } from '../test/bytecodes'
import type { InferConstructorArguments } from './bytecode'
import type {
  ExtractSelectors,
  FindConstructorArgs,
  FindErrorSelectors,
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

  assertType<FindFunctionSelectors<typeof uniswap>>([
    { type: 'function', selector: '0xe8e33700' },
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
    { type: 'function', selector: '0x791ac947' },
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

  assertType<FindFunctionSelectors<typeof seaport>>([
    { type: 'function', selector: '0x06fdde03' },
    { type: 'function', selector: '0x46423aa7' },
    { type: 'function', selector: '0x5b34b966' },
    { type: 'function', selector: '0x79df72bd' },
    { type: 'function', selector: '0x87201b41' },
    { type: 'function', selector: '0x88147732' },
    { type: 'function', selector: '0xa8174404' },
    { type: 'function', selector: '0xa900866b' },
    { type: 'function', selector: '0xb3a34c4c' },
    { type: 'function', selector: '0xe7acab24' },
    { type: 'function', selector: '0xed98a574' },
    { type: 'function', selector: '0xf07ec373' },
    { type: 'function', selector: '0xf2d12b12' },
    { type: 'function', selector: '0xf47b7740' },
    { type: 'function', selector: '0xfb0f3ee1' },
  ])
})

test('Find Event Selectors', () => {
  assertType<FindEventSelectors<typeof weth>>([
    { type: 'event', selector: '0xe1fffcc4' },
    { type: 'event', selector: '0x8c5be1e5' },
    { type: 'event', selector: '0xddf252ad' },
    { type: 'event', selector: '0x7fcf532c' },
  ])

  assertType<FindEventSelectors<typeof uniswap>>([])
  assertType<FindEventSelectors<typeof seaport>>([
    { type: 'event', selector: '0x6bacc01d' },
    { type: 'event', selector: '0x4b9f2d36' },
  ])
})

test('Find Error Selectors', () => {
  assertType<FindErrorSelectors<typeof seaport>>([
    { type: 'error', selector: '0x6ab37ce7' },
    { type: 'error', selector: '0x39f3e3fd' },
    { type: 'error', selector: '0x466aa616' },
    { type: 'error', selector: '0x21ccfeb7' },
    { type: 'error', selector: '0x8ffff980' },
    { type: 'error', selector: '0x69f95827' },
    { type: 'error', selector: '0xa61be9f0' },
    { type: 'error', selector: '0xbc806b96' },
    { type: 'error', selector: '0x91b3e514' },
    { type: 'error', selector: '0xd13d53d4' },
    { type: 'error', selector: '0x1cf99b26' },
    { type: 'error', selector: '0xc63cf089' },
    { type: 'error', selector: '0x133c37c6' },
    { type: 'error', selector: '0xa8930e9a' },
    { type: 'error', selector: '0xd6929332' },
    { type: 'error', selector: '0x94eb6af6' },
    { type: 'error', selector: '0x09bde339' },
    { type: 'error', selector: '0x375c24c1' },
    { type: 'error', selector: '0x375c24c1' },
    { type: 'error', selector: '0xa5f54208' },
    { type: 'error', selector: '0xbced929d' },
    { type: 'error', selector: '0x93979285' },
    { type: 'error', selector: '0x7fa8a987' },
    { type: 'error', selector: '0x4f7fb80d' },
    { type: 'error', selector: '0x1f003d0a' },
    { type: 'error', selector: '0x8baa579f' },
    { type: 'error', selector: '0x10fda3e1' },
    { type: 'error', selector: '0xfb5014fc' },
    { type: 'error', selector: '0x8ffff980' },
    { type: 'error', selector: '0x6ab37ce7' },
    { type: 'error', selector: '0xf486bc87' },
    { type: 'error', selector: '0x12d3f5a3' },
    { type: 'error', selector: '0x09bde339' },
    { type: 'error', selector: '0xd5da9a1b' },
    { type: 'error', selector: '0x7fda7279' },
    { type: 'error', selector: '0x4e487b71' },
    { type: 'error', selector: '0x98e9db6e' },
    { type: 'error', selector: '0xee9e0e63' },
    { type: 'error', selector: '0x1a515574' },
    { type: 'error', selector: '0x5a052b32' },
    { type: 'error', selector: '0xa11b63ff' },
    { type: 'error', selector: '0x2165628a' },
    { type: 'error', selector: '0xfed398fc' },
    { type: 'error', selector: '0xf486bc87' },
    { type: 'error', selector: '0x1a515574' },
  ])

  assertType<FindErrorSelectors<typeof weth>>([])
  assertType<FindErrorSelectors<typeof uniswap>>([])
})

test('Find Constructor Args', () => {
  assertType<FindConstructorArgs<typeof uniswap>>(
    '0000000000000000000000005c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  )
  assertType<FindConstructorArgs<typeof seaport>>(
    '00000000000000000000000000000000f9490004c11cef243f5400493c00ad63',
  )
  assertType<FindConstructorArgs<typeof weth>>('')
})

test('Infer Constructor Args', () => {
  assertType<
    InferConstructorArguments<
      SplitByChunks<FindConstructorArgs<typeof uniswap>>
    >
  >([{ type: 'address' }, { type: 'address' }])

  assertType<
    InferConstructorArguments<
      SplitByChunks<FindConstructorArgs<typeof seaport>>
    >
  >([{ type: 'address' }])
})

test('Extract Selectors', () => {
  assertType<ExtractSelectors<typeof weth>>([
    { type: 'constructor', selector: '' },
    { type: 'event', selector: '0xe1fffcc4' },
    { type: 'event', selector: '0x8c5be1e5' },
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

  assertType<ExtractSelectors<typeof seaport>>([
    {
      type: 'constructor',
      selector:
        '00000000000000000000000000000000f9490004c11cef243f5400493c00ad63',
    },
    { type: 'error', selector: '0x6ab37ce7' },
    { type: 'error', selector: '0x39f3e3fd' },
    { type: 'error', selector: '0x466aa616' },
    { type: 'error', selector: '0x21ccfeb7' },
    { type: 'error', selector: '0x8ffff980' },
    { type: 'error', selector: '0x69f95827' },
    { type: 'error', selector: '0xa61be9f0' },
    { type: 'error', selector: '0xbc806b96' },
    { type: 'error', selector: '0x91b3e514' },
    { type: 'error', selector: '0xd13d53d4' },
    { type: 'error', selector: '0x1cf99b26' },
    { type: 'error', selector: '0xc63cf089' },
    { type: 'error', selector: '0x133c37c6' },
    { type: 'error', selector: '0xa8930e9a' },
    { type: 'error', selector: '0xd6929332' },
    { type: 'error', selector: '0x94eb6af6' },
    { type: 'error', selector: '0x09bde339' },
    { type: 'error', selector: '0x375c24c1' },
    { type: 'error', selector: '0x375c24c1' },
    { type: 'error', selector: '0xa5f54208' },
    { type: 'error', selector: '0xbced929d' },
    { type: 'error', selector: '0x93979285' },
    { type: 'error', selector: '0x7fa8a987' },
    { type: 'error', selector: '0x4f7fb80d' },
    { type: 'error', selector: '0x1f003d0a' },
    { type: 'error', selector: '0x8baa579f' },
    { type: 'error', selector: '0x10fda3e1' },
    { type: 'error', selector: '0xfb5014fc' },
    { type: 'error', selector: '0x8ffff980' },
    { type: 'error', selector: '0x6ab37ce7' },
    { type: 'error', selector: '0xf486bc87' },
    { type: 'error', selector: '0x12d3f5a3' },
    { type: 'error', selector: '0x09bde339' },
    { type: 'error', selector: '0xd5da9a1b' },
    { type: 'error', selector: '0x7fda7279' },
    { type: 'error', selector: '0x4e487b71' },
    { type: 'error', selector: '0x98e9db6e' },
    { type: 'error', selector: '0xee9e0e63' },
    { type: 'error', selector: '0x1a515574' },
    { type: 'error', selector: '0x5a052b32' },
    { type: 'error', selector: '0xa11b63ff' },
    { type: 'error', selector: '0x2165628a' },
    { type: 'error', selector: '0xfed398fc' },
    { type: 'error', selector: '0xf486bc87' },
    { type: 'error', selector: '0x1a515574' },
    { type: 'event', selector: '0x6bacc01d' },
    { type: 'event', selector: '0x4b9f2d36' },
    { type: 'function', selector: '0x06fdde03' },
    { type: 'function', selector: '0x46423aa7' },
    { type: 'function', selector: '0x5b34b966' },
    { type: 'function', selector: '0x79df72bd' },
    { type: 'function', selector: '0x87201b41' },
    { type: 'function', selector: '0x88147732' },
    { type: 'function', selector: '0xa8174404' },
    { type: 'function', selector: '0xa900866b' },
    { type: 'function', selector: '0xb3a34c4c' },
    { type: 'function', selector: '0xe7acab24' },
    { type: 'function', selector: '0xed98a574' },
    { type: 'function', selector: '0xf07ec373' },
    { type: 'function', selector: '0xf2d12b12' },
    { type: 'function', selector: '0xf47b7740' },
    { type: 'function', selector: '0xfb0f3ee1' },
  ])
})
