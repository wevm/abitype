import { expect, test } from 'vitest'

import { parseAbiParameter } from './parseAbiParameter'

test('parseAbiParameter', () => {
  expect(parseAbiParameter('')).toMatchInlineSnapshot('undefined')
  expect(parseAbiParameter([])).toMatchInlineSnapshot('undefined')
  expect(parseAbiParameter(['struct Foo { string name; }']))
    .toMatchInlineSnapshot(`
    [
      "struct Foo { string name; }",
    ]
  `)
  expect([parseAbiParameter('address from')]).toMatchInlineSnapshot(`
    [
      "address from",
    ]
  `)
})
