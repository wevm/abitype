import { expectTypeOf, test } from 'vitest'

import type { AbiParameter } from '../abi'

import type { ParseAbiParameter } from './parseAbiParameter'
import { parseAbiParameter } from './parseAbiParameter'

test('ParseAbiParameter', () => {
  expectTypeOf<ParseAbiParameter<''>>().toEqualTypeOf<never>()
  expectTypeOf<ParseAbiParameter<[]>>().toEqualTypeOf<never>()
  expectTypeOf<
    ParseAbiParameter<['struct Foo { string name; }']>
  >().toEqualTypeOf<never>()

  // string
  expectTypeOf<ParseAbiParameter<'address from'>>().toEqualTypeOf<{
    readonly type: 'address'
    readonly name: 'from'
  }>()
  expectTypeOf<ParseAbiParameter<'address indexed from'>>().toEqualTypeOf<{
    readonly type: 'address'
    readonly name: 'from'
    readonly indexed: true
  }>()
  expectTypeOf<ParseAbiParameter<'address calldata foo'>>().toEqualTypeOf<{
    readonly type: 'address'
    readonly name: 'foo'
  }>()

  // Array
  expectTypeOf<
    ParseAbiParameter<['Foo', 'struct Foo { string name; }']>
  >().toEqualTypeOf<{
    readonly type: 'tuple'
    readonly components: readonly [
      {
        readonly name: 'name'
        readonly type: 'string'
      },
    ]
  }>()

  expectTypeOf<ParseAbiParameter<'(string bar) foo'>>().toEqualTypeOf<{
    readonly type: 'tuple'
    readonly components: readonly [
      {
        readonly type: 'string'
        readonly name: 'bar'
      },
    ]
    readonly name: 'foo'
  }>()
})

test('parseAbiParameter', () => {
  // @ts-expect-error empty array not allowed
  expectTypeOf(parseAbiParameter([])).toEqualTypeOf<never>()
  expectTypeOf(
    parseAbiParameter(['struct Foo { string name; }']),
  ).toEqualTypeOf<never>()

  expectTypeOf(parseAbiParameter('(string)')).toEqualTypeOf<{
    readonly type: 'tuple'
    readonly components: readonly [{ readonly type: 'string' }]
  }>()

  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  const param: string = 'address'
  expectTypeOf(parseAbiParameter(param)).toEqualTypeOf<AbiParameter>()
})
