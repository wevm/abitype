import { assertType, test } from 'vitest'

import type { constructorArgs, weth } from '../test/bytecodes'
import type {
  ParseBytecodeConstructor,
  ParseBytecodeEventSelector,
  ParseBytecodeFunctionSelector,
} from './bytecode'
import type { FindEventSelectors, FindFunctionSelectors } from './selectors'

test('Parse Constructor', () => {
  assertType<ParseBytecodeConstructor<typeof constructorArgs>>({
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'address' }, { type: 'address' }],
  })
})

test('Parse Function', () => {
  assertType<
    ParseBytecodeFunctionSelector<
      FindFunctionSelectors<typeof weth>[0]['selector']
    >
  >({
    type: 'function',
    name: '0x06fdde03',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  })

  assertType<
    ParseBytecodeFunctionSelector<
      FindFunctionSelectors<typeof weth>[1]['selector']
    >
  >({
    type: 'function',
    name: '0x095ea7b3',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  })

  assertType<
    ParseBytecodeFunctionSelector<
      FindFunctionSelectors<typeof weth>[2]['selector']
    >
  >({
    type: 'function',
    name: '0x18160ddd',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  })

  assertType<
    ParseBytecodeFunctionSelector<
      FindFunctionSelectors<typeof weth>[10]['selector']
    >
  >({
    type: 'function',
    name: '0xdd62ed3e',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  })
})

test('Parse Function', () => {
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
    name: 'Transfer',
    inputs: [{ type: 'address' }, { type: 'address' }, { type: 'uint256' }],
  })

  assertType<
    ParseBytecodeEventSelector<FindEventSelectors<typeof weth>[2]['selector']>
  >({
    type: 'event',
    name: '0x7fcf532c',
    inputs: [],
  })
})
