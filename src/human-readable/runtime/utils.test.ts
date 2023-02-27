import { expect, test } from 'vitest'

import { parseAbiParameter, parseSignature, splitParameters } from './utils'

const baseFunctionExpected = {
  name: 'foo',
  type: 'function',
  inputs: [],
  outputs: [],
  stateMutability: 'nonpayable',
}
const baseEventExpected = {
  name: 'Foo',
  type: 'event',
  inputs: [],
}

test.each([
  {
    signature: 'function foo()',
    expected: baseFunctionExpected,
  },
  {
    signature: 'function foo(string)',
    expected: {
      ...baseFunctionExpected,
      inputs: [{ type: 'string' }],
    },
  },
  {
    signature: 'function foo(string) view',
    expected: {
      ...baseFunctionExpected,
      inputs: [{ type: 'string' }],
      stateMutability: 'view',
    },
  },
  {
    signature: 'function foo(string) public view',
    expected: {
      ...baseFunctionExpected,
      inputs: [{ type: 'string' }],
      stateMutability: 'view',
    },
  },
  {
    signature: 'function foo(string) public view returns (string)',
    expected: {
      ...baseFunctionExpected,
      inputs: [{ type: 'string' }],
      outputs: [{ type: 'string' }],
      stateMutability: 'view',
    },
  },
  {
    signature: 'event Foo()',
    expected: baseEventExpected,
  },
  {
    signature: 'event Foo(string indexed)',
    expected: {
      ...baseEventExpected,
      inputs: [{ type: 'string', indexed: true }],
    },
  },
  {
    signature: 'event Foo(string indexed foo)',
    expected: {
      ...baseEventExpected,
      inputs: [{ type: 'string', indexed: true, name: 'foo' }],
    },
  },
  {
    signature: 'error Foo(string foo)',
    expected: {
      name: 'Foo',
      type: 'error',
      inputs: [{ type: 'string', name: 'foo' }],
    },
  },
])(`parseSignature($signature)`, ({ signature, expected }) => {
  expect(parseSignature(signature)).toEqual(expected)
})

test('invalid signature', () => {
  expect(() => parseSignature('')).toThrowErrorMatchingInlineSnapshot(
    `
    "Unknown signature.

    Version: abitype@0.5.0"
  `,
  )
  expect(() =>
    parseSignature('method foo(string) (address)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Unknown signature.

    Details: method foo(string) (address)
    Version: abitype@0.5.0"
  `,
  )
})

test('empty string', () => {
  expect(() => parseAbiParameter('')).toThrowErrorMatchingInlineSnapshot(
    `
    "Invalid ABI parameter.

    Version: abitype@0.5.0"
  `,
  )

  expect(() => parseAbiParameter('foo ,')).toThrowErrorMatchingInlineSnapshot(
    `
    "Invalid ABI parameter.

    Details: foo ,
    Version: abitype@0.5.0"
  `,
  )
})

test('indexed not allowed', () => {
  expect(() =>
    parseAbiParameter('string indexed foo'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "\`indexed\` keyword not allowed in param.

    Details: string indexed foo
    Version: abitype@0.5.0"
  `,
  )
})

test.each(['address', 'bool', 'bytes32', 'int256', 'string', 'uint256'])(
  'parseAbiParameter($type)',
  (type) => {
    expect(parseAbiParameter(type)).toEqual({ type })
  },
)

test.each([
  'address indexed',
  'bool indexed',
  'bytes32 indexed',
  'int256 indexed',
  'string indexed',
  'uint256 indexed',
])("parseAbiParameter($type, { modifiers: 'indexed' })", (type) => {
  expect(parseAbiParameter(type, { modifiers: 'indexed' })).toEqual({
    type: type.replace(' indexed', ''),
    indexed: true,
  })
})

test.each([
  'address calldata',
  'bool calldata',
  'bytes32 calldata',
  'int256 calldata',
  'string calldata',
  'uint256 calldata',
])(
  "parseAbiParameter($type, { modifiers: ['calldata', 'memory'] })",
  (type) => {
    expect(
      parseAbiParameter(type, { modifiers: ['calldata', 'memory'] }),
    ).toEqual({
      type: type.replace(/\scalldata|memory/, ''),
    })
  },
)

test.each([
  'address foo',
  'bool foo',
  'bytes32 foo',
  'int256 foo',
  'string foo',
  'uint256 foo',
])('parseAbiParameter($type)', (type) => {
  expect(parseAbiParameter(type)).toEqual({
    name: 'foo',
    type: type.replace(' foo', ''),
  })
})

test('structs', () => {
  expect(
    parseAbiParameter('Foo foo', { structs: { Foo: [{ type: 'string' }] } }),
  ).toMatchInlineSnapshot(`
    {
      "components": [
        {
          "type": "string",
        },
      ],
      "name": "foo",
      "type": "tuple",
    }
  `)
  expect(
    parseAbiParameter('Foo[] foo', { structs: { Foo: [{ type: 'string' }] } }),
  ).toMatchInlineSnapshot(`
    {
      "components": [
        {
          "type": "string",
        },
      ],
      "name": "foo",
      "type": "tuple[]",
    }
  `)
})

test('inline tuples', () => {
  expect(parseAbiParameter('(string) foo')).toMatchInlineSnapshot(`
    {
      "components": [
        {
          "type": "string",
        },
      ],
      "name": "foo",
      "type": "tuple",
    }
  `)
  expect(parseAbiParameter('(string, string) foo')).toMatchInlineSnapshot(`
  {
    "components": [
      {
        "type": "string",
      },
      {
        "type": "string",
      },
    ],
    "name": "foo",
    "type": "tuple",
  }
`)
  expect(
    parseAbiParameter('(Foo, address bar) foo', {
      structs: { Foo: [{ type: 'string' }] },
    }),
  ).toMatchInlineSnapshot(`
    {
      "components": [
        {
          "components": [
            {
              "type": "string",
            },
          ],
          "type": "tuple",
        },
        {
          "name": "bar",
          "type": "address",
        },
      ],
      "name": "foo",
      "type": "tuple",
    }
  `)
})

test.each([
  { params: '', expected: [] },
  { params: 'string', expected: ['string'] },
  { params: 'string indexed foo', expected: ['string indexed foo'] },
  { params: 'string, address', expected: ['string', 'address'] },
  {
    params: 'string foo, address bar',
    expected: ['string foo', 'address bar'],
  },
  {
    params: 'string indexed foo, address indexed bar',
    expected: ['string indexed foo', 'address indexed bar'],
  },
  {
    params:
      'address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId',
    expected: [
      'address owner',
      '(bool loading, (string[][] names) cats)[] dog',
      'uint tokenId',
    ],
  },
])(`splitParameters($params)`, ({ params, expected }) => {
  expect(splitParameters(params)).toEqual(expected)
})
