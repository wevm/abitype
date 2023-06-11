import { Interface as InterfaceV5 } from '@ethersproject/abi'
import { Interface } from 'ethers'
import { bench, describe } from 'vitest'

import { formatAbi } from './formatAbi.js'
import { parseAbi } from './parseAbi.js'

describe('Format ABI', () => {
  const abi = parseAbi([
    'function name((string name, uint256 age) foo, uint256 tokenId)',
    'event Foo(address indexed bar)',
  ])

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
