import { expect, test } from 'vitest'

import { functionModifiers } from './signatures.js'
import {
  isSolidityKeyword,
  isSolidityType,
  isValidDataLocation,
  parseAbiParameter,
  parseSignature,
  splitParameters,
} from './utils.js'

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
  {
    signature: 'receive() external payable',
    expected: {
      type: 'receive',
      stateMutability: 'payable',
    },
  },
  {
    signature: 'fallback() external payable',
    expected: {
      type: 'fallback',
      stateMutability: 'payable',
    },
  },
  {
    signature: 'fallback() external',
    expected: {
      type: 'fallback',
      stateMutability: 'nonpayable',
    },
  },
])('parseSignature($signature)', ({ signature, expected }) => {
  expect(parseSignature(signature)).toEqual(expected)
})

test('invalid signature', () => {
  expect(() => parseSignature('')).toThrowErrorMatchingInlineSnapshot(
    `
    [UnknownSignatureError: Unknown signature.

    Version: abitype@x.y.z]
  `,
  )
  expect(() =>
    parseSignature('method foo(string) (address)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [UnknownSignatureError: Unknown signature.

    Details: method foo(string) (address)
    Version: abitype@x.y.z]
  `,
  )

  expect(() =>
    parseSignature('error Foo(string memory foo)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidModifierError: Invalid ABI parameter.

    Modifier "memory" not allowed in "error" type.

    Details: string memory foo
    Version: abitype@x.y.z]
  `,
  )

  expect(() =>
    parseSignature('event Foo(string memory foo)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidModifierError: Invalid ABI parameter.

    Modifier "memory" not allowed in "event" type.

    Details: string memory foo
    Version: abitype@x.y.z]
  `,
  )

  expect(() =>
    parseSignature('function 9abc()'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [UnknownSignatureError: Unknown signature.

    Details: function 9abc()
    Version: abitype@x.y.z]
  `,
  )

  expect(() =>
    parseSignature('method foo_(string)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [UnknownSignatureError: Unknown signature.

    Details: method foo_(string)
    Version: abitype@x.y.z]
  `,
  )
})

test('empty string', () => {
  expect(() => parseAbiParameter('')).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidParameterError: Invalid ABI parameter.

    Version: abitype@x.y.z]
  `,
  )

  expect(() => parseAbiParameter('foo ,')).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidParameterError: Invalid ABI parameter.

    Details: foo ,
    Version: abitype@x.y.z]
  `,
  )
})

test('Invalid solidity type', () => {
  expect(() =>
    parseAbiParameter('strings'),
  ).toThrowErrorMatchingInlineSnapshot(`
    [UnknownSolidityTypeError: Unknown type.

    Type "strings" is not a valid ABI type.

    Version: abitype@x.y.z]
  `)
})

test('Invalid solidity type in tuple', () => {
  expect(() =>
    parseAbiParameter('(strings)'),
  ).toThrowErrorMatchingInlineSnapshot(`
    [UnknownSolidityTypeError: Unknown type.

    Type "strings" is not a valid ABI type.

    Version: abitype@x.y.z]
  `)
})

test('Invalid solidity type in nested tuple', () => {
  expect(() =>
    parseAbiParameter('((strings))'),
  ).toThrowErrorMatchingInlineSnapshot(`
    [UnknownSolidityTypeError: Unknown type.

    Type "strings" is not a valid ABI type.

    Version: abitype@x.y.z]
  `)
})

test('Struct type without context', () => {
  expect(() =>
    parseAbiParameter('Demo demo'),
  ).toThrowErrorMatchingInlineSnapshot(`
    [UnknownSolidityTypeError: Unknown type.

    Type "Demo" is not a valid ABI type.

    Version: abitype@x.y.z]
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
    [InvalidModifierError: Invalid ABI parameter.

    Modifier "indexed" not allowed.

    Details: string indexed foo
    Version: abitype@x.y.z]
  `,
  )
})

test('modifier not allowed', () => {
  expect(() =>
    parseAbiParameter('uint256 calldata foo'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidModifierError: Invalid ABI parameter.

    Modifier "calldata" not allowed.

    Details: uint256 calldata foo
    Version: abitype@x.y.z]
  `,
  )
})

