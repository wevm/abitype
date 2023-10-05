import { expect, expectTypeOf, test } from 'vitest'

import { formatAbiParameters } from './formatAbiParameters.js'

test('default', () => {
  const result = formatAbiParameters([
    { type: 'address', name: 'foo' },
    { type: 'uint256', name: 'bar' },
  ])
  expect(result).toEqual('address foo, uint256 bar')
  expectTypeOf(result).toEqualTypeOf<'address foo, uint256 bar'>()
})

test('tuple', () => {
  const result = formatAbiParameters([
    {
      type: 'tuple',
      components: [
        { type: 'string', name: 'bar' },
        { type: 'string', name: 'baz' },
      ],
      name: 'foo',
    },
    { type: 'uint256', name: 'bar' },
  ])
  expect(result).toMatchInlineSnapshot(
    '"(string bar, string baz) foo, uint256 bar"',
  )
  expectTypeOf(
    result,
  ).toEqualTypeOf<'(string bar, string baz) foo, uint256 bar'>()
})
