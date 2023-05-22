import { expect, test } from 'vitest'

import { CircularReferenceError, MissingSemicolonError } from './struct.js'

test('CircularReferenceError', () => {
  expect(new CircularReferenceError({ type: 'Foo' })).toMatchInlineSnapshot(`
    [CircularReferenceError: Circular reference detected.

    Struct "Foo" is a circular reference.

    Version: abitype@x.y.z]
  `)
})

test('MissingSemicolonError', () => {
  expect(new MissingSemicolonError({ props: 'Bar' })).toMatchInlineSnapshot(`
    [MissingSemicolonError: Missing closing semicolon.

    Struct properties "Bar" <- is missing a semicolon.

    Version: abitype@x.y.z]
  `)
})
