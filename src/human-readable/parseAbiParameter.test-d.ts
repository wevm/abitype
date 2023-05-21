import { expectTypeOf, test } from 'vitest'

import type { AbiParameter } from '../abi.js'
import type { Flatten } from '../types.js'
import type {
  ParseAbiParameter,
  ValidateAbiParameter,
} from './parseAbiParameter.js'
import { parseAbiParameter } from './parseAbiParameter.js'

test('ValidateAbiParameters', () => {
  expectTypeOf<ValidateAbiParameter<['address']>>().toEqualTypeOf<
    [
      'Error: No Struct signature found. Please provide valid struct signatures.',
    ]
  >()
  expectTypeOf<
    ValidateAbiParameter<['struct Foo { string name; }', 'address']>
  >().toEqualTypeOf<[]>()
  expectTypeOf<
    Flatten<
      ValidateAbiParameter<['struct Foo { string name; }', 'address, address']>
    >
  >().toEqualTypeOf<
    [
      'Error: Invalid Parameter "address, address". Please use "parseAbiParameters" for comma seperated strings.',
    ]
  >()
  // expectTypeOf<
  //   Flatten<ValidateAbiParameters<["struct Foo { string name; }", "Bar"]>>
  // >().toEqualTypeOf<["Error: Invalid Parameter \"Bar\". No valid type."]>();
})

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
    // @ts-expect-error no parameter passed
    parseAbiParameter(['struct Foo { string name; }']),
  ).toEqualTypeOf<never>()

  expectTypeOf(
    parseAbiParameter(['struct Foo { string name; }', 'address']),
  ).toEqualTypeOf<{ readonly type: 'address' }>()

  expectTypeOf(
    parseAbiParameter(['struct Foo { string name; }', 'Bar']),
  ).toEqualTypeOf<{ readonly type: 'Bar' }>()

  // expectTypeOf(
  //   // @ts-expect-error not a valid type
  //   parseAbiParameter(["struct Foo { string name; }", "Bar"])
  // ).toEqualTypeOf<never>();

  expectTypeOf(parseAbiParameter('(string)')).toEqualTypeOf<{
    readonly type: 'tuple'
    readonly components: readonly [{ readonly type: 'string' }]
  }>()

  const param: string = 'address'
  expectTypeOf(parseAbiParameter(param)).toEqualTypeOf<AbiParameter>()
})
