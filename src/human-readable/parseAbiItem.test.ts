import { expect, test } from 'vitest'

import { parseAbiItem } from './parseAbiItem'

test('parseAbiItem', () => {
  // @ts-expect-error invalid signature type
  expect(() => parseAbiItem('')).toThrowErrorMatchingInlineSnapshot(
    `
    "Unknown signature.

    Version: abitype@0.6.1"
  `,
  )
  // @ts-expect-error invalid signature type
  expect(() => parseAbiItem([])).toThrowErrorMatchingInlineSnapshot(
    `
    "Failed to parse ABI Item.

    Docs: https://abitype.dev/todo
    Details: parseAbiItem([])
    Version: abitype@0.6.1"
  `,
  )
  expect(() =>
    parseAbiItem(['struct Foo { string name; }']),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Failed to parse ABI Item.

    Docs: https://abitype.dev/todo
    Details: parseAbiItem([
      \\"struct Foo { string name; }\\"
    ])
    Version: abitype@0.6.1"
  `,
  )
})

test.each([
  {
    signatures: ['function foo(string)'],
    expected: {
      type: 'function',
      name: 'foo',
      inputs: [{ type: 'string' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  },
  {
    signatures: [
      'event Foo(address indexed from, address indexed to, uint256 amount)',
    ],
    expected: {
      type: 'event',
      name: 'Foo',
      inputs: [
        { type: 'address', name: 'from', indexed: true },
        { type: 'address', name: 'to', indexed: true },
        { type: 'uint256', name: 'amount' },
      ],
    },
  },
])(`parseAbiItem($signatures)`, ({ signatures, expected }) => {
  expect(parseAbiItem(signatures)).toEqual(expected)
})

test.each([
  {
    signatures: ['struct Foo { string bar; }', 'function foo(Foo)'],
    expected: {
      type: 'function',
      name: 'foo',
      inputs: [
        { type: 'tuple', components: [{ name: 'bar', type: 'string' }] },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  },
])(`parseAbiItem($signatures)`, ({ signatures, expected }) => {
  expect(parseAbiItem(signatures)).toEqual(expected)
})
