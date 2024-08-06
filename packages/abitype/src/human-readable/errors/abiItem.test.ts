import { expect, test } from 'vitest'

import {
  InvalidAbiItemError,
  UnknownSolidityTypeError,
  UnknownTypeError,
} from './abiItem.js'

test('InvalidAbiItemError', () => {
  expect(
    new InvalidAbiItemError({ signature: 'address' }),
  ).toMatchInlineSnapshot(`
    [InvalidAbiItemError: Failed to parse ABI item.

    Docs: https://abitype.dev/api/human#parseabiitem-1
    Details: parseAbiItem("address")
    Version: abitype@x.y.z]
  `)
})

test('UnknownTypeError', () => {
  expect(new UnknownTypeError({ type: 'Foo' })).toMatchInlineSnapshot(`
    [UnknownTypeError: Unknown type.

    Type "Foo" is not a valid ABI type. Perhaps you forgot to include a struct signature?

    Version: abitype@x.y.z]
  `)
})

test('UnknownSolidityTypeError', () => {
  expect(new UnknownSolidityTypeError({ type: 'Foo' })).toMatchInlineSnapshot(`
    [UnknownSolidityTypeError: Unknown type.

    Type "Foo" is not a valid ABI type.

    Version: abitype@x.y.z]
  `)
})
