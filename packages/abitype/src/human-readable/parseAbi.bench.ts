import { Interface as InterfaceV5 } from '@ethersproject/abi'
import { Interface } from 'ethers'
import { bench, describe } from 'vitest'

import { parseAbi } from './parseAbi.js'

describe('Parse ABI', () => {
  bench('abitype', () => {
    parseAbi([
      'function name((string name, uint256 age) foo, uint256 tokenId)',
      'event Foo(address indexed bar)',
    ])
  })

  bench('abitype (struct)', () => {
    parseAbi([
      'struct Foo { string name; uint256 age }',
      'function name(Foo foo, uint256 tokenId)',
      'event Foo(address indexed bar)',
    ])
  })

  bench('ethers@5', () => {
    new InterfaceV5([
      'function name((string name, uint256 age) foo, uint256 tokenId)',
      'event Foo(address indexed bar)',
    ]).fragments
  })

  bench('ethers@6', () => {
    new Interface([
      'function name((string name, uint256 age) foo, uint256 tokenId)',
      'event Foo(address indexed bar)',
    ]).fragments
  })
})
