import { expect, test } from 'vitest'

import type { Abi } from '../abi.js'
import { seaportAbi } from '../abis/json.js'
import { formatAbiItem } from './formatAbiItem.js'

test('default', () => {
  const result = formatAbiItem(seaportAbi[1])
  expect(result).toMatchInlineSnapshot(
    '"function cancel((address offerer, address zone, (uint8 itemType, address token, uint256 identifierOrCriteria, uint256 startAmount, uint256 endAmount)[] offer, (uint8 itemType, address token, uint256 identifierOrCriteria, uint256 startAmount, uint256 endAmount, address recipient)[] consideration, uint8 orderType, uint256 startTime, uint256 endTime, bytes32 zoneHash, uint256 salt, bytes32 conduitKey, uint256 counter)[] orders) returns (bool cancelled)"',
  )
})

test.each([
  {
    abiItem: {
      type: 'function',
      name: 'foo',
      inputs: [{ type: 'string' }],
      outputs: [],
      stateMutability: 'nonpayable',
    } as const,
    expected: 'function foo(string)',
  },
  {
    abiItem: {
      type: 'event',
      name: 'Foo',
      inputs: [
        { type: 'address', name: 'from', indexed: true },
        { type: 'address', name: 'to', indexed: true },
        { type: 'uint256', name: 'amount' },
      ],
    } as const,
    expected:
      'event Foo(address indexed from, address indexed to, uint256 amount)',
  },
  {
    abiItem: {
      type: 'constructor',
      stateMutability: 'nonpayable',
      inputs: [{ type: 'string' }],
    } as const,
    expected: 'constructor(string)',
  },
  {
    abiItem: {
      type: 'constructor',
      stateMutability: 'payable',
      inputs: [{ type: 'string' }],
    } as const,
    expected: 'constructor(string) payable',
  },
  {
    abiItem: {
      type: 'fallback',
      stateMutability: 'nonpayable',
    } as const,
    expected: 'fallback() external',
  },
  {
    abiItem: {
      type: 'fallback',
      stateMutability: 'payable',
    } as const,
    expected: 'fallback() external payable',
  },
  {
    abiItem: {
      type: 'receive',
      stateMutability: 'payable',
    } as const,
    expected: 'receive() external payable',
  },
  {
    abiItem: {
      type: 'function',
      name: 'initWormhole',
      inputs: [
        {
          type: 'tuple[]',
          name: 'configs',
          components: [
            {
              type: 'uint256',
              name: 'chainId',
            },
            {
              type: 'uint16',
              name: 'wormholeChainId',
            },
          ],
        },
      ],
      outputs: undefined,
      stateMutability: 'nonpayable',
    } as const,
    expected:
      'function initWormhole((uint256 chainId, uint16 wormholeChainId)[] configs)',
  },
])('formatAbiItem($expected)', ({ abiItem, expected }) => {
  expect(formatAbiItem(abiItem as Abi[number])).toEqual(expected)
})
