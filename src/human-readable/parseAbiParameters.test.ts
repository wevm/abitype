import { expect, test } from 'vitest'

import { parseAbiParameters } from './parseAbiParameters'

test('parseAbiParameters', () => {
  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameters('')).toThrowErrorMatchingInlineSnapshot(
    `
    "Failed to parse ABI Item.

    Docs: https://abitype.dev/todo
    Details: parseAbiParameters(\\"\\")
    Version: abitype@0.5.0"
  `,
  )
  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameters([])).toThrowErrorMatchingInlineSnapshot(
    `
    "Failed to parse ABI Item.

    Docs: https://abitype.dev/todo
    Details: parseAbiParameters([])
    Version: abitype@0.5.0"
  `,
  )
  expect(() =>
    parseAbiParameters(['struct Foo { string name; }']),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Failed to parse ABI Item.

    Docs: https://abitype.dev/todo
    Details: parseAbiParameters([
      \\"struct Foo { string name; }\\"
    ])
    Version: abitype@0.5.0"
  `,
  )

  expect(parseAbiParameters('address from')).toMatchInlineSnapshot(`
    [
      {
        "name": "from",
        "type": "address",
      },
    ]
  `)
})

test.each([
  {
    signatures: 'string, string',
    expected: [{ type: 'string' }, { type: 'string' }],
  },
  {
    signatures: 'string foo, string bar',
    expected: [
      { type: 'string', name: 'foo' },
      { type: 'string', name: 'bar' },
    ],
  },
])(`parseAbiParameters($signatures)`, ({ signatures, expected }) => {
  expect(parseAbiParameters(signatures)).toEqual(expected)
})

test.each([
  {
    signatures: ['struct Foo { string bar; }', 'Foo, string'],
    expected: [
      { type: 'tuple', components: [{ name: 'bar', type: 'string' }] },
      { type: 'string' },
    ],
  },
  {
    signatures: ['string foo, string bar'],
    expected: [
      { name: 'foo', type: 'string' },
      { name: 'bar', type: 'string' },
    ],
  },
])(`parseAbiParameters($signatures)`, ({ signatures, expected }) => {
  expect(parseAbiParameters(signatures)).toEqual(expected)
})
