import { expect, test } from 'vitest'
import { formatAbiItem } from './formatAbiItem.js'
import { parseAbiItem } from './parseAbiItem.js'

test.each([
  {
    type: 'fallback',
    stateMutability: 'payable',
  } as const,
  {
    type: 'fallback',
    stateMutability: 'nonpayable',
  } as const,
  {
    type: 'receive',
    stateMutability: 'payable',
  } as const,
  {
    type: 'function',
    name: 'foo',
    inputs: [{ type: 'string' }],
    outputs: [],
    stateMutability: 'nonpayable',
  } as const,
  {
    type: 'event',
    name: 'Foo',
    inputs: [
      { type: 'address', name: 'from', indexed: true },
      { type: 'address', name: 'to', indexed: true },
      { type: 'uint256', name: 'amount' },
    ],
  } as const,
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string' }],
  } as const,
  {
    type: 'constructor',
    stateMutability: 'payable',
    inputs: [{ type: 'string' }],
  } as const,
  {
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
    outputs: [],
    stateMutability: 'nonpayable',
  } as const,
])('use of parseAbiItem - formatAbiItem should be reversible', (abiItem) => {
  expect(parseAbiItem(formatAbiItem(abiItem))).toEqual(abiItem)
})
