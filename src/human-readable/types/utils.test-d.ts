import { assertType, expectTypeOf, test } from 'vitest'

import type {
  ParseAbiParameter,
  ParseAbiParameters,
  ParseSignature,
  SplitParameters,
  _ParseFunctionParametersAndStateMutability,
  _ParseTuple,
  _SplitNameOrModifier,
  _UnwrapNameOrModifier,
} from './utils'

type OptionsWithModifier = { Modifier: 'calldata'; Structs: unknown }
type OptionsWithIndexed = { Modifier: 'indexed'; Structs: unknown }
type OptionsWithStructs = {
  Structs: {
    Foo: [{ type: 'address'; name: 'bar' }]
  }
}

test('ParseSignature', () => {
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
  assertType<ParseSignature<'event Foo((string) indexed bar)'>>({
    type: 'event',
    name: 'Foo',
    inputs: [
      {
        type: 'tuple',
        indexed: true,
        name: 'bar',
        components: [{ type: 'string' }],
      },
    ],
  })

  // Constructor
  assertType<ParseSignature<'constructor()'>>({
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [],
  })
  assertType<ParseSignature<'constructor(string)'>>({
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string' }],
  })
  assertType<ParseSignature<'constructor(string foo)'>>({
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string', name: 'foo' }],
  })
  assertType<ParseSignature<'constructor(string foo)'>>({
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string', name: 'foo' }],
  })
  assertType<ParseSignature<'constructor((string) foo)'>>({
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'tuple', name: 'foo', components: [{ type: 'string' }] }],
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

  // Functions
  assertType<ParseSignature<'function foo()'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  })

  // inputs
  assertType<ParseSignature<'function foo(string)'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string' }],
    outputs: [],
  })
  assertType<ParseSignature<'function foo(string bar)'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string', name: 'bar' }],
    outputs: [],
  })
  assertType<ParseSignature<'function foo(Baz bar)', Structs>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [
      {
        type: 'tuple',
        name: 'bar',
        components: [{ type: 'address', name: 'baz' }],
      },
    ],
    outputs: [],
  })
  assertType<ParseSignature<'function foo(string bar) view'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'view',
    inputs: [{ type: 'string', name: 'bar' }],
    outputs: [],
  })
  assertType<ParseSignature<'function foo(string bar) public payable'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'payable',
    inputs: [{ type: 'string', name: 'bar' }],
    outputs: [],
  })
  assertType<ParseSignature<'function foo(string calldata)'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string' }],
    outputs: [],
  })

  // outputs
  assertType<ParseSignature<'function foo() returns (string)'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ type: 'string' }],
  })
  assertType<ParseSignature<'function foo() returns (string bar)'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [{ type: 'string', name: 'bar' }],
  })
  assertType<ParseSignature<'function foo() returns (Baz bar)', Structs>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [
      {
        type: 'tuple',
        name: 'bar',
        components: [{ type: 'address', name: 'baz' }],
      },
    ],
  })
  assertType<ParseSignature<'function foo() view returns (string bar)'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'string', name: 'bar' }],
  })
  assertType<
    ParseSignature<'function foo() public payable returns (string bar)'>
  >({
    type: 'function',
    name: 'foo',
    stateMutability: 'payable',
    inputs: [],
    outputs: [{ type: 'string', name: 'bar' }],
  })

  // inputs and outputs
  assertType<ParseSignature<'function foo(string) returns (string)'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string' }],
    outputs: [{ type: 'string' }],
  })
  assertType<ParseSignature<'function foo(string bar) returns (string bar)'>>({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string', name: 'bar' }],
    outputs: [{ type: 'string', name: 'bar' }],
  })
  assertType<
    ParseSignature<'function foo(Baz bar) returns (Baz bar)', Structs>
  >({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [
      {
        type: 'tuple',
        name: 'bar',
        components: [{ type: 'address', name: 'baz' }],
      },
    ],
    outputs: [
      {
        type: 'tuple',
        name: 'bar',
        components: [{ type: 'address', name: 'baz' }],
      },
    ],
  })
  assertType<
    ParseSignature<'function foo(string bar) view returns (string bar)'>
  >({
    type: 'function',
    name: 'foo',
    stateMutability: 'view',
    inputs: [{ type: 'string', name: 'bar' }],
    outputs: [{ type: 'string', name: 'bar' }],
  })
  assertType<
    ParseSignature<'function foo(string bar) public payable returns (string bar)'>
  >({
    type: 'function',
    name: 'foo',
    stateMutability: 'payable',
    inputs: [{ type: 'string', name: 'bar' }],
    outputs: [{ type: 'string', name: 'bar' }],
  })

  assertType<
    ParseSignature<'function foo(((string)) calldata) returns (string, (string))'>
  >({
    type: 'function',
    name: 'foo',
    stateMutability: 'nonpayable',
    inputs: [
      {
        type: 'tuple',
        components: [{ type: 'tuple', components: [{ type: 'string' }] }],
      },
    ],
    outputs: [
      {
        type: 'string',
      },
      {
        type: 'tuple',
        components: [{ type: 'string' }],
      },
    ],
  })
})

