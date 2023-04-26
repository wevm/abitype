import { assertType, test } from 'vitest'

import type { weth } from '../../test/bytecodes'
import type { ParseBytecodeEvents, ParseBytecodeFunctions } from './bytecode'

declare module './config' {
  export interface Selectors {
    '0xddf252ad': 'Transfer(address,address,uint256)'
    '0x2e1a7d4d': 'withdraw(uint256)'
  }
}

test('Parse Event', () => {
  assertType<ParseBytecodeEvents<typeof weth>[0]>({
    type: 'event',
    name: '0xe1fffcc4',
    inputs: [],
  })

  assertType<ParseBytecodeEvents<typeof weth>[1]>({
    type: 'event',
    name: '0x8c5be1e5',
    inputs: [],
  })

  assertType<ParseBytecodeFunctions<typeof weth>[4]>({
    type: 'function',
    name: 'withdraw',
    inputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
    outputs: [],
  })
})
