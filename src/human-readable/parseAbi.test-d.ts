import { assertType, test } from 'vitest'

import type { ParseAbi } from './parseAbi'

test('ParseAbi', () => {
  assertType<ParseAbi<[]>>([])
  assertType<ParseAbi<['struct Foo { string name; }']>>([])

  assertType<
    ParseAbi<
      [
        'function foo()',
        'function bar(Foo, bytes32)',
        'struct Foo { string name; }',
      ]
    >
  >([
    {
      name: 'foo',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
    {
      name: 'bar',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        {
          type: 'tuple',
          components: [
            {
              name: 'name',
              type: 'string',
            },
          ],
        },
        {
          type: 'bytes32',
        },
      ],
      outputs: [],
    },
  ])

  assertType<
    ParseAbi<
      [
        'function balanceOf(address owner) view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint256 amount)',
      ]
    >
  >([
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [
        {
          name: 'owner',
          type: 'address',
        },
      ],
      outputs: [
        {
          type: 'uint256',
        },
      ],
    },
    {
      name: 'Transfer',
      type: 'event',
      inputs: [
        {
          name: 'from',
          type: 'address',
          indexed: true,
        },
        {
          name: 'to',
          type: 'address',
          indexed: true,
        },
        {
          name: 'amount',
          type: 'uint256',
        },
      ],
    },
  ])

  assertType<ParseAbi<['function foo ()']>>([
    'Error: Signature "function foo ()" is invalid at position 0',
  ])
})
