import { expect, test } from 'vitest'

import { parseAbiParameters } from './parseAbiParameters.js'

test('parseAbiParameters', () => {
  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameters('')).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidAbiParametersError: Failed to parse ABI parameters.

    Docs: https://abitype.dev/api/human#parseabiparameters-1
    Details: parseAbiParameters("")
    Version: abitype@x.y.z]
  `,
  )
  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameters([])).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidAbiParametersError: Failed to parse ABI parameters.

    Docs: https://abitype.dev/api/human#parseabiparameters-1
    Details: parseAbiParameters([])
    Version: abitype@x.y.z]
  `,
  )
  expect(() =>
    parseAbiParameters(['struct Foo { string name; }']),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidAbiParametersError: Failed to parse ABI parameters.

    Docs: https://abitype.dev/api/human#parseabiparameters-1
    Details: parseAbiParameters([
      "struct Foo { string name; }"
    ])
    Version: abitype@x.y.z]
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
])('parseAbiParameters($signatures)', ({ signatures, expected }) => {
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
])('parseAbiParameters($signatures)', ({ signatures, expected }) => {
  expect(parseAbiParameters(signatures)).toEqual(expected)
})
