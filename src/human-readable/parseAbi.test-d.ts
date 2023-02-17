import { assertType, expectTypeOf, test } from 'vitest'

import type { ParseAbi } from './parseAbi'
import { parseAbi } from './parseAbi'

const abi = [
  'function foo()',
  'function bar(Foo, bytes32)',
  'struct Foo { string name; }',
] as const

test('ParseAbi', () => {
  assertType<ParseAbi<typeof abi[0]>>([
    {
      name: 'foo',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    },
  ])
  assertType<ParseAbi<typeof abi>>([
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
})

test('parseAbi', () => {
  expectTypeOf(parseAbi(abi[0])).toEqualTypeOf<
    readonly [
      {
        name: 'foo'
        type: 'function'
        stateMutability: 'nonpayable'
        inputs: []
        outputs: []
      },
    ]
  >()
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

  expectTypeOf(
    parseAbi('function foo ()'),
  ).toEqualTypeOf<'Error: Signature "function foo ()" is invalid'>()

  const data = parseAbi([
    'function foo()',
    'function bar (Foo, bytes32)',
    'struct Foo { string name; }',
  ])
  expectTypeOf(data).toEqualTypeOf<
    readonly [
      'Error: Signature "function bar (Foo, bytes32)" is invalid at position 1',
    ]
  >()
})
