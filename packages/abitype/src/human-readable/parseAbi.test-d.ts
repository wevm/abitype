import { expectTypeOf, test } from 'vitest'

import type { Abi } from '../abi.js'

import { seaportHumanReadableAbi } from '../abis/human-readable.js'
import type { IsAbi } from '../utils.js'
import type { ParseAbi } from './parseAbi.js'
import { parseAbi } from './parseAbi.js'

test('ParseAbi', () => {
  type SeaportAbi = ParseAbi<typeof seaportHumanReadableAbi>
  expectTypeOf<IsAbi<SeaportAbi>>().toEqualTypeOf<true>()

  expectTypeOf<ParseAbi<[]>>().toEqualTypeOf<never>()
  expectTypeOf<
    ParseAbi<['struct Foo { string name; }']>
  >().toEqualTypeOf<never>()

  expectTypeOf<
    ParseAbi<
      [
        'function foo()',
        'function bar(Foo, bytes32)',
        'struct Foo { string name; }',
      ]
    >
  >().toEqualTypeOf<
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
  >()

  expectTypeOf<
    ParseAbi<
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

  expectTypeOf<ParseAbi<['function foo ()']>>().toEqualTypeOf<never>()
})

test('parseAbi', () => {
  // @ts-expect-error empty array not allowed
  expectTypeOf(parseAbi([])).toEqualTypeOf<never>()
  expectTypeOf(parseAbi(['struct Foo { string name; }'])).toEqualTypeOf<never>()

  // Array
  const res2 = parseAbi([
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
  expectTypeOf(parseAbi(abi2)).toEqualTypeOf<Abi>()

  // @ts-expect-error invalid signature
  expectTypeOf(parseAbi(['function foo ()'])).toEqualTypeOf<never>()

  const param: string[] = abi2
  expectTypeOf(parseAbi(param)).toEqualTypeOf<Abi>()

  const getOrderType = parseAbi(seaportHumanReadableAbi)[10]
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
