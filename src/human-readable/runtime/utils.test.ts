import { expect, test } from 'vitest'

import {
  isInvalidSolidiyName,
  isNotFunctionModifierType,
  isSolidityType,
  parseAbiParameter,
  parseSignature,
  splitParameters,
} from './utils'

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

    Version: abitype@x.y.z"
  `,
  )
  expect(() =>
    parseSignature('method foo(string) (address)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Unknown signature.

    Details: method foo(string) (address)
    Version: abitype@x.y.z"
  `,
  )

  expect(() =>
    parseSignature('error Foo(string memory foo)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Invalid ABI parameter.
    
    memory modifier not allowed in 'error' type.

    Details: string memory foo
    Version: abitype@x.y.z"
  `,
  )

  expect(() =>
    parseSignature('event Foo(string memory foo)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Invalid ABI parameter.
    
    memory modifier not allowed in 'event' type.

    Details: string memory foo
    Version: abitype@x.y.z"
  `,
  )
})

test('empty string', () => {
  expect(() => parseAbiParameter('')).toThrowErrorMatchingInlineSnapshot(
    `
    "Invalid ABI parameter.

    Version: abitype@x.y.z"
  `,
  )

  expect(() => parseAbiParameter('foo ,')).toThrowErrorMatchingInlineSnapshot(
    `
    "Invalid ABI parameter.

    Details: foo ,
    Version: abitype@x.y.z"
  `,
  )
})

test('Invalid solidity type', () => {
  expect(() => parseAbiParameter('strings'))
    .toThrowErrorMatchingInlineSnapshot(`
      "Unknown type.

      Type \\"strings\\" is not a valid ABI type.

      Version: abitype@x.y.z"
    `)
})

test('Invalid solidity type in tuple', () => {
  expect(() => parseAbiParameter('(strings)'))
    .toThrowErrorMatchingInlineSnapshot(`
      "Unknown type.

      Type \\"strings\\" is not a valid ABI type.

      Version: abitype@x.y.z"
    `)
})

test('Invalid solidity type in nested tuple', () => {
  expect(() => parseAbiParameter('((strings))'))
    .toThrowErrorMatchingInlineSnapshot(`
      "Unknown type.

      Type \\"strings\\" is not a valid ABI type.

      Version: abitype@x.y.z"
    `)
})

test('Struct type without context', () => {
  expect(() => parseAbiParameter('Demo demo'))
    .toThrowErrorMatchingInlineSnapshot(`
      "Unknown type.

      Type \\"Demo\\" is not a valid ABI type.

      Version: abitype@x.y.z"
    `)
})

test('Struct type with context', () => {
  expect(parseAbiParameter('Demo demo', { type: 'struct' })).toEqual({
    type: 'Demo',
    name: 'demo',
  })
})

test('indexed not allowed', () => {
  expect(() =>
    parseAbiParameter('string indexed foo'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "\`indexed\` keyword not allowed in param.

    Details: string indexed foo
    Version: abitype@x.y.z"
  `,
  )
})

test('modifier not allowed', () => {
  expect(() =>
    parseAbiParameter('uint256 calldata foo'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Invalid ABI parameter.

    calldata modifier not allowed in 'uint256' type.

    Details: uint256 calldata foo
    Version: abitype@x.y.z"
  `,
  )
})

test('invalid name', () => {
  expect(() =>
    parseAbiParameter('uint256 address'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Invalid ABI parameter.

    address is a protected Solidity keyword.

    Docs: https://abitype.devhttps://docs.soliditylang.org/en/latest/cheatsheet.html
    Details: uint256 address
    Version: abitype@x.y.z"
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
  expect(
    parseAbiParameter(type, {
      modifiers: new Set(['indexed']),
    }),
  ).toEqual({
    type: type.replace(' indexed', ''),
    indexed: true,
  })
})

test.each([
  'address[] calldata',
  'bool[] calldata',
  'bytes32[] calldata',
  'int256[] calldata',
  'string calldata',
  'uint256[] calldata',
  'bytes calldata',
])(
  "parseAbiParameter($type, { modifiers: ['calldata', 'memory'] })",
  (type) => {
    expect(
      parseAbiParameter(type, {
        modifiers: new Set(['calldata', 'memory']),
      }),
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

test.each([
  'address',
  'bool',
  'bytes32',
  'int256',
  'string',
  'uint256',
  'function',
  'tuple',
])('isSolidityType($type)', (type) => {
  expect(isSolidityType(type)).toEqual(true)
})

test.each(['address', 'bool', 'bytes32', 'int256', 'uint256', 'function'])(
  'isNotFunctionModifierType($type)',
  (type) => {
    expect(isNotFunctionModifierType(type)).toEqual(true)
  },
)

test.each(['string', 'bytes', 'address[]', 'bool[]', 'bytes32[]', 'int256[]'])(
  'isNotFunctionModifierType($type)',
  (type) => {
    expect(isNotFunctionModifierType(type)).toEqual(false)
  },
)

test.each([
  'address',
  'bool',
  'bytes32',
  'int256',
  'string',
  'uint256',
  'function',
  'view',
  'override',
  'let',
  'var',
  'typeof',
  'promise',
  'in',
  'of',
  'reference',
  'implements',
  'mapping',
  'error',
  'event',
  'struct',
  'alias',
  'byte',
  'case',
  'copyof',
  'final',
  'external',
  'public',
  'internal',
  'pure',
  'match',
  'apply',
  'case',
  'null',
  'mutable',
  'inline',
  'static',
  'partial',
  'relocatable',
  'try',
  'catch',
  'switch',
  'supports',
  'mapping',
  'virtual',
  'return',
  'returns',
  'after',
  'auto',
  'default',
  'defined',
  'typedef',
  'typeof',
])('isInvalidSolidiyName($name)', (name) => {
  expect(isInvalidSolidiyName(name)).toEqual(true)
})

test('isInvalidSolidiyName', () => {
  expect(isSolidityType('foo')).toEqual(false)
})

test('isFunctionModifierType', () => {
  expect(isSolidityType('foo')).toEqual(false)
})

test('isSolidityType', () => {
  expect(isSolidityType('foo')).toEqual(false)
})

test('Unbalanced Parethesis', () => {
  expect(() =>
    splitParameters('address owner, ((string name)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Unbalanced parenthesis.

    ((string name) has to many opening parenthesis.
    
    Details: Depth 1
    Version: abitype@x.y.z"
    `,
  )

  expect(() =>
    splitParameters('address owner, (((string name)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Unbalanced parenthesis.

    (((string name) has to many opening parenthesis.
    
    Details: Depth 2
    Version: abitype@x.y.z"
    `,
  )
  expect(() =>
    splitParameters('address owner, (string name))'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Unbalanced parenthesis.

    (string name)) has to many closing parenthesis.
    
    Details: Depth -1
    Version: abitype@x.y.z"
    `,
  )

  expect(() =>
    splitParameters('address owner, (string name)))'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    "Unbalanced parenthesis.

    (string name))) has to many closing parenthesis.

    Details: Depth -2
    Version: abitype@x.y.z"
    `,
  )
})
