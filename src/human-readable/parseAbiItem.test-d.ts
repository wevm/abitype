import { assertType, expectTypeOf, test } from 'vitest'

import type { Abi } from '../abi'
import type { ParseAbiItem } from './parseAbiItem'
import { parseAbiItem } from './parseAbiItem'

test('ParseAbiItem', () => {
  expectTypeOf<ParseAbiItem<''>>().toEqualTypeOf<never>()
  expectTypeOf<ParseAbiItem<['']>>().toEqualTypeOf<never>()
  expectTypeOf<
    ParseAbiItem<['struct Foo { string name; }']>
  >().toEqualTypeOf<never>()

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

  expectTypeOf<ParseAbiItem<['function foo ()']>>().toEqualTypeOf<never>()
})

test('parseAbiItem', () => {
  // @ts-expect-error empty array not allowed
  expectTypeOf(parseAbiItem([])).toEqualTypeOf<never>()
  expectTypeOf(
    parseAbiItem(['struct Foo { string name; }']),
  ).toEqualTypeOf<never>()

  // string
  expectTypeOf(parseAbiItem('function foo()')).toEqualTypeOf<{
    readonly name: 'foo'
    readonly type: 'function'
    readonly stateMutability: 'nonpayable'
    readonly inputs: readonly []
    readonly outputs: readonly []
  }>()
  expectTypeOf(parseAbiItem('function foo((string), address)')).toEqualTypeOf<{
    readonly name: 'foo'
    readonly type: 'function'
    readonly stateMutability: 'nonpayable'
    readonly inputs: readonly [
      {
        readonly type: 'tuple'
        readonly components: [
          {
            readonly type: 'string'
          },
        ]
      },
      {
        readonly type: 'address'
      },
    ]
    readonly outputs: readonly []
  }>()

  expectTypeOf(
    // @ts-expect-error invalid signature
    parseAbiItem(''),
  ).toEqualTypeOf<never>()

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
  expectTypeOf(parseAbiItem(['function foo ()'])).toEqualTypeOf<never>()
})
