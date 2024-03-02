import { expect, test } from 'vitest'

import { parseAbiItem } from './parseAbiItem.js'

test('parseAbiItem', () => {
  // @ts-expect-error invalid signature type
  expect(() => parseAbiItem('')).toThrowErrorMatchingInlineSnapshot(
    `
    "Unknown signature.

    Version: abitype@x.y.z"
  `,
  )
  // @ts-expect-error invalid signature type
  expect(() => parseAbiItem([])).toThrowErrorMatchingInlineSnapshot(
    `
    "Failed to parse ABI item.

    Docs: https://abitype.dev/api/human#parseabiitem-1
    Details: parseAbiItem([])
    Version: abitype@x.y.z"
  `,
  )
  expect(() =>
    parseAbiItem(['struct Foo { string name; }']),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Failed to parse ABI item.

    Docs: https://abitype.dev/api/human#parseabiitem-1
    Details: parseAbiItem([
      \\"struct Foo { string name; }\\"
    ])
    Version: abitype@x.y.z"
  `,
  )
})

test.each([
  {
    signature: ['function foo(string)'],
    expected: {
      type: 'function',
      name: 'foo',
      inputs: [{ type: 'string' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  },
  {
    signature: [
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
  {
    signature: ['fallback() external'],
    expected: {
      type: 'fallback',
    },
  },
])('parseAbiItem($signature)', ({ signature, expected }) => {
  expect(parseAbiItem(signature)).toEqual(expected)
})

test.each([
  {
    signature: ['struct Foo { string bar; }', 'function foo(Foo)'],
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
])('parseAbiItem($signature)', ({ signature, expected }) => {
  expect(parseAbiItem(signature)).toEqual(expected)
})
