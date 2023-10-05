import { expectTypeOf, test } from 'vitest'

import type {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiFallback,
  AbiFunction,
  AbiReceive,
} from '../abi.js'
import type { FormatAbiItem } from './formatAbiItem.js'
import { formatAbiItem } from './formatAbiItem.js'

test('FormatAbiItem', () => {
  expectTypeOf<FormatAbiItem<Abi[number]>>().toEqualTypeOf<string>()
  expectTypeOf<FormatAbiItem<AbiFunction>>().toEqualTypeOf<string>()
  expectTypeOf<FormatAbiItem<AbiEvent>>().toEqualTypeOf<string>()
  expectTypeOf<FormatAbiItem<AbiError>>().toEqualTypeOf<string>()
  expectTypeOf<FormatAbiItem<AbiConstructor>>().toEqualTypeOf<string>()
  expectTypeOf<FormatAbiItem<AbiFallback>>().toEqualTypeOf<string>()
  expectTypeOf<FormatAbiItem<AbiReceive>>().toEqualTypeOf<string>()

  expectTypeOf<
    FormatAbiItem<{
      readonly name: 'foo'
      readonly type: 'function'
      readonly stateMutability: 'nonpayable'
      readonly inputs: readonly []
      readonly outputs: readonly []
    }>
  >().toEqualTypeOf<'function foo()'>()

  expectTypeOf<
    FormatAbiItem<{
      readonly name: 'address'
      readonly type: 'function'
      readonly stateMutability: 'nonpayable'
      readonly inputs: readonly []
      readonly outputs: readonly []
    }>
  >().toEqualTypeOf<'function [Error: "address" is a protected Solidity keyword.]()'>()

  expectTypeOf<
    FormatAbiItem<{
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
    }>
  >().toEqualTypeOf<'event Transfer(address indexed from, address indexed to, uint256 amount)'>()
})

test('formatAbiItem', () => {
  expectTypeOf(
    formatAbiItem({
      name: 'foo',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [],
      outputs: [],
    }),
  ).toEqualTypeOf<'function foo()'>()
  expectTypeOf(
    formatAbiItem({
      name: 'foo',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        {
          type: 'tuple',
          components: [
            {
              type: 'string',
            },
          ],
        },
        {
          type: 'address',
        },
      ],
      outputs: [],
    }),
  ).toEqualTypeOf<'function foo((string), address)'>()

  const abiItem: Abi[number] = {
    type: 'function',
    name: 'foo',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  }
  expectTypeOf(formatAbiItem(abiItem)).toEqualTypeOf<string>()
})
