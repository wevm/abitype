import { assertType, test } from 'vitest'

import type {
  ParseAbi,
  ParseAbiParameter,
  ParseParams,
  ParseSignature,
} from './utils'

test('ParseSignature', () => {
  // TODO: functions and tuple params

  type Structs = {
    Baz: [{ type: 'address'; name: 'baz' }]
  }

  // Error
  assertType<ParseSignature<'error Foo()'>>({
    type: 'error',
    name: 'Foo',
    inputs: [],
  })
  assertType<ParseSignature<'error Foo(string)'>>({
    type: 'error',
    name: 'Foo',
    inputs: [{ type: 'string' }],
  })
  assertType<ParseSignature<'error Foo(string bar)'>>({
    type: 'error',
    name: 'Foo',
    inputs: [{ type: 'string', name: 'bar' }],
  })
  assertType<ParseSignature<'error Foo(Baz bar)', Structs>>({
    type: 'error',
    name: 'Foo',
    inputs: [
      {
        type: 'tuple',
        name: 'bar',
        components: [{ type: 'address', name: 'baz' }],
      },
    ],
  })

  // Events
  assertType<ParseSignature<'event Foo()'>>({
    type: 'event',
    name: 'Foo',
    inputs: [],
  })
  assertType<ParseSignature<'event Foo(string)'>>({
    type: 'event',
    name: 'Foo',
    inputs: [{ type: 'string' }],
  })
  assertType<ParseSignature<'event Foo(string bar)'>>({
    type: 'event',
    name: 'Foo',
    inputs: [{ type: 'string', name: 'bar' }],
  })
  assertType<ParseSignature<'event Foo(string indexed bar)'>>({
    type: 'event',
    name: 'Foo',
    inputs: [{ type: 'string', indexed: true, name: 'bar' }],
  })
  assertType<ParseSignature<'event Foo(Baz bar)', Structs>>({
    type: 'event',
    name: 'Foo',
    inputs: [
      {
        type: 'tuple',
        name: 'bar',
        components: [{ type: 'address', name: 'baz' }],
      },
    ],
  })

  // Constructor
  assertType<ParseSignature<'constructor()'>>({
    type: 'constructor',
    inputs: [],
  })
  assertType<ParseSignature<'constructor(string)'>>({
    type: 'constructor',
    inputs: [{ type: 'string' }],
  })
  assertType<ParseSignature<'constructor(string foo)'>>({
    type: 'constructor',
    inputs: [{ type: 'string', name: 'foo' }],
  })
  assertType<ParseSignature<'constructor(string foo)'>>({
    type: 'constructor',
    inputs: [{ type: 'string', name: 'foo' }],
  })

  // Fallback
  assertType<ParseSignature<'fallback()'>>({
    type: 'fallback',
  })

  // Receive
  assertType<ParseSignature<'receive() external payable'>>({
    type: 'receive',
    stateMutability: 'payable',
  })
})

test('ParseAbiParameter', () => {
  // TODO: tuples

  type OptionsWithIndexed = { AllowIndexed: true; Structs: unknown }
  type OptionsWithStructs = {
    AllowIndexed: true
    Structs: {
      Foo: [{ type: 'address'; name: 'bar' }]
    }
  }

  // `${Type} ${Modifier} ${Name}` format
  assertType<ParseAbiParameter<'string calldata foo'>>({
    type: 'string',
    name: 'foo',
  })
  assertType<ParseAbiParameter<'string indexed foo', OptionsWithIndexed>>({
    type: 'string',
    indexed: true,
    name: 'foo',
  })
  assertType<ParseAbiParameter<'Foo calldata foo', OptionsWithStructs>>({
    type: 'tuple',
    name: 'foo',
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<ParseAbiParameter<'Foo indexed foo', OptionsWithStructs>>({
    type: 'tuple',
    indexed: true,
    name: 'foo',
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<ParseAbiParameter<'Foo[][1] indexed foo', OptionsWithStructs>>({
    name: 'foo',
    type: 'tuple[][1]',
    indexed: true,
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<ParseAbiParameter<'Foo[][1] calldata foo', OptionsWithStructs>>({
    name: 'foo',
    type: 'tuple[][1]',
    components: [{ type: 'address', name: 'bar' }],
  })

  // `${Type} ${NameOrModifier}` format
  assertType<ParseAbiParameter<'string foo'>>({
    type: 'string',
    name: 'foo',
  })
  assertType<ParseAbiParameter<'string indexed'>>({
    type: 'string',
    name: 'indexed', // `Options['AllowIndexed'] extends false` so name is `'indexed'`
  })
  assertType<ParseAbiParameter<'string calldata'>>({
    type: 'string',
  })
  assertType<ParseAbiParameter<'string indexed', OptionsWithIndexed>>({
    type: 'string',
    indexed: true,
  })
  assertType<ParseAbiParameter<'Foo calldata', OptionsWithStructs>>({
    type: 'tuple',
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<ParseAbiParameter<'Foo indexed', OptionsWithStructs>>({
    type: 'tuple',
    indexed: true,
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<ParseAbiParameter<'Foo[][1] foo', OptionsWithStructs>>({
    name: 'foo',
    type: 'tuple[][1]',
    components: [{ type: 'address', name: 'bar' }],
  })

  // `${Type}` format
  assertType<ParseAbiParameter<'string'>>({
    type: 'string',
  })
  assertType<ParseAbiParameter<'Foo', OptionsWithStructs>>({
    type: 'tuple',
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<ParseAbiParameter<'Foo[][1]', OptionsWithStructs>>({
    type: 'tuple[][1]',
    components: [{ type: 'address', name: 'bar' }],
  })
})

test('ParseParams', () => {
  assertType<ParseParams<''>>([])
  assertType<ParseParams<'string'>>(['string'])
  assertType<ParseParams<'string indexed foo'>>(['string indexed foo'])
  assertType<ParseParams<'string foo, string bar'>>([
    'string foo',
    'string bar',
  ])
  assertType<
    ParseParams<'address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId'>
  >([
    'address owner',
    '(bool loading, (string[][] names) cats)[] dog',
    'uint tokenId',
  ])
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Result = ParseAbi<
  // ^?
  [
    'event Foo(Foo indexed)',
    'error Foo()',
    'event Foo(address indexed bar)',
    'struct Name { address bar; }',
    'struct Foo { Name name; }',

    'function foo()',
    // basic
    'function foo() returns (uint256)',
    'function foo() view',
    'function foo() public',
    // combinations
    'function foo() view returns (uint256)',
    'function foo() public view',
    'function foo() public view returns (uint256)',
    // params
    'function foo(uint256, uint256)',
    'function foo(uint256) returns (uint256)',
    'function foo(uint256) view',
    'function foo(uint256) public',
    'function foo(uint256) view returns (uint256)',
    'function foo(uint256) public view',
    'function foo(uint256) public view returns (uint256)',

    'constructor(address bar)',
    'fallback()',
    'receive() external payable',
  ]
>
