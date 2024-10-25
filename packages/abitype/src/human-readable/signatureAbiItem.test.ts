import { expect, test } from 'vitest'
import { signatureAbiItem } from './signatureAbiItem.js'

test.each([
  {
    signature: signatureAbiItem({
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ type: 'address' }, { type: 'address' }],
      outputs: [{ name: 'balance', type: 'uint256' }],
    }),
    expected: 'balanceOf(address,address)',
  },
  {
    signature: signatureAbiItem({
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ type: 'address' }],
      outputs: [{ name: 'balance', type: 'uint256' }],
    }),
    expected: 'balanceOf(address)',
  },
  {
    signature: signatureAbiItem({
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: 'balance', type: 'uint256' }],
    }),
    expected: 'balanceOf()',
  },
  {
    signature: signatureAbiItem({
      type: 'function',
      name: 'foo',
      stateMutability: 'view',
      inputs: [
        {
          type: 'tuple',
          name: 'config',
          components: [
            { type: 'uint16', name: '' },
            { type: 'bool', name: '' },
          ],
        },
      ],
      outputs: [],
    }),
    expected: 'foo((uint16,bool))',
  },
  {
    signature: signatureAbiItem({
      type: 'function',
      name: 'foo',
      stateMutability: 'view',
      inputs: [
        {
          type: 'tuple[]',
          name: 'config',
          components: [
            { type: 'uint16', name: '' },
            { type: 'bool', name: '' },
          ],
        },
      ],
      outputs: [],
    }),
    expected: 'foo((uint16,bool)[])',
  },
])('signatureAbiItem: function', (t) => {
  expect(t.signature).toEqual(t.expected)
})

test.each([
  {
    signature: signatureAbiItem({
      name: 'foo',
      type: 'event',
      inputs: [{ type: 'uint256' }, { type: 'uint256' }],
    }),
    expected: 'foo(uint256,uint256)',
  },
  {
    signature: signatureAbiItem({
      name: 'foo',
      type: 'event',
      inputs: [{ type: 'uint256' }],
    }),
    expected: 'foo(uint256)',
  },
  {
    signature: signatureAbiItem({
      name: 'foo',
      type: 'event',
      inputs: [],
    }),
    expected: 'foo()',
  },
  {
    signature: signatureAbiItem({
      name: 'foo',
      type: 'event',
      inputs: [{ type: 'tuple', components: [{ type: 'uint256' }] }],
    }),
    expected: 'foo((uint256))',
  },
  {
    signature: signatureAbiItem({
      name: 'foo',
      type: 'event',
      inputs: [{ type: 'tuple[]', components: [{ type: 'uint256' }] }],
    }),
    expected: 'foo((uint256)[])',
  },
])('signatureAbiItem: event', (t) => {
  expect(t.signature).toEqual(t.expected)
})
