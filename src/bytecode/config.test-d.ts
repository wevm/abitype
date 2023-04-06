import { assertType, test } from 'vitest'

import type { weth } from '../test/bytecodes'
import type {
  ParseBytecodeEventSelector,
  ParseBytecodeFunctionSelector,
} from './bytecode'
import type { FindEventSelectors, FindFunctionSelectors } from './selectors'

declare module './config' {
  export interface Selectors {
    '0xddf252ad': 'Transfer(address,address,uint256)'
    '0x2e1a7d4d': 'withdraw(uint256)'
  }
}

test('Parse Event', () => {
  assertType<
    ParseBytecodeEventSelector<FindEventSelectors<typeof weth>[0]['selector']>
  >({
    type: 'event',
    name: '0xe1fffcc4',
    inputs: [],
  })

  assertType<
    ParseBytecodeEventSelector<FindEventSelectors<typeof weth>[1]['selector']>
  >({
    type: 'event',
    name: '0x8c5be1e5',
    inputs: [],
  })

  assertType<
    ParseBytecodeFunctionSelector<
      FindFunctionSelectors<typeof weth>[4]['selector']
    >
  >({
    type: 'function',
    name: 'withdraw',
    inputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
    outputs: [],
  })
})
