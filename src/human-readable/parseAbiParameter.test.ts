import { expect, test } from 'vitest'

import { parseAbiParameter } from './parseAbiParameter'

test('parseAbiParameter', () => {
  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameter('')).toThrowErrorMatchingInlineSnapshot(
    '"Invalid ABI parameter \\"\\""',
  )
  expect([parseAbiParameter('address from')]).toMatchInlineSnapshot(`
    [
      {
        "name": "from",
        "type": "address",
      },
    ]
  `)

  // @ts-expect-error invalid signature type
  expect(() => parseAbiParameter([])).toThrowErrorMatchingInlineSnapshot(
    '"Failed to parse ABI parameter"',
  )

  expect(() =>
    parseAbiParameter(['struct Foo { string name; }']),
  ).toThrowErrorMatchingInlineSnapshot('"Failed to parse ABI parameter"')
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
])(`parseAbiParameter($signature)`, ({ signature, expected }) => {
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
])(`parseAbiParameter($signatures)`, ({ signatures, expected }) => {
  expect(parseAbiParameter(signatures)).toEqual(expected)
})
