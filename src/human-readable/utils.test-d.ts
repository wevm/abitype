import { assertType, test } from 'vitest'

import type { ParseAbi, ParseAbiParameter, ParseAbiParameters } from './utils'

test('ParseAbiParameter', () => {
  assertType<ParseAbiParameter<'string foo'>>({ type: 'string', name: 'foo' })
  assertType<ParseAbiParameter<'string indexed foo'>>({
    type: 'string',
    name: 'foo',
    indexed: true,
  })
  assertType<ParseAbiParameter<'string indexed'>>({
    type: 'string',
    indexed: true,
    name: '',
  })
  assertType<ParseAbiParameter<'string'>>({ type: 'string', name: '' })

  assertType<ParseAbiParameter<'string foo bar baz'>>({
    type: 'string',
    name: 'Error: "foo bar baz" contains whitespace"',
  })
  assertType<ParseAbiParameter<'string indexed foo bar baz'>>({
    type: 'string',
    indexed: true,
    name: 'Error: "foo bar baz" contains whitespace"',
  })

  assertType<
    ParseAbiParameter<
      'Name foo',
      {
        Name: [{ type: 'string'; name: 'bar' }]
      }
    >
  >({
    type: 'tuple',
    name: 'foo',
    components: [{ type: 'string', name: 'bar' }],
    internalType: 'struct Name',
  })
})

test('ParseAbiParameters', () => {
  assertType<ParseAbiParameters<'string foo'>>([
    { type: 'string', name: 'foo' },
  ])
  assertType<ParseAbiParameters<'string foo, string bar'>>([
    { type: 'string', name: 'foo' },
    { type: 'string', name: 'bar' },
  ])
  assertType<
    ParseAbiParameters<
      'string foo, Bar bar',
      {
        Bar: [{ type: 'string'; name: 'foo' }, { type: 'string'; name: 'bar' }]
      }
    >
  >([
    { type: 'string', name: 'foo' },
    {
      type: 'tuple',
      name: 'bar',
      components: [
        { type: 'string', name: 'foo' },
        { type: 'string', name: 'bar' },
      ],
    },
  ])
  assertType<ParseAbiParameters<'string foo, Bar bar'>>([
    { type: 'string', name: 'foo' },
    {
      type: 'Error: Unknown type "Bar"',
      name: 'bar',
    },
  ])
})

test('ParseAbi', () => {
  type Result = ParseAbi<
    // ^?
    [
      'struct Name { string first; string last; }',
      'struct Person { Name name; uint16 age; }',
      'function number() returns (uint256)',
      'function setNumber(uint256 value)',
      'function addPerson(Person person)',
    ]
  >
  assertType<Result>([
    {
      type: 'function',
      name: 'number',
      inputs: [],
      outputs: [{ type: 'uint256', name: '' }],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'setNumber',
      inputs: [{ type: 'uint256', name: 'value' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'addPerson',
      inputs: [
        {
          type: 'tuple',
          name: 'person',
          components: [
            {
              type: 'tuple',
              name: 'name',
              components: [
                { type: 'string', name: 'first' },
                { type: 'string', name: 'last' },
              ],
            },
            { type: 'uint16', name: 'age' },
          ],
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ])
})
