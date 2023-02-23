import { expect, test } from 'vitest'

import {
  execConstructorSignature,
  execErrorSignature,
  execEventSignature,
  execFunctionSignature,
  execStructSignature,
  isConstructorSignature,
  isErrorSignature,
  isEventSignature,
  isFallbackSignature,
  isFunctionSignature,
  isReceiveSignature,
  isStructSignature,
} from './signatures'

test('isErrorSignature', () => {
  expect(isErrorSignature('error Name(string)')).toMatchInlineSnapshot('true')
  expect(isErrorSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
})

test('execErrorSignature', () => {
  expect(execErrorSignature('error Name(string)')).toMatchInlineSnapshot(`
    {
      "name": "Name",
      "parameters": "string",
    }
  `)
  expect(execErrorSignature('function name(string)')).toMatchInlineSnapshot(
    'undefined',
  )
})

test('isEventSignature', () => {
  expect(isEventSignature('event Name(string)')).toMatchInlineSnapshot('true')
  expect(isEventSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
})

test('execEventSignature', () => {
  expect(execEventSignature('event Name(string)')).toMatchInlineSnapshot(`
    {
      "name": "Name",
      "parameters": "string",
    }
  `)
  expect(execEventSignature('event Name(string indexed foo)'))
    .toMatchInlineSnapshot(`
      {
        "name": "Name",
        "parameters": "string indexed foo",
      }
    `)
  expect(execEventSignature('function name(string)')).toMatchInlineSnapshot(
    'undefined',
  )
})

test('isFunctionSignature', () => {
  expect(isFunctionSignature('function name(string)')).toMatchInlineSnapshot(
    'true',
  )
  expect(isFunctionSignature('struct Name { string; }')).toMatchInlineSnapshot(
    'false',
  )
})

test('execFunctionSignature', () => {
  expect(execFunctionSignature('function name(string)')).toMatchInlineSnapshot(`
    {
      "name": "name",
      "parameters": "string",
      "returns": undefined,
      "scope": undefined,
      "stateMutability": undefined,
    }
  `)
  expect(
    execFunctionSignature('struct Name { string; }'),
  ).toMatchInlineSnapshot('undefined')
})

test('isStructSignature', () => {
  expect(isStructSignature('struct Name { string; }')).toMatchInlineSnapshot(
    'true',
  )
  expect(isStructSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
})

test('execStructSignature', () => {
  expect(execStructSignature('struct Name { string; }')).toMatchInlineSnapshot(`
    {
      "name": "Name",
      "properties": " string; ",
    }
  `)
  expect(execStructSignature('function name(string)')).toMatchInlineSnapshot(
    'undefined',
  )
})

test('isConstructorSignature', () => {
  expect(isConstructorSignature('constructor(string)')).toMatchInlineSnapshot(
    'false',
  )
  expect(isConstructorSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
})

test('execConstructorSignature', () => {
  expect(execConstructorSignature('constructor(string)')).toMatchInlineSnapshot(
    'undefined',
  )
  expect(
    execConstructorSignature('function name(string)'),
  ).toMatchInlineSnapshot('undefined')
})

test('isFallbackSignature', () => {
  expect(isFallbackSignature('fallback()')).toMatchInlineSnapshot('true')
  expect(isFallbackSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
})

test('isReceiveSignature', () => {
  expect(
    isReceiveSignature('receive() external payable'),
  ).toMatchInlineSnapshot('true')
  expect(isReceiveSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
})
