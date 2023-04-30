import { expect, test } from 'vitest'

import { InvalidParenthesisError } from './splitParameters.js'

test('InvalidParenthesisError', () => {
  expect(
    new InvalidParenthesisError({ current: '(Foo))', depth: -1 }),
  ).toMatchInlineSnapshot(`
    [InvalidParenthesisError: Unbalanced parentheses.

    "(Foo))" has too many closing parentheses.

    Details: Depth "-1"
    Version: abitype@x.y.z]
  `)

  expect(
    new InvalidParenthesisError({ current: '((Foo)', depth: 1 }),
  ).toMatchInlineSnapshot(`
    [InvalidParenthesisError: Unbalanced parentheses.

    "((Foo)" has too many opening parentheses.

    Details: Depth "1"
    Version: abitype@x.y.z]
  `)
})
