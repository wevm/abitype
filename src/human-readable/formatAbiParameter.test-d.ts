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
