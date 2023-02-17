import { assertType, expectTypeOf, test } from 'vitest'

import type { Abi } from '../abi'
import type { ParseAbi } from './parseAbi'
import { parseAbi } from './parseAbi'

// TODO: Test massive ABI

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
})

test('parseAbi', () => {
  expectTypeOf(parseAbi([])).toEqualTypeOf<readonly []>()
  expectTypeOf(parseAbi(['struct Foo { string name; }'])).toEqualTypeOf<
    readonly []
  >()

  expectTypeOf(
    parseAbi([
      'function foo()',
      'function bar(Foo, bytes32)',
      'struct Foo { string name; }',
    ]),
  ).toEqualTypeOf<
    readonly [
      {
        name: 'foo'
        type: 'function'
        stateMutability: 'nonpayable'
        inputs: []
        outputs: []
      },
      {
        name: 'bar'
        type: 'function'
        stateMutability: 'nonpayable'
        inputs: [
          {
            type: 'tuple'
            components: [
              {
                name: 'name'
                type: 'string'
              },
            ]
          },
          {
            type: 'bytes32'
          },
        ]
        outputs: []
      },
    ]
  >()

  const abi = [
    'function foo()',
    'function bar(Foo, bytes32)',
    'struct Foo { string name; }',
  ] as const
  expectTypeOf(parseAbi(abi)).toEqualTypeOf<
    readonly [
      {
        name: 'foo'
        type: 'function'
        stateMutability: 'nonpayable'
        inputs: []
        outputs: []
      },
      {
        name: 'bar'
        type: 'function'
        stateMutability: 'nonpayable'
        inputs: [
          {
            type: 'tuple'
            components: [
              {
                name: 'name'
                type: 'string'
              },
            ]
          },
          {
            type: 'bytes32'
          },
        ]
        outputs: []
      },
    ]
  >()

  const abi2 = [
    'function foo()',
    'function bar(Foo, bytes32)',
    'struct Foo { string name; }',
  ]
  expectTypeOf(parseAbi(abi2)).toEqualTypeOf<Abi>()
})
