import { expectTypeOf, test } from 'vitest'

import type { DeepReadonly } from '../utils'
import { parseHumanAbiSignature } from './parseHumanAbiSignature'

test('Parse constructor Signature', () => {
  expectTypeOf(parseHumanAbiSignature('constructor(string hello)'))
    .toEqualTypeOf<
    DeepReadonly<
      [
        {
          type: 'constructor'
          stateMutability: 'nonpayable'
          inputs: [{ internalType: 'string'; name: 'hello'; type: 'string' }]
        },
      ]
    >
  >
})

test('Parse Fallback Signatures', () => {
  expectTypeOf(parseHumanAbiSignature('receive() external payable'))
    .toEqualTypeOf<
    DeepReadonly<[{ type: 'receive'; stateMutability: 'payable' }]>
  >
})

test('Parse Error Signature', () => {
  expectTypeOf(
    parseHumanAbiSignature(
      'error InsufficientBalance(address account, uint balance)',
    ),
  ).toEqualTypeOf<
    DeepReadonly<
      [
        {
          name: 'InsufficientBalance'
          type: 'error'
          inputs: [
            { name: 'account'; type: 'address'; internalType: 'address' },
            { name: 'balance'; type: 'uint256'; internalType: 'uint256' },
          ]
        },
      ]
    >
  >
})

test('Parse Event Signature', () => {
  expectTypeOf(
    parseHumanAbiSignature(
      'event Transfer(address indexed from, address indexed to, address value)',
    ),
  ).toEqualTypeOf<
    DeepReadonly<
      [
        {
          name: 'Transfer'
          type: 'event'
          anonymous: false
          inputs: [
            {
              name: 'from'
              type: 'address'
              internalType: 'address'
              indexed: true
            },
            {
              name: 'to'
              type: 'address'
              internalType: 'address'
              indexed: true
            },
            { name: 'value'; type: 'address'; internalType: 'address' },
          ]
        },
      ]
    >
  >
})

test('Parse Function Signature', () => {
  expectTypeOf(
    parseHumanAbiSignature(
      'function balanceOf(address owner) view returns (uint tokenId)',
    ),
  ).toEqualTypeOf<
    DeepReadonly<
      [
        {
          name: 'balanceOf'
          type: 'function'
          payable: false
          constant: true
          stateMutability: 'view'
          inputs: [{ name: 'owner'; type: 'address'; internalType: 'address' }]
          outputs: [
            { name: 'tokenId'; type: 'uint256'; internalType: 'uint256' },
          ]
        },
      ]
    >
  >
})
