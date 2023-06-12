import { Interface as InterfaceV5 } from '@ethersproject/abi'
import { Interface } from 'ethers'
import { bench, describe } from 'vitest'

import { formatAbi } from './formatAbi.js'

describe('Format ABI', () => {
  const abi = [
    {
      type: 'function',
      name: 'name',
      stateMutability: 'nonpayable',
      inputs: [
        {
          type: 'tuple',
          name: 'foo',
          components: [
            { type: 'string', name: 'name' },
            { type: 'uint256', name: 'age' },
          ],
        },
        { type: 'uint256', name: 'tokenId' },
      ],
      outputs: [],
    },
    {
      type: 'event',
      name: 'Foo',
      inputs: [{ type: 'address', name: 'bar', indexed: true }],
    },
  ]

  bench('abitype', () => {
    formatAbi(abi)
  })

  bench('ethers@5', () => {
    new InterfaceV5(abi).format('minimal')
  })

  bench('ethers@6', () => {
    new Interface(abi).format(true)
  })
})
