import { assertType, test } from 'vitest'

import type { ParseAbiParameter } from './parseAbiParameter'

test('ParseAbiParameter', () => {
  assertType<ParseAbiParameter<''>>(undefined)
  assertType<ParseAbiParameter<[]>>(undefined)
  assertType<ParseAbiParameter<['struct Foo { string name; }']>>(undefined)

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
