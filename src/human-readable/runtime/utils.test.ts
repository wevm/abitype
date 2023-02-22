import { expect, test } from 'vitest'

import { parseAbiParameter, splitParameters } from './utils'

test('empty string', () => {
  expect(() => parseAbiParameter('')).toThrowErrorMatchingInlineSnapshot(
    '"Invalid ABI parameter \\"\\""',
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
