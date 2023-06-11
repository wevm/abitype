import { expectTypeOf, test } from 'vitest'

import type { AbiParameter } from '../abi.js'

import type { FormatAbiParameters } from './formatAbiParameters.js'
import { formatAbiParameters } from './formatAbiParameters.js'

test('FormatAbiParameters', () => {
  expectTypeOf<FormatAbiParameters<[]>>().toEqualTypeOf<never>()

  // string
  expectTypeOf<
    FormatAbiParameters<
      [
        {
          readonly type: 'address'
          readonly name: 'from'
        },
      ]
    >
  >().toEqualTypeOf<'address from'>()
  expectTypeOf<
    FormatAbiParameters<
      [
        {
          readonly type: 'address'
          readonly name: 'from'
          readonly indexed: true
        },
      ]
    >
  >().toEqualTypeOf<'address indexed from'>()

  // Array
  expectTypeOf<
    FormatAbiParameters<
      [
        {
          readonly type: 'tuple'
          readonly components: readonly [
            {
              readonly name: 'name'
              readonly type: 'string'
            },
          ]
        },
      ]
    >
  >().toEqualTypeOf<'(string name)'>()

  expectTypeOf<
    FormatAbiParameters<
      [
        {
          readonly type: 'tuple'
          readonly components: readonly [
            {
              readonly type: 'string'
              readonly name: 'bar'
            },
          ]
          readonly name: 'foo'
        },
      ]
    >
  >().toEqualTypeOf<'(string bar) foo'>()
})

test('formatAbiParameter', () => {
  expectTypeOf(
    formatAbiParameters([
      {
        type: 'tuple',
        components: [{ type: 'string' }],
      },
    ]),
  ).toEqualTypeOf<'(string)'>()

  const param: AbiParameter = { type: 'address' }
  expectTypeOf(formatAbiParameters([param])).toEqualTypeOf<string>()
})
