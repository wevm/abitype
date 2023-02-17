import { assertType, test } from 'vitest'

import type { ParseAbiParameters } from './parseAbiParameters'

test('ParseAbiParameters', () => {
  assertType<ParseAbiParameters<''>>([])
  assertType<ParseAbiParameters<[]>>([])
  assertType<ParseAbiParameters<['struct Foo { string name; }']>>([])

  // string
  assertType<ParseAbiParameters<'address from, address to, uint256 amount'>>([
    {
      type: 'address',
      name: 'from',
    },
    {
      type: 'address',
      name: 'to',
    },
    {
      type: 'uint256',
      name: 'amount',
    },
  ])
  assertType<
    ParseAbiParameters<'address indexed from, address indexed to, uint256 indexed amount'>
  >([
    {
      type: 'address',
      name: 'from',
      indexed: true,
    },
    {
      type: 'address',
      name: 'to',
      indexed: true,
    },
    {
      type: 'uint256',
      name: 'amount',
      indexed: true,
    },
  ])
  assertType<
    ParseAbiParameters<'address calldata foo, address memory bar, uint256 storage baz'>
  >([
    {
      type: 'address',
      name: 'foo',
    },
    {
      type: 'address',
      name: 'bar',
    },
    {
      type: 'uint256',
      name: 'baz',
    },
  ])

  // Array
  assertType<
    ParseAbiParameters<['Foo, bytes32', 'struct Foo { string name; }']>
  >([
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
  ])
})
