import { assertType, test } from 'vitest'

import type { constructorArgs, seaport, uniswap, weth } from '../test/bytecodes'
import type {
  ParseBytecode,
  ParseBytecodeConstructor,
  ParseBytecodeErrorSelector,
  ParseBytecodeEventSelector,
  ParseBytecodeFunctionSelector,
} from './bytecode'
import type {
  FindErrorSelectors,
  FindEventSelectors,
  FindFunctionSelectors,
} from './selectors'

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
    ParseBytecodeEventSelector<FindEventSelectors<typeof weth>[2]['selector']>
  >({
    type: 'event',
    name: 'Transfer',
    inputs: [{ type: 'address' }, { type: 'address' }, { type: 'uint256' }],
  })
})

test('Parse Error', () => {
  assertType<
    ParseBytecodeErrorSelector<
      FindErrorSelectors<typeof seaport>[0]['selector']
    >
  >({
    type: 'error',
    name: '0x6ab37ce7',
    inputs: [],
  })

  assertType<
    ParseBytecodeErrorSelector<
      FindErrorSelectors<typeof seaport>[5]['selector']
    >
  >({
    type: 'error',
    name: '0x69f95827',
    inputs: [],
  })

  assertType<
    ParseBytecodeErrorSelector<
      FindErrorSelectors<typeof seaport>[10]['selector']
    >
  >({
    type: 'error',
    name: '0x1cf99b26',
    inputs: [],
  })
})

test('Parse Bytecode', () => {
  assertType<ParseBytecode<typeof weth>>([
    { type: 'constructor', stateMutability: 'nonpayable', inputs: [] },
    { type: 'event', name: '0xe1fffcc4', inputs: [] },
    { type: 'event', name: '0x8c5be1e5', inputs: [] },
    {
      type: 'event',
      name: 'Transfer',
      inputs: [{ type: 'address' }, { type: 'address' }, { type: 'uint256' }],
    },
    { type: 'event', name: '0x7fcf532c', inputs: [] },
    {
      type: 'function',
      name: '0x06fdde03',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: '0x095ea7b3',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: '0x18160ddd',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: '0x23b872dd',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: 'withdraw',
      stateMutability: 'nonpayable',
      inputs: [{ type: 'uint256' }],
      outputs: [],
    },
    {
      type: 'function',
      name: '0x313ce567',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: '0x70a08231',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: '0x95d89b41',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: '0xa9059cbb',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: '0xd0e30db0',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      name: '0xdd62ed3e',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
  ])

  assertType<ParseBytecode<typeof uniswap>>([
    {
      type: 'constructor',
      stateMutability: 'nonpayable',
      inputs: [{ type: 'address' }, { type: 'address' }],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xe8e33700',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xf305d719',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xfb3bdb41',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xc45a0155',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xd06ca61f',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xded9382a',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xaf2979eb',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xb6f9de95',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xbaa2abde',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x8803dbee',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xad5c4648',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xad615dec',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x791ac947',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x7ff36ab5',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x85f8c259',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x4a25d94a',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x5b0d5984',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x5c11d795',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x1f00ca74',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x2195995c',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x38ed1739',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x02751cec',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x054d50d4',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x18cbafe5',
      inputs: [],
      outputs: [],
    },
  ])

  assertType<ParseBytecode<typeof seaport>>([
    {
      type: 'constructor',
      stateMutability: 'nonpayable',
      inputs: [{ type: 'address' }],
    },
    { type: 'error', name: '0x6ab37ce7', inputs: [] },
    { type: 'error', name: '0x39f3e3fd', inputs: [] },
    { type: 'error', name: '0x466aa616', inputs: [] },
    { type: 'error', name: '0x21ccfeb7', inputs: [] },
    { type: 'error', name: '0x8ffff980', inputs: [] },
    { type: 'error', name: '0x69f95827', inputs: [] },
    { type: 'error', name: '0xa61be9f0', inputs: [] },
    { type: 'error', name: '0xbc806b96', inputs: [] },
    { type: 'error', name: '0x91b3e514', inputs: [] },
    { type: 'error', name: '0xd13d53d4', inputs: [] },
    { type: 'error', name: '0x1cf99b26', inputs: [] },
    { type: 'error', name: '0xc63cf089', inputs: [] },
    { type: 'error', name: '0x133c37c6', inputs: [] },
    { type: 'error', name: '0xa8930e9a', inputs: [] },
    { type: 'error', name: '0xd6929332', inputs: [] },
    { type: 'error', name: '0x94eb6af6', inputs: [] },
    { type: 'error', name: '0x09bde339', inputs: [] },
    { type: 'error', name: '0x375c24c1', inputs: [] },
    { type: 'error', name: '0x375c24c1', inputs: [] },
    { type: 'error', name: '0xa5f54208', inputs: [] },
    { type: 'error', name: '0xbced929d', inputs: [] },
    { type: 'error', name: '0x93979285', inputs: [] },
    { type: 'error', name: '0x7fa8a987', inputs: [] },
    { type: 'error', name: '0x4f7fb80d', inputs: [] },
    { type: 'error', name: '0x1f003d0a', inputs: [] },
    { type: 'error', name: '0x8baa579f', inputs: [] },
    { type: 'error', name: '0x10fda3e1', inputs: [] },
    { type: 'error', name: '0xfb5014fc', inputs: [] },
    { type: 'error', name: '0x8ffff980', inputs: [] },
    { type: 'error', name: '0x6ab37ce7', inputs: [] },
    { type: 'error', name: '0xf486bc87', inputs: [] },
    { type: 'error', name: '0x12d3f5a3', inputs: [] },
    { type: 'error', name: '0x09bde339', inputs: [] },
    { type: 'error', name: '0xd5da9a1b', inputs: [] },
    { type: 'error', name: '0x7fda7279', inputs: [] },
    { type: 'error', name: '0x4e487b71', inputs: [] },
    { type: 'error', name: '0x98e9db6e', inputs: [] },
    { type: 'error', name: '0xee9e0e63', inputs: [] },
    { type: 'error', name: '0x1a515574', inputs: [] },
    { type: 'error', name: '0x5a052b32', inputs: [] },
    { type: 'error', name: '0xa11b63ff', inputs: [] },
    { type: 'error', name: '0x2165628a', inputs: [] },
    { type: 'error', name: '0xfed398fc', inputs: [] },
    { type: 'error', name: '0xf486bc87', inputs: [] },
    { type: 'error', name: '0x1a515574', inputs: [] },
    { type: 'event', name: '0x6bacc01d', inputs: [] },
    { type: 'event', name: '0x4b9f2d36', inputs: [] },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x06fdde03',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x46423aa7',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x5b34b966',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x79df72bd',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x87201b41',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0x88147732',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xa8174404',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xa900866b',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xb3a34c4c',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xe7acab24',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xed98a574',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xf07ec373',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xf2d12b12',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xf47b7740',
      inputs: [],
      outputs: [],
    },
    {
      type: 'function',
      stateMutability: 'nonpayable',
      name: '0xfb0f3ee1',
      inputs: [],
      outputs: [],
    },
  ])
})
