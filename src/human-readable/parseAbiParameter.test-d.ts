import { assertType, expectTypeOf, test } from 'vitest'

import type { ParseAbiParameter } from './parseAbiParameter'

test('ParseAbiParameter', () => {
  expectTypeOf<ParseAbiParameter<''>>().toEqualTypeOf<never>()
  expectTypeOf<ParseAbiParameter<[]>>().toEqualTypeOf<never>()
  expectTypeOf<
    ParseAbiParameter<['struct Foo { string name; }']>
  >().toEqualTypeOf<never>()

  // string
  assertType<ParseAbiParameter<'address from'>>({
    type: 'address',
    name: 'from',
  })
  assertType<ParseAbiParameter<'address indexed from'>>({
    type: 'address',
    name: 'from',
    indexed: true,
  })
  assertType<ParseAbiParameter<'address calldata foo'>>({
    type: 'address',
    name: 'foo',
  })

  // Array
  assertType<ParseAbiParameter<['Foo', 'struct Foo { string name; }']>>({
    type: 'tuple',
    components: [
      {
        name: 'name',
        type: 'string',
      },
    ],
  })
})
