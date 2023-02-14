import { assertType, test } from 'vitest'

import type { ParseAbiStateMutability, ParseFunction } from './functions'

test('ParseAbiStateMutability', () => {
  assertType<ParseAbiStateMutability<'function foo()'>>('nonpayable')
  assertType<
    ParseAbiStateMutability<'function    foo   (uint256[]     memory x) external view returns (address)'>
  >('view')
})

test('ParseFunction', () => {
  assertType<ParseFunction<'function foo (string foo)'>>({
    name: 'foo',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string', name: 'foo' }],
    outputs: [],
  })

  assertType<ParseFunction<'function foo (string foo) returns ()'>>({
    name: 'foo',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ type: 'string', name: 'foo' }],
    outputs: [],
  })

  assertType<
    ParseFunction<'function foo (string foo) external view returns (string bar)'>
  >({
    name: 'foo',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'string', name: 'foo' }],
    outputs: [{ type: 'string', name: 'bar' }],
  })

  assertType<
    ParseFunction<'constructor(address owner, address treasuryConfiguration, uint256 maxLimit, bool guardOn)'>
  >({
    type: 'constructor',
    inputs: [
      { name: 'owner', type: 'address' },
      {
        name: 'treasuryConfiguration',
        type: 'address',
      },
      { name: 'maxLimit', type: 'uint256' },
      { name: 'guardOn', type: 'bool' },
    ],
  })

  assertType<ParseFunction<'fallback()'>>({
    type: 'fallback',
  })

  assertType<ParseFunction<'receive() external payable'>>({
    type: 'receive',
    stateMutability: 'payable',
  })
})
