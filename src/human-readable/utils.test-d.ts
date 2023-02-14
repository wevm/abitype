import { assertType, test } from 'vitest'

import type { ParseAbiParameter, ParseParams, ParseSignature } from './utils'

test('ParseSignature', () => {
  assertType<ParseSignature<'function number((uint256 foo), string bar)'>>({
    type: 'function',
    name: 'number',
    inputs: ['(uint256 foo)', 'string bar'],
    outputs: [],
    stateMutability: 'nonpayable',
  })
  assertType<
    ParseSignature<'function number() returns ((uint256 foo), string bar)'>
  >({
    type: 'function',
    name: 'number',
    inputs: [],
    outputs: ['(uint256 foo)', 'string bar'],
  })
  assertType<ParseSignature<'constructor((uint256 foo), string bar)'>>({
    type: 'constructor',
    inputs: ['(uint256 foo)', 'string bar'],
  })
  assertType<ParseSignature<'fallback()'>>({
    type: 'fallback',
  })
  assertType<ParseSignature<'receive() external payable'>>({
    type: 'receive',
    stateMutability: 'payable',
  })
})

test('ParseParams', () => {
  assertType<
    ParseParams<'address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId'>
  >([
    'address owner',
    '(bool loading, (string[][] names) cats)[] dog',
    'uint tokenId',
  ])
})

test('ParseAbiParameter', () => {
  assertType<ParseAbiParameter<'string'>>({ type: 'string' })
  assertType<ParseAbiParameter<'(string foo)'>>({ type: '(string foo)' })
  assertType<ParseAbiParameter<'(string foo)[]'>>({ type: '(string foo)[]' })
  assertType<ParseAbiParameter<'(string foo)[10]'>>({
    type: '(string foo)[10]',
  })
  assertType<ParseAbiParameter<'(string foo)[10][]'>>({
    type: '(string foo)[10][]',
  })
  assertType<ParseAbiParameter<'(string foo)[][10]'>>({
    type: '(string foo)[][10]',
  })
  assertType<ParseAbiParameter<'(string foo)[][10][]'>>({
    type: '(string foo)[][10][]',
  })
  assertType<ParseAbiParameter<'((string foo))'>>({ type: '((string foo))' })
  assertType<ParseAbiParameter<'(string foo, address baz)'>>({
    type: '(string foo, address baz)',
  })

  assertType<ParseAbiParameter<'string foo'>>({ type: 'string', name: 'foo' })
  assertType<ParseAbiParameter<'(string bar) foo'>>({
    type: '(string bar)',
    name: 'foo',
  })
  assertType<ParseAbiParameter<'(string bar)[] foo'>>({
    type: '(string bar)[]',
    name: 'foo',
  })
  assertType<ParseAbiParameter<'((string bar)) foo'>>({
    type: '((string bar))',
    name: 'foo',
  })
  assertType<ParseAbiParameter<'(string bar, address baz) foo'>>({
    type: '(string bar, address baz)',
    name: 'foo',
  })

  assertType<ParseAbiParameter<'string indexed foo'>>({
    type: 'string',
    name: 'foo',
    indexed: true,
  })
  assertType<ParseAbiParameter<'(string bar) indexed foo'>>({
    type: '(string bar)',
    name: 'foo',
    indexed: true,
  })
  assertType<ParseAbiParameter<'((string bar)) indexed foo'>>({
    type: '((string bar))',
    name: 'foo',
    indexed: true,
  })
  assertType<ParseAbiParameter<'(string bar, address baz) indexed foo'>>({
    type: '(string bar, address baz)',
    name: 'foo',
    indexed: true,
  })
})

// test('ParseAbiParameter', () => {
//   assertType<ParseAbiParameter<'string foo'>>({ type: 'string', name: 'foo' })
//   assertType<ParseAbiParameter<'string indexed foo'>>({
//     type: 'string',
//     name: 'foo',
//     indexed: true,
//   })
//   assertType<ParseAbiParameter<'string indexed'>>({
//     type: 'string',
//     indexed: true,
//     name: '',
//   })
//   assertType<ParseAbiParameter<'string'>>({ type: 'string', name: '' })

//   assertType<ParseAbiParameter<'string foo bar baz'>>({
//     type: 'string',
//     name: 'Error: "foo bar baz" contains whitespace"',
//   })
//   assertType<ParseAbiParameter<'string indexed foo bar baz'>>({
//     type: 'string',
//     indexed: true,
//     name: 'Error: "foo bar baz" contains whitespace"',
//   })

//   assertType<
//     ParseAbiParameter<
//       'Name foo',
//       {
//         Name: [{ type: 'string'; name: 'bar' }]
//       }
//     >
//   >({
//     type: 'tuple',
//     name: 'foo',
//     components: [{ type: 'string', name: 'bar' }],
//     internalType: 'struct Name',
//   })
// })

// test('ParseAbiParameters', () => {
//   assertType<ParseAbiParameters<'string foo'>>([
//     { type: 'string', name: 'foo' },
//   ])
//   assertType<ParseAbiParameters<'string foo, string bar'>>([
//     { type: 'string', name: 'foo' },
//     { type: 'string', name: 'bar' },
//   ])
//   assertType<
//     ParseAbiParameters<
//       'string foo, Bar bar',
//       {
//         Bar: [{ type: 'string'; name: 'foo' }, { type: 'string'; name: 'bar' }]
//       }
//     >
//   >([
//     { type: 'string', name: 'foo' },
//     {
//       type: 'tuple',
//       name: 'bar',
//       components: [
//         { type: 'string', name: 'foo' },
//         { type: 'string', name: 'bar' },
//       ],
//     },
//   ])
//   assertType<ParseAbiParameters<'string foo, Bar bar'>>([
//     { type: 'string', name: 'foo' },
//     {
//       type: 'Error: Unknown type "Bar"',
//       name: 'bar',
//     },
//   ])
// })

// test('ParseAbi', () => {
//   type Result = ParseAbi<
//     // ^?
//     [
//       'struct Name { string first; string last; }',
//       'struct Person { Name name; uint16 age; }',
//       'function number() returns (uint256)',
//       'function setNumber(uint256 value)',
//       'function addPerson(Person person)',
//     ]
//   >
//   assertType<Result>([
//     {
//       type: 'function',
//       name: 'number',
//       inputs: [],
//       outputs: [{ type: 'uint256', name: '' }],
//       stateMutability: 'nonpayable',
//     },
//     {
//       type: 'function',
//       name: 'setNumber',
//       inputs: [{ type: 'uint256', name: 'value' }],
//       outputs: [],
//       stateMutability: 'nonpayable',
//     },
//     {
//       type: 'function',
//       name: 'addPerson',
//       inputs: [
//         {
//           type: 'tuple',
//           name: 'person',
//           components: [
//             {
//               type: 'tuple',
//               name: 'name',
//               components: [
//                 { type: 'string', name: 'first' },
//                 { type: 'string', name: 'last' },
//               ],
//             },
//             { type: 'uint16', name: 'age' },
//           ],
//         },
//       ],
//       outputs: [],
//       stateMutability: 'nonpayable',
//     },
//   ])
// })
