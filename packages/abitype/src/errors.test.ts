import { expect, test } from 'vitest'

import { BaseError } from './errors.js'

test('BaseError', () => {
  expect(new BaseError('An error occurred.')).toMatchInlineSnapshot(`
    [AbiTypeError: An error occurred.

    Version: abitype@x.y.z]
  `)

  expect(
    new BaseError('An error occurred.', { details: 'details' }),
  ).toMatchInlineSnapshot(`
      [AbiTypeError: An error occurred.

      Details: details
      Version: abitype@x.y.z]
    `)

  expect(new BaseError('', { details: 'details' })).toMatchInlineSnapshot(`
    [AbiTypeError: An error occurred.

    Details: details
    Version: abitype@x.y.z]
  `)
})

test('BaseError (w/ docsPath)', () => {
  expect(
    new BaseError('An error occurred.', {
      details: 'details',
      docsPath: '/lol',
    }),
  ).toMatchInlineSnapshot(`
    [AbiTypeError: An error occurred.

    Docs: https://abitype.dev/lol
    Details: details
    Version: abitype@x.y.z]
  `)
  expect(
    new BaseError('An error occurred.', {
      cause: new BaseError('error', { docsPath: '/docs' }),
    }),
  ).toMatchInlineSnapshot(`
    [AbiTypeError: An error occurred.

    Docs: https://abitype.dev/docs
    Version: abitype@x.y.z]
  `)
  expect(
    new BaseError('An error occurred.', {
      cause: new BaseError('error'),
      docsPath: '/lol',
    }),
  ).toMatchInlineSnapshot(`
    [AbiTypeError: An error occurred.

    Docs: https://abitype.dev/lol
    Version: abitype@x.y.z]
  `)
})

test('BaseError (w/ metaMessages)', () => {
  expect(
    new BaseError('An error occurred.', {
      details: 'details',
      metaMessages: ['Reason: idk', 'Cause: lol'],
    }),
  ).toMatchInlineSnapshot(`
    [AbiTypeError: An error occurred.

    Reason: idk
    Cause: lol

    Details: details
    Version: abitype@x.y.z]
  `)
})

test('inherited BaseError', () => {
  const err = new BaseError('An error occurred.', {
    details: 'details',
    docsPath: '/lol',
  })
  expect(
    new BaseError('An internal error occurred.', {
      cause: err,
    }),
  ).toMatchInlineSnapshot(`
    [AbiTypeError: An internal error occurred.

    Docs: https://abitype.dev/lol
    Details: details
    Version: abitype@x.y.z]
  `)
})

test('inherited Error', () => {
  const err = new Error('details')
  expect(
    new BaseError('An internal error occurred.', {
      cause: err,
      docsPath: '/lol',
    }),
  ).toMatchInlineSnapshot(`
    [AbiTypeError: An internal error occurred.

    Docs: https://abitype.dev/lol
    Details: details
    Version: abitype@x.y.z]
  `)
})
