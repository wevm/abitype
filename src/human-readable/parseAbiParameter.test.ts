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

  // expect(() => parseAbiParameter([])).toThrowErrorMatchingInlineSnapshot()

  // expect(parseAbiParameter(['struct Foo { string name; }']))
  //   .toMatchInlineSnapshot(`
  //   [
  //     "struct Foo { string name; }",
  //   ]
  // `)
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
