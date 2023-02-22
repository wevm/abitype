import { expect, test } from 'vitest'

import { parseAbiParameters } from './parseAbiParameters'

test('parseAbiParameters', () => {
  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameters('')).toThrowErrorMatchingInlineSnapshot(
    '"Failed to parse ABI parameter"',
  )
  expect([parseAbiParameters('address from')]).toMatchInlineSnapshot(`
    [
      [
        {
          "name": "from",
          "type": "address",
        },
      ],
    ]
  `)

  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameters([])).toThrowErrorMatchingInlineSnapshot(
    '"Failed to parse ABI parameter"',
  )

  expect(() =>
    parseAbiParameters(['struct Foo { string name; }']),
  ).toThrowErrorMatchingInlineSnapshot('"Failed to parse ABI parameter"')
})

test.each([
  {
    signature: 'string, string',
    expected: [{ type: 'string' }, { type: 'string' }],
  },
])(`parseAbiParameters($signature)`, ({ signature, expected }) => {
  expect(parseAbiParameters(signature)).toEqual(expected)
})
