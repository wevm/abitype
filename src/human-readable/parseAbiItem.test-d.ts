import { assertType, expectTypeOf, test } from 'vitest'

import type { Abi } from '../abi'
import type { ParseAbiItem } from './parseAbiItem'
import { parseAbiItem } from './parseAbiItem'

test('ParseAbiItem', () => {
  assertType<ParseAbiItem<''>>('Error: Signature "" is invalid')
  assertType<ParseAbiItem<[]>>(undefined)
  assertType<ParseAbiItem<['struct Foo { string name; }']>>(undefined)

  // string
  assertType<ParseAbiItem<'function foo()'>>({
    name: 'foo',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  })

  // Array
  assertType<
    ParseAbiItem<['function bar(Foo, bytes32)', 'struct Foo { string name; }']>
  >({
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
  })

  assertType<
    ParseAbiItem<
      [
        'event Transfer(address indexed from, address indexed to, uint256 amount)',
      ]
    >
  >({
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
  })

  assertType<ParseAbiItem<['function foo ()']>>(
    'Error: Signature "function foo ()" is invalid at position 0',
  )
})

test('parseAbiItem', () => {
  expectTypeOf(parseAbiItem([])).toEqualTypeOf<undefined>()
  const res = parseAbiItem(['struct Foo { string name; }'])
  assertType<typeof res>(undefined)

  // string
  expectTypeOf(parseAbiItem('function foo()')).toEqualTypeOf<{
    name: 'foo'
    type: 'function'
    stateMutability: 'nonpayable'
    inputs: []
    outputs: []
  }>()
  expectTypeOf(parseAbiItem('function foo((string), address)')).toEqualTypeOf<{
    name: 'foo'
    type: 'function'
    stateMutability: 'nonpayable'
    inputs: [
      {
        type: 'tuple'
        components: [
          {
            type: 'string'
          },
        ]
      },
      {
        type: 'address'
      },
    ]
    outputs: []
  }>()

  expectTypeOf(
    // @ts-expect-error invalid signature
    parseAbiItem(''),
  ).toEqualTypeOf<'Error: Signature "" is invalid'>()

  // Array
  const res2 = parseAbiItem([
    'function bar(Foo, bytes32)',
    'struct Foo { string name; }',
  ])
  assertType<typeof res2>({
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
  })

  const abi2 = [
    'function foo()',
    'function bar(Foo, bytes32)',
    'struct Foo { string name; }',
  ]
  expectTypeOf(parseAbiItem(abi2)).toEqualTypeOf<Abi[number]>()

  // @ts-expect-error invalid signature
  const res3 = parseAbiItem(['function foo ()'])
  assertType<typeof res3>(
    'Error: Signature "function foo ()" is invalid at position 0',
  )
})
