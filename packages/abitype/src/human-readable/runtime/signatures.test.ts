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
} from './signatures.js'

test('isErrorSignature', () => {
  expect(isErrorSignature('error Name(string)')).toMatchInlineSnapshot('true')
  expect(isErrorSignature('error $(string)')).toMatchInlineSnapshot('true')
  expect(isErrorSignature('error $_a9(string)')).toMatchInlineSnapshot('true')
  expect(isErrorSignature('error _(string)')).toMatchInlineSnapshot('true')
  expect(isErrorSignature('error abc$_9(string)')).toMatchInlineSnapshot('true')
  expect(isErrorSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
  expect(isErrorSignature('error 9abc(string)')).toMatchInlineSnapshot('false')
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
  expect(isEventSignature('event $(string)')).toMatchInlineSnapshot('true')
  expect(isEventSignature('event $_a9(string)')).toMatchInlineSnapshot('true')
  expect(isEventSignature('event _(string)')).toMatchInlineSnapshot('true')
  expect(isEventSignature('event abc$_9(string)')).toMatchInlineSnapshot('true')
  expect(isEventSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
  expect(isEventSignature('event 9abc(string)')).toMatchInlineSnapshot('false')
})

test('execEventSignature', () => {
  expect(execEventSignature('event Name(string)')).toMatchInlineSnapshot(`
    {
      "name": "Name",
      "parameters": "string",
    }
  `)
  expect(
    execEventSignature('event Name(string indexed foo)'),
  ).toMatchInlineSnapshot(`
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
  expect(
    isFunctionSignature('function name(string) returns (uint256)'),
  ).toMatchInlineSnapshot('true')
  expect(
    isFunctionSignature('function name(string) returns(uint256)'),
  ).toMatchInlineSnapshot('true')
  expect(isFunctionSignature('function $(string)')).toMatchInlineSnapshot(
    'true',
  )
  expect(isFunctionSignature('function $_a9(string)')).toMatchInlineSnapshot(
    'true',
  )
  expect(isFunctionSignature('function _(string)')).toMatchInlineSnapshot(
    'true',
  )
  expect(isFunctionSignature('function abc$_9(string)')).toMatchInlineSnapshot(
    'true',
  )
  expect(isFunctionSignature('struct Name { string; }')).toMatchInlineSnapshot(
    'false',
  )
  expect(isFunctionSignature('function 9abc(string)')).toMatchInlineSnapshot(
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
    execFunctionSignature('function foo() view returns (uint256)'),
  ).toMatchInlineSnapshot(`
    {
      "name": "foo",
      "parameters": "",
      "returns": "uint256",
      "scope": undefined,
      "stateMutability": "view",
    }
  `)
  expect(
    execFunctionSignature('function foo() view returns(uint256)'),
  ).toMatchInlineSnapshot(`
    {
      "name": "foo",
      "parameters": "",
      "returns": "uint256",
      "scope": undefined,
      "stateMutability": "view",
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
  expect(isStructSignature('struct $ { string; }')).toMatchInlineSnapshot(
    'true',
  )
  expect(isStructSignature('struct $_a9 { string; }')).toMatchInlineSnapshot(
    'true',
  )
  expect(isStructSignature('struct _ { string; }')).toMatchInlineSnapshot(
    'true',
  )
  expect(isStructSignature('struct abc$_9 { string; }')).toMatchInlineSnapshot(
    'true',
  )
  expect(isStructSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
  expect(isStructSignature('struct 9abc { string; }')).toMatchInlineSnapshot(
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
    'true',
  )
  expect(isConstructorSignature('function name(string)')).toMatchInlineSnapshot(
    'false',
  )
})

test('execConstructorSignature', () => {
  expect(execConstructorSignature('constructor(string)')).toMatchInlineSnapshot(
    `
    {
      "parameters": "string",
      "stateMutability": undefined,
    }
  `,
  )
  expect(
    execConstructorSignature('constructor(string) payable'),
  ).toMatchInlineSnapshot(
    `
    {
      "parameters": "string",
      "stateMutability": "payable",
    }
  `,
  )
  expect(
    execConstructorSignature('constructor(string) '),
  ).toMatchInlineSnapshot('undefined')
  expect(
    execConstructorSignature('constructor(string) external'),
  ).toMatchInlineSnapshot('undefined')
  expect(
    execConstructorSignature('constructor(string)external'),
  ).toMatchInlineSnapshot('undefined')
  expect(
    execConstructorSignature('function name(string)'),
  ).toMatchInlineSnapshot('undefined')
})

test('isFallbackSignature', () => {
  expect(isFallbackSignature('fallback() external')).toMatchInlineSnapshot(
    'true',
  )
  expect(
    isFallbackSignature('fallback() external payable'),
  ).toMatchInlineSnapshot('true')

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
