import { expect, test } from 'vitest'

import { CircularReferenceError } from './struct.js'

test('CircularReferenceError', () => {
  expect(new CircularReferenceError({ type: 'Foo' })).toMatchInlineSnapshot(`
    [CircularReferenceError: Circular reference detected.

    Struct "Foo" is a circular reference.

    Version: abitype@x.y.z]
  `)
})
