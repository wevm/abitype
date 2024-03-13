import { expectTypeOf, test } from 'vitest'

import type { AbiParameter } from '../abi.js'
import type { ParseAbiParameters } from './parseAbiParameters.js'
import { parseAbiParameters } from './parseAbiParameters.js'

test('ParseAbiParameters', () => {
  expectTypeOf<ParseAbiParameters<''>>().toEqualTypeOf<never>()
  expectTypeOf<ParseAbiParameters<[]>>().toEqualTypeOf<never>()
  expectTypeOf<
    ParseAbiParameters<['struct Foo { string name; }']>
  >().toEqualTypeOf<never>()

  // string
  expectTypeOf<
    ParseAbiParameters<'address from, address to, uint256 amount'>
  >().toEqualTypeOf<
    readonly [
      {
        readonly type: 'address'
        readonly name: 'from'
      },
      {
        readonly type: 'address'
        readonly name: 'to'
      },
      {
        readonly type: 'uint256'
        readonly name: 'amount'
      },
    ]
  >()
  expectTypeOf<
    ParseAbiParameters<'address indexed from, address indexed to, uint256 indexed amount'>
  >().toEqualTypeOf<
    readonly [
      {
        readonly type: 'address'
        readonly name: 'from'
        readonly indexed: true
      },
      {
        readonly type: 'address'
        readonly name: 'to'
        readonly indexed: true
      },
      {
        readonly type: 'uint256'
        readonly name: 'amount'
        readonly indexed: true
      },
    ]
  >()
  expectTypeOf<
    ParseAbiParameters<'address calldata foo, address memory bar, uint256 storage baz'>
  >().toEqualTypeOf<
    readonly [
      {
        readonly type: 'address'
        readonly name: 'foo'
      },
      {
        readonly type: 'address'
        readonly name: 'bar'
      },
      {
        readonly type: 'uint256'
        readonly name: 'baz'
      },
    ]
  >()

  // Array
  expectTypeOf<
    ParseAbiParameters<['Foo, bytes32', 'struct Foo { string name; }']>
  >().toEqualTypeOf<
    readonly [
      {
        readonly type: 'tuple'
        readonly components: readonly [
          {
            readonly name: 'name'
            readonly type: 'string'
          },
        ]
      },
      { readonly type: 'bytes32' },
    ]
  >()
})

test('parseAbiParameters', () => {
  // @ts-expect-error empty array not allowed
  expectTypeOf(parseAbiParameters([])).toEqualTypeOf<never>()
  expectTypeOf(
    parseAbiParameters(['struct Foo { string name; }']),
  ).toEqualTypeOf<never>()

  expectTypeOf(parseAbiParameters('(string)')).toEqualTypeOf<
    readonly [
      {
        readonly type: 'tuple'
        readonly components: readonly [{ readonly type: 'string' }]
      },
    ]
  >()

  const param: string = 'address, string'
  expectTypeOf(parseAbiParameters(param)).toEqualTypeOf<
    readonly AbiParameter[]
  >()

  expectTypeOf(parseAbiParameters(['(uint256 a),(uint256 b)'])).toEqualTypeOf<
    readonly [
      {
        readonly type: 'tuple'
        readonly components: readonly [
          {
            readonly type: 'uint256'
            readonly name: 'a'
          },
        ]
      },
      {
        readonly type: 'tuple'
        readonly components: readonly [
          {
            readonly type: 'uint256'
            readonly name: 'b'
          },
        ]
      },
    ]
  >()

  expectTypeOf(
    parseAbiParameters(['(uint256 a)', '(uint256 b)']),
  ).toEqualTypeOf<
    readonly [
      {
        readonly type: 'tuple'
        readonly components: readonly [
          {
            readonly type: 'uint256'
            readonly name: 'a'
          },
        ]
      },
      {
        readonly type: 'tuple'
        readonly components: readonly [
          {
            readonly type: 'uint256'
            readonly name: 'b'
          },
        ]
      },
    ]
  >()
})