test('ParseAbiParameters', () => {
  expectTypeOf<ParseAbiParameters<[]>>().toEqualTypeOf<readonly []>()
  expectTypeOf<ParseAbiParameters<['']>>().toEqualTypeOf<readonly []>()
  expectTypeOf<ParseAbiParameters<['string']>>().toEqualTypeOf<
    readonly [{ readonly type: 'string' }]
  >()
  expectTypeOf<ParseAbiParameters<['string', 'string']>>().toEqualTypeOf<
    readonly [{ readonly type: 'string' }, { readonly type: 'string' }]
  >()
})

test('ParseAbiParameter', () => {
  // `${Type} ${Modifier} ${Name}` format
  assertType<ParseAbiParameter<'string calldata foo', OptionsWithModifier>>({
    type: 'string',
    name: 'foo',
  })
  assertType<ParseAbiParameter<'string indexed foo', OptionsWithIndexed>>({
    type: 'string',
    indexed: true,
    name: 'foo',
  })
  assertType<
    ParseAbiParameter<
      'Foo calldata foo',
      OptionsWithModifier & OptionsWithStructs
    >
  >({
    type: 'tuple',
    name: 'foo',
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<
    ParseAbiParameter<
      'Foo indexed foo',
      OptionsWithIndexed & OptionsWithStructs
    >
  >({
    type: 'tuple',
    indexed: true,
    name: 'foo',
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<
    ParseAbiParameter<
      'Foo[][1] indexed foo',
      OptionsWithIndexed & OptionsWithStructs
    >
  >({
    name: 'foo',
    type: 'tuple[][1]',
    indexed: true,
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<
    ParseAbiParameter<
      'Foo[][1] calldata foo',
      OptionsWithModifier & OptionsWithStructs
    >
  >({
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
    name: 'indexed',
  })
  assertType<ParseAbiParameter<'string calldata', OptionsWithModifier>>({
    type: 'string',
  })
  assertType<ParseAbiParameter<'string indexed', OptionsWithIndexed>>({
    type: 'string',
    indexed: true,
  })
  assertType<
    ParseAbiParameter<'Foo calldata', OptionsWithModifier & OptionsWithStructs>
  >({
    type: 'tuple',
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<
    ParseAbiParameter<'Foo indexed', OptionsWithIndexed & OptionsWithStructs>
  >({
    type: 'tuple',
    indexed: true,
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<ParseAbiParameter<'Foo[][1] foo', OptionsWithStructs>>({
    name: 'foo',
    type: 'tuple[][1]',
    components: [{ type: 'address', name: 'bar' }],
  })
  assertType<ParseAbiParameter<'(address bar)[1] foo', OptionsWithStructs>>({
    name: 'foo',
    type: 'tuple[1]',
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

  // tuple format
  assertType<ParseAbiParameter<'(string)'>>({
    type: 'tuple',
    components: [{ type: 'string' }],
  })
  assertType<ParseAbiParameter<'(string, string)'>>({
    type: 'tuple',
    components: [{ type: 'string' }, { type: 'string' }],
  })
  assertType<ParseAbiParameter<'(string, (string))'>>({
    type: 'tuple',
    components: [
      { type: 'string' },
      { type: 'tuple', components: [{ type: 'string' }] },
    ],
  })
})

test('SplitParameters', () => {
  assertType<SplitParameters<''>>([])
  assertType<SplitParameters<'string'>>(['string'])
  assertType<SplitParameters<'string, string'>>(['string', 'string'])
  assertType<SplitParameters<'string indexed foo'>>(['string indexed foo'])
  assertType<SplitParameters<'string foo, string bar'>>([
    'string foo',
    'string bar',
  ])
  assertType<
    SplitParameters<'address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId'>
  >([
    'address owner',
    '(bool loading, (string[][] names) cats)[] dog',
    'uint tokenId',
  ])
})

test('_ParseFunctionParametersAndStateMutability', () => {
  expectTypeOf<
    _ParseFunctionParametersAndStateMutability<'function foo()'>
  >().toEqualTypeOf<{
    Inputs: ''
    StateMutability: 'nonpayable'
  }>()

  expectTypeOf<
    _ParseFunctionParametersAndStateMutability<'function foo(string bar)'>
  >().toEqualTypeOf<{
    Inputs: 'string bar'
    StateMutability: 'nonpayable'
  }>()

  expectTypeOf<
    _ParseFunctionParametersAndStateMutability<'function foo() view'>
  >().toEqualTypeOf<{
    Inputs: ''
    StateMutability: 'view'
  }>()

  expectTypeOf<
    _ParseFunctionParametersAndStateMutability<'function foo(string bar) view'>
  >().toEqualTypeOf<{
    Inputs: 'string bar'
    StateMutability: 'view'
  }>()
})

test('_ParseTuple', () => {
  // basic tuples
  assertType<_ParseTuple<'(string)'>>({
    type: 'tuple',
    components: [{ type: 'string' }],
  })
  assertType<_ParseTuple<'(string, string)'>>({
    type: 'tuple',
    components: [{ type: 'string' }, { type: 'string' }],
  })
  assertType<_ParseTuple<'((string, string), string)'>>({
    type: 'tuple',
    components: [
      { type: 'tuple', components: [{ type: 'string' }, { type: 'string' }] },
      { type: 'string' },
    ],
  })
  assertType<_ParseTuple<'((string))'>>({
    type: 'tuple',
    components: [{ type: 'tuple', components: [{ type: 'string' }] }],
  })
  assertType<_ParseTuple<'(((string)))'>>({
    type: 'tuple',
    components: [
      {
        type: 'tuple',
        components: [{ type: 'tuple', components: [{ type: 'string' }] }],
      },
    ],
  })
  assertType<_ParseTuple<'(string calldata)'>>({
    type: 'tuple',
    components: [{ type: 'string', name: 'calldata' }],
  })
  assertType<_ParseTuple<'(Foo)', OptionsWithStructs>>({
    type: 'tuple',
    components: [
      { type: 'tuple', components: [{ type: 'address', name: 'bar' }] },
    ],
  })

  // named tuple params
  assertType<_ParseTuple<'(string foo)'>>({
    type: 'tuple',
    components: [{ type: 'string', name: 'foo' }],
  })
  assertType<_ParseTuple<'(string bar) foo'>>({
    name: 'foo',
    type: 'tuple',
    components: [{ type: 'string', name: 'bar' }],
  })
  assertType<_ParseTuple<'((string bar) foo)'>>({
    type: 'tuple',
    components: [
      {
        type: 'tuple',
        name: 'foo',
        components: [{ type: 'string', name: 'bar' }],
      },
    ],
  })
  assertType<_ParseTuple<'(Foo) foo', OptionsWithStructs>>({
    type: 'tuple',
    name: 'foo',
    components: [
      { type: 'tuple', components: [{ type: 'address', name: 'bar' }] },
    ],
  })
  assertType<_ParseTuple<'((string)) calldata', OptionsWithModifier>>({
    type: 'tuple',
    components: [{ type: 'tuple', components: [{ type: 'string' }] }],
  })

  // mixed basic and named tuple params
  assertType<_ParseTuple<'(string, string foo)'>>({
    type: 'tuple',
    components: [{ type: 'string' }, { type: 'string', name: 'foo' }],
  })
  assertType<_ParseTuple<'(string, string bar) foo'>>({
    name: 'foo',
    type: 'tuple',
    components: [{ type: 'string' }, { type: 'string', name: 'bar' }],
  })
  assertType<
    _ParseTuple<'(string baz, string bar) indexed foo', OptionsWithIndexed>
  >({
    name: 'foo',
    type: 'tuple',
    components: [
      { type: 'string', name: 'baz' },
      { type: 'string', name: 'bar' },
    ],
    indexed: true,
  })

  // inline tuples of tuples
  assertType<_ParseTuple<'(string)[]'>>({
    type: 'tuple[]',
    components: [{ type: 'string' }],
  })
  assertType<_ParseTuple<'(string, string)[]'>>({
    type: 'tuple[]',
    components: [{ type: 'string' }, { type: 'string' }],
  })
  assertType<_ParseTuple<'((string))[]'>>({
    type: 'tuple[]',
    components: [{ type: 'tuple', components: [{ type: 'string' }] }],
  })
  assertType<_ParseTuple<'((string)[])[]'>>({
    type: 'tuple[]',
    components: [
      {
        type: 'tuple[]',
        components: [{ type: 'string' }],
      },
    ],
  })

  // inline tuples of tuples with name and/or modifier attached
  assertType<_ParseTuple<'(string)[] foo'>>({
    type: 'tuple[]',
    name: 'foo',
    components: [{ type: 'string' }],
  })
  assertType<_ParseTuple<'(string, string bar)[] foo'>>({
    type: 'tuple[]',
    name: 'foo',
    components: [{ type: 'string' }, { type: 'string', name: 'bar' }],
  })
  assertType<_ParseTuple<'((string baz) bar)[] foo'>>({
    type: 'tuple[]',
    name: 'foo',
    components: [
      {
        type: 'tuple',
        name: 'bar',
        components: [{ type: 'string', name: 'baz' }],
      },
    ],
  })
  assertType<
    _ParseTuple<
      '((string)[])[] indexed foo',
      OptionsWithIndexed & OptionsWithStructs
    >
  >({
    type: 'tuple[]',
    name: 'foo',
    indexed: true,
    components: [
      {
        type: 'tuple[]',
        components: [{ type: 'string' }],
      },
    ],
  })
  assertType<_ParseTuple<'((string) foo)[]'>>({
    type: 'tuple[]',
    components: [
      { type: 'tuple', name: 'foo', components: [{ type: 'string' }] },
    ],
  })
  assertType<_ParseTuple<'(string) indexed bar', OptionsWithIndexed>>({
    type: 'tuple',
    name: 'bar',
    indexed: true,
    components: [{ type: 'string' }],
  })

  assertType<_ParseTuple<'((((string))) bar)'>>({
    type: 'tuple',
    components: [
      {
        name: 'bar',
        type: 'tuple',
        components: [
          {
            type: 'tuple',
            components: [
              {
                type: 'tuple',
                components: [{ type: 'string' }],
              },
            ],
          },
        ],
      },
    ],
  })
  assertType<_ParseTuple<'(((string) baz) bar) foo'>>({
    type: 'tuple',
    name: 'foo',
    components: [
      {
        name: 'bar',
        type: 'tuple',
        components: [
          {
            name: 'baz',
            type: 'tuple',
            components: [{ type: 'string' }],
          },
        ],
      },
    ],
  })
  assertType<_ParseTuple<'((((string) baz)) bar) foo'>>({
    type: 'tuple',
    name: 'foo',
    components: [
      {
        name: 'bar',
        type: 'tuple',
        components: [
          {
            type: 'tuple',
            components: [
              {
                name: 'baz',
                type: 'tuple',
                components: [{ type: 'string' }],
              },
            ],
          },
        ],
      },
    ],
  })

  // Modifiers not converted inside tuples
  assertType<_ParseTuple<'(string indexed)[] foo', OptionsWithIndexed>>({
    type: 'tuple[]',
    name: 'foo',
    components: [{ type: 'string', name: 'indexed' }],
  })
})

test('_SplitNameOrModifier', () => {
  expectTypeOf<_SplitNameOrModifier<'foo'>>().toEqualTypeOf<{
    readonly name: 'foo'
  }>()
  expectTypeOf<
    _SplitNameOrModifier<'indexed foo', { Modifier: 'indexed' }>
  >().toEqualTypeOf<{
    readonly name: 'foo'
    readonly indexed: true
  }>()
  expectTypeOf<
    _SplitNameOrModifier<'calldata foo', { Modifier: 'calldata' }>
  >().toEqualTypeOf<{
    readonly name: 'foo'
  }>()
})

test('_UnwrapNameOrModifier', () => {
  expectTypeOf<_UnwrapNameOrModifier<'bar) foo'>>().toEqualTypeOf<{
    End: 'bar'
    NameOrModifier: 'foo'
  }>()
  expectTypeOf<_UnwrapNameOrModifier<'baz) bar) foo'>>().toEqualTypeOf<{
    End: 'baz) bar'
    NameOrModifier: 'foo'
  }>()
  expectTypeOf<_UnwrapNameOrModifier<'string) calldata foo'>>().toEqualTypeOf<{
    End: 'string'
    NameOrModifier: 'calldata foo'
  }>()
})
