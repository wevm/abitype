import { assertType, test } from 'vitest'

import type { seaport, uniswap, weth } from '../test/bytecodes'
import type { InferConstructorArguments } from './bytecode'
import type { FindConstructorArgs } from './selectors'
import type { SplitByChunks } from './utils'

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
