import { expect, test } from 'vitest'

import {
  InvalidSignatureError,
  InvalidStructSignatureError,
  UnknownSignatureError,
} from './signature.js'

test('InvalidSignatureError', () => {
  expect(
    new InvalidSignatureError({
      signature: 'function name??()',
      type: 'function',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidSignatureError: Invalid function signature.

    Details: function name??()
    Version: abitype@x.y.z]
  `)

  expect(
    new InvalidSignatureError({
      signature: 'function name??()',
      type: 'struct',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidSignatureError: Invalid struct signature.

    Details: function name??()
    Version: abitype@x.y.z]
  `)

  expect(
    new InvalidSignatureError({
      signature: 'function name??()',
      type: 'error',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidSignatureError: Invalid error signature.

    Details: function name??()
    Version: abitype@x.y.z]
  `)

  expect(
    new InvalidSignatureError({
      signature: 'function name??()',
      type: 'event',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidSignatureError: Invalid event signature.

    Details: function name??()
    Version: abitype@x.y.z]
  `)

  expect(
    new InvalidSignatureError({
      signature: 'function name??()',
      type: 'constructor',
    }),
  ).toMatchInlineSnapshot(`
    [InvalidSignatureError: Invalid constructor signature.

    Details: function name??()
    Version: abitype@x.y.z]
  `)
})

test('UnknownSignatureError', () => {
  expect(
    new UnknownSignatureError({ signature: 'invalid' }),
  ).toMatchInlineSnapshot(`
    [UnknownSignatureError: Unknown signature.

    Details: invalid
    Version: abitype@x.y.z]
  `)
})

test('InvalidStructSignatureError', () => {
  expect(
    new InvalidStructSignatureError({ signature: 'struct Foo{}' }),
  ).toMatchInlineSnapshot(`
    [InvalidStructSignatureError: Invalid struct signature.
    
    No properties exist.

    Details: struct Foo{}
    Version: abitype@x.y.z]
  `)
})
