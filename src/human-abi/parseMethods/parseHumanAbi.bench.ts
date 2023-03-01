import { Interface as InterfaceV5 } from '@ethersproject/abi'
import { Interface } from 'ethers'
import { bench, describe } from 'vitest'

import { parseHumanAbi } from './parseHumanAbi'
import { parseHumanAbiSignatures } from './parseHumanAbiSignature'

describe('Parse ABI', () => {
  bench('Signatures one by one', () => {
    parseHumanAbiSignatures([
      'struct Foo { string name; uint256 age;}',
      'function name(Foo foo, uint256 tokenId)',
      'event Foo(address indexed bar)',
    ])
  })

  bench('All at once', () => {
    parseHumanAbiSignatures([
      'function name((string name, uint256 age) foo, uint256 tokenId)',
      'event Foo(address indexed bar)',
    ])
  })

  bench('With structs', () => {
    parseHumanAbi([
      'struct Foo {string name; uint256 age;}',
      'function name(Foo foo, uint256 tokenId)',
      'event Foo(address indexed bar)',
    ])
  })

  bench('With struct all at once', () => {
    parseHumanAbi([
      'function name((string name, uint256 age) foo, uint256 tokenId)',
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
