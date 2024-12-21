import { expectTypeOf, test } from 'vitest'

import type { Abi } from '../abi.js'
import type { ParseAbiItem } from './parseAbiItem.js'
import { parseAbiItem } from './parseAbiItem.js'

test('ParseAbiItem', () => {
  expectTypeOf<ParseAbiItem<''>>().toEqualTypeOf<never>()
  expectTypeOf<ParseAbiItem<['']>>().toEqualTypeOf<never>()
  expectTypeOf<
    ParseAbiItem<['struct Foo { string name; }']>
  >().toEqualTypeOf<never>()

  // string
  expectTypeOf<ParseAbiItem<'function foo()'>>().toEqualTypeOf<{
    readonly name: 'foo'
    readonly type: 'function'
    readonly stateMutability: 'nonpayable'
    readonly inputs: readonly []
    readonly outputs: readonly []
  }>()

  // Array
  expectTypeOf<
    ParseAbiItem<['function bar(Foo, bytes32)', 'struct Foo { string name; }']>
  >().toEqualTypeOf<{
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
  }>()

  expectTypeOf<
    ParseAbiItem<
      [
        'event Transfer(address indexed from, address indexed to, uint256 amount)',
      ]
    >
  >().toEqualTypeOf<{
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
  }>()

  const abiItem = ['function bar(Foo, bytes32)', 'struct Foo { string name; }']
  expectTypeOf<ParseAbiItem<typeof abiItem>>().toEqualTypeOf<Abi[number]>()

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
        readonly components: readonly [
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
  expectTypeOf<typeof res2>().toEqualTypeOf<{
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
  }>()

  const abi2 = [
    'function foo()',
    'function bar(Foo, bytes32)',
    'struct Foo { string name; }',
  ]
  expectTypeOf(parseAbiItem(abi2)).toEqualTypeOf<Abi[number]>()

  // @ts-expect-error invalid signature
  expectTypeOf(parseAbiItem(['function foo ()'])).toEqualTypeOf<never>()

  const signature: string = 'function foo()'
  expectTypeOf(parseAbiItem(signature)).toEqualTypeOf<Abi[number]>()

  // fallback
  expectTypeOf(parseAbiItem('fallback() external')).toEqualTypeOf<{
    readonly type: 'fallback'
    readonly stateMutability: 'nonpayable'
  }>()
  expectTypeOf(parseAbiItem('fallback() external payable')).toEqualTypeOf<{
    readonly type: 'fallback'
    readonly stateMutability: 'payable'
  }>()

  // receive
  expectTypeOf(parseAbiItem('receive() external payable')).toEqualTypeOf<{
    readonly type: 'receive'
    readonly stateMutability: 'payable'
  }>()
})

test('nested tuples', () => {
  const formattedAbiItem =
    'function stepChanges((uint256 characterID, uint64 newPosition, uint24 xp, uint24 epoch, uint8 hp, (int32 x, int32 y, uint8 hp, uint8 kind)[5] monsters, (uint8 monsterIndexPlus1, uint8 attackCardsUsed1, uint8 attackCardsUsed2, uint8 defenseCardsUsed1, uint8 defenseCardsUsed2) battle) stateChanges, uint256 action, bool revetOnInvalidMoves) pure returns ((uint256 characterID, uint64 newPosition, uint24 xp, uint24 epoch, uint8 hp, (int32 x, int32 y, uint8 hp, uint8 kind)[5] monsters, (uint8 monsterIndexPlus1, uint8 attackCardsUsed1, uint8 attackCardsUsed2, uint8 defenseCardsUsed1, uint8 defenseCardsUsed2) battle))'

  const abiItem = parseAbiItem(formattedAbiItem)
  expectTypeOf(abiItem.stateMutability).toEqualTypeOf<'pure'>()
  expectTypeOf(abiItem.inputs.length).toEqualTypeOf<3>()
})
