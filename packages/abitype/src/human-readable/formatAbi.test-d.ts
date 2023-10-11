import { expectTypeOf, test } from 'vitest'

import type { Abi } from '../abi.js'
import { seaportAbi } from '../abis/json.js'
import type { FormatAbi } from './formatAbi.js'
import { formatAbi } from './formatAbi.js'

test('FormatAbi', () => {
  expectTypeOf<FormatAbi<[]>>().toEqualTypeOf<never>()

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
    readonly ['function foo()', 'function bar((string name), bytes32)']
  >()

  expectTypeOf<
    FormatAbi<
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
    >
  >().toEqualTypeOf<
    readonly [
      'function balanceOf(address owner) view returns (uint256)',
      'event Transfer(address indexed from, address indexed to, uint256 amount)',
    ]
  >()
})

test('formatAbi', () => {
  expectTypeOf(formatAbi([])).toEqualTypeOf<never>()

  // Array
  const res = formatAbi([
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
  expectTypeOf<typeof res>().toEqualTypeOf<
    readonly ['function bar((string name), bytes32)']
  >()

  const abi2 = [
    {
      type: 'function',
      name: 'foo',
      inputs: [],
      outputs: [],
      stateMutability: 'view',
    },
  ]
  expectTypeOf(formatAbi(abi2)).toEqualTypeOf<readonly string[]>()

  const param = abi2 as Abi
  expectTypeOf(formatAbi(param)).toEqualTypeOf<readonly string[]>()

  const getOrderType = formatAbi(seaportAbi)[10]
  expectTypeOf<
    typeof getOrderType
  >().toEqualTypeOf<'function getOrderHash((address offerer, address zone, (uint8 itemType, address token, uint256 identifierOrCriteria, uint256 startAmount, uint256 endAmount)[] offer, (uint8 itemType, address token, uint256 identifierOrCriteria, uint256 startAmount, uint256 endAmount, address recipient)[] consideration, uint8 orderType, uint256 startTime, uint256 endTime, bytes32 zoneHash, uint256 salt, bytes32 conduitKey, uint256 counter) order) view returns (bytes32 orderHash)'>()
})
