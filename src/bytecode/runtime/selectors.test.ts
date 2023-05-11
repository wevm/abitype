import { customBytecode, wethBytecode } from '../../test/bytecodes.js'
import { resolvedEvents } from './defaults.js'
import { resolvedErrors } from './defaults.js'
import { resolvedFunctions } from './defaults.js'
import { parseErrorSelector } from './selectors.js'
import { parseErrorSelectors } from './selectors.js'
import {
  parseEventSelector,
  parseEventSelectors,
  parseFunctionSelector,
  parseFunctionSelectors,
} from './selectors.js'
import { describe, expect, test } from 'vitest'

describe('Parse selector/s', () => {
  test('parse function selector', () => {
    expect(parseFunctionSelector('0x06fdde03')).toMatchInlineSnapshot(`
      {
        "inputs": [],
        "name": "0x06fdde03",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `)
  })

  test('parse function selector with resolved selector', () => {
    expect(
      parseFunctionSelector('0x06fdde03', resolvedFunctions.get('0x06fdde03')),
    ).toMatchInlineSnapshot(`
      {
        "inputs": [],
        "name": "name",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `)
  })

  test('parse function selectors', () => {
    expect(parseFunctionSelectors(wethBytecode)).toMatchInlineSnapshot(`
      [
        {
          "inputs": [],
          "name": "0x06fdde03",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0x095ea7b3",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0x18160ddd",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0x23b872dd",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0x2e1a7d4d",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0x313ce567",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0x70a08231",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0x95d89b41",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0xa9059cbb",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0xd0e30db0",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
        {
          "inputs": [],
          "name": "0xdd62ed3e",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
        },
      ]
    `)
  })

  test('parse event selector', () => {
    expect(parseFunctionSelector('0xddf252ad')).toMatchInlineSnapshot(`
      {
        "inputs": [],
        "name": "0xddf252ad",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function",
      }
    `)
  })

  test('parse event selector with resolved selector', () => {
    expect(
      parseEventSelector('0xddf252ad', resolvedEvents.get('0xddf252ad')),
    ).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "type": "address",
          },
          {
            "type": "address",
          },
          {
            "type": "uint256",
          },
        ],
        "name": "Transfer",
        "type": "event",
      }
    `)
  })

  test('parse event selectors', () => {
    expect(parseEventSelectors(wethBytecode)).toMatchInlineSnapshot(`
      [
        {
          "inputs": [],
          "name": "0xe1fffcc4",
          "type": "event",
        },
        {
          "inputs": [],
          "name": "0x8c5be1e5",
          "type": "event",
        },
        {
          "inputs": [],
          "name": "0xddf252ad",
          "type": "event",
        },
        {
          "inputs": [],
          "name": "0x7fcf532c",
          "type": "event",
        },
      ]
    `)
  })
  test('parse event selector', () => {
    expect(parseEventSelector('0xddf252ad')).toMatchInlineSnapshot(`
      {
        "inputs": [],
        "name": "0xddf252ad",
        "type": "event",
      }
    `)
  })

  test('parse event selector with resolved selector', () => {
    expect(
      parseEventSelector('0xddf252ad', resolvedEvents.get('0xddf252ad')),
    ).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "type": "address",
          },
          {
            "type": "address",
          },
          {
            "type": "uint256",
          },
        ],
        "name": "Transfer",
        "type": "event",
      }
    `)
  })

  test('parse event selectors', () => {
    expect(parseEventSelectors(wethBytecode)).toMatchInlineSnapshot(`
      [
        {
          "inputs": [],
          "name": "0xe1fffcc4",
          "type": "event",
        },
        {
          "inputs": [],
          "name": "0x8c5be1e5",
          "type": "event",
        },
        {
          "inputs": [],
          "name": "0xddf252ad",
          "type": "event",
        },
        {
          "inputs": [],
          "name": "0x7fcf532c",
          "type": "event",
        },
      ]
    `)
  })

  test('parse event selector', () => {
    expect(parseErrorSelector('0x30cd7471')).toMatchInlineSnapshot(`
      {
        "inputs": [],
        "name": "0x30cd7471",
        "type": "error",
      }
    `)
  })

  test('parse error selector with resolved selector', () => {
    expect(
      parseErrorSelector('0x30cd7471', resolvedErrors.get('0x30cd7471')),
    ).toMatchInlineSnapshot(`
      {
        "inputs": [],
        "name": "NotOwner",
        "type": "error",
      }
    `)
  })

  test('parse error selectors', () => {
    expect(parseErrorSelectors(customBytecode)).toMatchInlineSnapshot(`
      [
        {
          "inputs": [],
          "name": "0x30cd7471",
          "type": "error",
        },
        {
          "inputs": [],
          "name": "0x2e522d00",
          "type": "error",
        },
      ]
    `)
  })
})
