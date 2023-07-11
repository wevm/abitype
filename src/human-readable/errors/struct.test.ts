import { expect, test } from 'vitest'

import { CircularReferenceError, MissingNamedParameter } from './struct.js'

test('CircularReferenceError', () => {
  expect(new CircularReferenceError({ type: 'Foo' })).toMatchInlineSnapshot(`
    [CircularReferenceError: Circular reference detected.

    Struct "Foo" is a circular reference.

    Version: abitype@x.y.z]
  `)
})

test('MissingNamedParameter', () => {
  expect(new MissingNamedParameter({ type: 'Foo' })).toMatchInlineSnapshot(`
    [MissingNamedParameter: Missing named parameter for EIP-712 typed data.

    named parameter for type Foo must be present.

    Version: abitype@x.y.z]
  `)
})