test('valid name', () => {
  expect(parseAbiParameter('uint256 $')).toEqual({
    type: 'uint256',
    name: '$',
  })

  expect(parseAbiParameter('uint256 $_a9')).toEqual({
    type: 'uint256',
    name: '$_a9',
  })

  expect(parseAbiParameter('uint256 _')).toEqual({
    type: 'uint256',
    name: '_',
  })

  expect(parseAbiParameter('uint256 abc$_9')).toEqual({
    type: 'uint256',
    name: 'abc$_9',
  })
})

test('invalid name', () => {
  expect(() =>
    parseAbiParameter('uint256 address'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [SolidityProtectedKeywordError: Invalid ABI parameter.

    "address" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html

    Details: uint256 address
    Version: abitype@x.y.z]
  `,
  )

  expect(() =>
    parseAbiParameter('uint256 9abc'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidParameterError: Invalid ABI parameter.

    Details: uint256 9abc
    Version: abitype@x.y.z]
  `,
  )
})

test('invalid data location', () => {
  expect(() =>
    parseAbiParameter('uint256 memory foo', { modifiers: functionModifiers }),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidFunctionModifierError: Invalid ABI parameter.

    Modifier "memory" not allowed.
    Data location can only be specified for array, struct, or mapping types, but "memory" was given.

    Details: uint256 memory foo
    Version: abitype@x.y.z]
  `,
  )
})
test('valid data location', () => {
  expect(
    parseAbiParameter('uint256[] memory foo', { modifiers: functionModifiers }),
  ).toMatchInlineSnapshot(`
    {
      "name": "foo",
      "type": "uint256[]",
    }
  `)
  expect(
    parseAbiParameter('string memory foo', { modifiers: functionModifiers }),
  ).toMatchInlineSnapshot(`
    {
      "name": "foo",
      "type": "string",
    }
  `)
  expect(
    parseAbiParameter('Foo memory foo', {
      modifiers: functionModifiers,
      structs: { Foo: [{ type: 'string' }] },
    }),
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

test('dynamic integer', () => {
  expect(parseAbiParameter('int')).toMatchInlineSnapshot(`
    {
      "type": "int256",
    }
  `)
  expect(parseAbiParameter('uint')).toMatchInlineSnapshot(`
    {
      "type": "uint256",
    }
  `)
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
  {
    params: ' ',
    expected: [],
  },
])('splitParameters($params)', ({ params, expected }) => {
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
])('isSolidityType($type)', (type) => {
  expect(isSolidityType(type)).toEqual(true)
})
test('isSolidityType', () => {
  expect(isSolidityType('foo')).toEqual(false)
})

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
  expect(isSolidityKeyword(name)).toEqual(true)
})

test.each(['bytes', 'string', 'tuple'])(
  'isValidDataLocation($type)',
  (type) => {
    expect(isValidDataLocation(type as any, false)).toEqual(true)
  },
)

test('Unbalanced Parethesis', () => {
  expect(() =>
    splitParameters('address owner, ((string name)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidParenthesisError: Unbalanced parentheses.

    "((string name)" has too many opening parentheses.

    Details: Depth "1"
    Version: abitype@x.y.z]
  `,
  )

  expect(() =>
    splitParameters('address owner, (((string name)'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidParenthesisError: Unbalanced parentheses.

    "(((string name)" has too many opening parentheses.

    Details: Depth "2"
    Version: abitype@x.y.z]
  `,
  )
  expect(() =>
    splitParameters('address owner, (string name))'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidParenthesisError: Unbalanced parentheses.

    "(string name))" has too many closing parentheses.

    Details: Depth "-1"
    Version: abitype@x.y.z]
  `,
  )

  expect(() =>
    splitParameters('address owner, (string name)))'),
  ).toThrowErrorMatchingInlineSnapshot(
    `
    [InvalidParenthesisError: Unbalanced parentheses.

    "(string name)))" has too many closing parentheses.

    Details: Depth "-2"
    Version: abitype@x.y.z]
  `,
  )
})
