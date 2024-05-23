import { assertType, expect, test } from 'vitest'

import { parseAbiParameter } from './parseAbiParameter.js'

test('parseAbiParameter', () => {
  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameter('')).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidParameterError: Invalid ABI parameter.

    Version: abitype@x.y.z]
  `,
  )
  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameter([])).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidAbiParameterError: Failed to parse ABI parameter.

    Docs: https://abitype.dev/api/human#parseabiparameter-1
    Details: parseAbiParameter([])
    Version: abitype@x.y.z]
  `,
  )
  expect(() =>
    parseAbiParameter(['struct Foo { string name; }']),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidAbiParameterError: Failed to parse ABI parameter.

    Docs: https://abitype.dev/api/human#parseabiparameter-1
    Details: parseAbiParameter([
      "struct Foo { string name; }"
    ])
    Version: abitype@x.y.z]
  `,
  )

  expect(() =>
    parseAbiParameter(['struct Foo { string memory bar; }', 'Foo indexed foo']),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidModifierError: Invalid ABI parameter.

    Modifier "memory" not allowed in "struct" type.

    Details: string memory bar
    Version: abitype@x.y.z]
  `,
  )

  expect([parseAbiParameter('address from')]).toMatchInlineSnapshot(`
  [
    {
      "name": "from",
      "type": "address",
    },
  ]
`)
})

test.each([
  { signature: 'string', expected: { type: 'string' } },
  { signature: 'string foo', expected: { name: 'foo', type: 'string' } },
  {
    signature: 'string indexed foo',
    expected: { name: 'foo', type: 'string', indexed: true },
  },
  {
    signature: 'string calldata foo',
    expected: { name: 'foo', type: 'string' },
  },
  {
    signature: '(string)',
    expected: { type: 'tuple', components: [{ type: 'string' }] },
  },
  {
    signature: '(string foo)',
    expected: { type: 'tuple', components: [{ name: 'foo', type: 'string' }] },
  },
  {
    signature: '(string bar) foo',
    expected: {
      type: 'tuple',
      name: 'foo',
      components: [{ name: 'bar', type: 'string' }],
    },
  },
  {
    signature: '(string bar, string baz) foo',
    expected: {
      type: 'tuple',
      name: 'foo',
      components: [
        { name: 'bar', type: 'string' },
        { name: 'baz', type: 'string' },
      ],
    },
  },
  { signature: 'string[]', expected: { type: 'string[]' } },
])('parseAbiParameter($signature)', ({ signature, expected }) => {
  expect(parseAbiParameter(signature)).toEqual(expected)
})

test.each([
  {
    signatures: ['struct Foo { string bar; }', 'Foo'],
    expected: { type: 'tuple', components: [{ name: 'bar', type: 'string' }] },
  },
  {
    signatures: ['struct Foo { string bar; }', 'Foo foo'],
    expected: {
      type: 'tuple',
      name: 'foo',
      components: [{ name: 'bar', type: 'string' }],
    },
  },
  {
    signatures: ['struct Foo { string bar; }', 'Foo indexed foo'],
    expected: {
      type: 'tuple',
      name: 'foo',
      indexed: true,
      components: [{ name: 'bar', type: 'string' }],
    },
  },
])('parseAbiParameter($signatures)', ({ signatures, expected }) => {
  expect(parseAbiParameter(signatures)).toEqual(expected)
})

test('nested tuple', () => {
  const result = parseAbiParameter('((((string baz) bar)[1] foo) boo)')
  expect(result).toMatchInlineSnapshot(`
    {
      "components": [
        {
          "components": [
            {
              "components": [
                {
                  "components": [
                    {
                      "name": "baz",
                      "type": "string",
                    },
                  ],
                  "name": "bar",
                  "type": "tuple",
                },
              ],
              "name": "foo",
              "type": "tuple[1]",
            },
          ],
          "name": "boo",
          "type": "tuple",
        },
      ],
      "type": "tuple",
    }
  `)
  assertType<{
    type: 'tuple'
    components: readonly [
      {
        type: 'tuple'
        components: readonly [
          {
            type: 'tuple[1]'
            components: readonly [
              {
                type: 'tuple'
                components: readonly [
                  {
                    type: 'string'
                    name: 'baz'
                  },
                ]
                name: 'bar'
              },
            ]
            name: 'foo'
          },
        ]
        name: 'boo'
      },
    ]
  }>(result)
})
