import { expectTypeOf, test } from 'vitest'

import type { Abi } from '../abi.js'

import { seaportHumanReadableAbi } from '../test/human-readable.js'
import type { IsAbi } from '../utils.js'
import type { FormatAbi } from './formatAbi.js'
import { formatAbi } from './formatAbi.js'

test('FormatAbi', () => {
  type SeaportAbi = FormatAbi<typeof seaportHumanReadableAbi>
  expectTypeOf<IsAbi<SeaportAbi>>().toEqualTypeOf<true>()

  expectTypeOf<FormatAbi<[]>>().toEqualTypeOf<never>()
  expectTypeOf<
    FormatAbi<['struct Foo { string name; }']>
  >().toEqualTypeOf<never>()

  expectTypeOf<
    FormatAbi<
      readonly [
        {
          readonly name: 'foo'
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly name: 'bar'
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly [
            {
              readonly type: 'tuple'
              readonly components: readonly [
                {
                  readonly name: 'name'
                  readonly type: 'string'
                },
              ]
            },
            {
              readonly type: 'bytes32'
            },
          ]
          readonly outputs: readonly []
        },
      ]
    >
  >().toEqualTypeOf<
    [
      'function foo()',
      'function bar(Foo, bytes32)',
      'struct Foo { string name; }',
    ]
  >()

  expectTypeOf<
    FormatAbi<
      [
        'function balanceOf(address owner) view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint256 amount)',
      ]
    >
  >().toEqualTypeOf<
    readonly [
      {
        readonly name: 'balanceOf'
        readonly type: 'function'
        readonly stateMutability: 'view'
        readonly inputs: readonly [
          {
            readonly name: 'owner'
            readonly type: 'address'
          },
        ]
        readonly outputs: readonly [
          {
            readonly type: 'uint256'
          },
        ]
      },
      {
        readonly name: 'Transfer'
        readonly type: 'event'
        readonly inputs: readonly [
          {
            readonly name: 'from'
            readonly type: 'address'
            readonly indexed: true
          },
          {
            readonly name: 'to'
            readonly type: 'address'
            readonly indexed: true
          },
          {
            readonly name: 'amount'
            readonly type: 'uint256'
          },
        ]
      },
    ]
  >()

  expectTypeOf<FormatAbi<['function foo ()']>>().toEqualTypeOf<never>()
})

test('formatAbi', () => {
  // @ts-expect-error empty array not allowed
  expectTypeOf(formatAbi([])).toEqualTypeOf<never>()
  expectTypeOf(
    formatAbi(['struct Foo { string name; }']),
  ).toEqualTypeOf<never>()

  // Array
  const res2 = formatAbi([
    'function bar(Foo, bytes32)',
    'struct Foo { string name; }',
  ])
  expectTypeOf<typeof res2>().toEqualTypeOf<
    readonly [
      {
        readonly name: 'bar'
        readonly type: 'function'
        readonly stateMutability: 'nonpayable'
        readonly inputs: readonly [
          {
            readonly type: 'tuple'
            readonly components: readonly [
              {
                readonly name: 'name'
                readonly type: 'string'
              },
            ]
          },
          {
            readonly type: 'bytes32'
          },
        ]
        readonly outputs: readonly []
      },
    ]
  >()

  const abi2 = [
    'function foo()',
    'function bar(Foo, bytes32)',
    'struct Foo { string name; }',
  ]
  expectTypeOf(formatAbi(abi2)).toEqualTypeOf<Abi>()

  // @ts-expect-error invalid signature
  expectTypeOf(formatAbi(['function foo ()'])).toEqualTypeOf<never>()

  const param: string[] = abi2
  expectTypeOf(formatAbi(param)).toEqualTypeOf<Abi>()

  const getOrderType = formatAbi(seaportHumanReadableAbi)[10]
  expectTypeOf<typeof getOrderType>().toEqualTypeOf<{
    readonly name: 'getOrderStatus'
    readonly type: 'function'
    readonly stateMutability: 'view'
    readonly inputs: readonly [
      {
        readonly type: 'bytes32'
        readonly name: 'orderHash'
      },
    ]
    readonly outputs: readonly [
      {
        readonly type: 'bool'
        readonly name: 'isValidated'
      },
      {
        readonly type: 'bool'
        readonly name: 'isCancelled'
      },
      {
        readonly type: 'uint256'
        readonly name: 'totalFilled'
      },
      {
        readonly type: 'uint256'
        readonly name: 'totalSize'
      },
    ]
  }>()
})
