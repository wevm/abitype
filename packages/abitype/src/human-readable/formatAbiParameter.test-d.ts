import { expectTypeOf, test } from 'vitest'

import type { AbiParameter } from '../abi.js'
import type { FormatAbiParameter } from './formatAbiParameter.js'
import { formatAbiParameter } from './formatAbiParameter.js'

test('FormatAbiParameter', () => {
  // string
  expectTypeOf<
    FormatAbiParameter<{
      readonly type: 'address'
      readonly name: 'from'
    }>
  >().toEqualTypeOf<'address from'>()
  expectTypeOf<
    FormatAbiParameter<{
      readonly type: 'address'
      readonly name: 'from'
      readonly indexed: true
    }>
  >().toEqualTypeOf<'address indexed from'>()
  expectTypeOf<
    FormatAbiParameter<{
      readonly type: 'address'
      readonly name: ''
    }>
  >().toEqualTypeOf<'address'>()

  expectTypeOf<
    FormatAbiParameter<{
      type: 'address'
      name: 'address'
    }>
  >().toEqualTypeOf<'address [Error: "address" is a protected Solidity keyword.]'>()

  expectTypeOf<
    FormatAbiParameter<{
      type: 'address'
      name: '123'
    }>
  >().toEqualTypeOf<'address [Error: Identifier "123" cannot be a number string.]'>()

  // Array
  expectTypeOf<
    FormatAbiParameter<{
      readonly type: 'tuple'
      readonly components: readonly [
        {
          readonly name: 'name'
          readonly type: 'string'
        },
      ]
    }>
  >().toEqualTypeOf<'(string name)'>()

  expectTypeOf<
    FormatAbiParameter<{
      readonly type: 'tuple'
      readonly components: readonly [
        {
          readonly type: 'string'
          readonly name: 'bar'
        },
      ]
      readonly name: 'foo'
    }>
  >().toEqualTypeOf<'(string bar) foo'>()

  expectTypeOf<
    FormatAbiParameter<{
      readonly components: [
        {
          readonly components: [
            {
              readonly type: 'string'
              readonly name: 'foo'
            },
          ]
          readonly type: 'tuple'
        },
      ]
      readonly type: 'tuple'
    }>
  >().toEqualTypeOf<'((string foo))'>()

  expectTypeOf<
    FormatAbiParameter<{
      readonly components: [
        {
          readonly components: [
            {
              readonly components: [
                {
                  readonly components: [
                    {
                      readonly type: 'string'
                    },
                  ]
                  readonly type: 'tuple'
                },
              ]
              readonly type: 'tuple'
            },
          ]
          readonly type: 'tuple'
        },
      ]
      readonly type: 'tuple'
    }>
  >().toEqualTypeOf<'((((string))))'>()
})

test('formatAbiParameter', () => {
  expectTypeOf(
    formatAbiParameter({
      type: 'tuple',
      components: [{ type: 'string' }],
    }),
  ).toEqualTypeOf<'(string)'>()

  const param = { type: 'address' }
  const param2: AbiParameter = param
  expectTypeOf(formatAbiParameter(param)).toEqualTypeOf<string>()
  expectTypeOf(formatAbiParameter(param2)).toEqualTypeOf<string>()
})
