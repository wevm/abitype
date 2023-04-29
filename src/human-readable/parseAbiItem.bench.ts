import { Fragment as FragmentV5 } from '@ethersproject/abi'
import { Fragment } from 'ethers'
import { bench, describe } from 'vitest'

import { parseAbiItem } from './parseAbiItem.js'

describe('Parse basic ABI function', () => {
  const basic = 'function foo(string bar, string baz)'

  bench('abitype', () => {
    parseAbiItem(basic)
  })

  bench('ethers@6', () => {
    Fragment.from(basic)
  })

  bench('ethers@5', () => {
    FragmentV5.from(basic)
  })
})

describe('Parse complex ABI function', () => {
  const basic =
    'function foo(address boo, (string bar, string baz) foo, string test) public view returns ((string bar, string baz) foo, string test)'

  bench('abitype', () => {
    parseAbiItem(basic)
  })

  bench('ethers@6', () => {
    Fragment.from(basic)
  })

  bench('ethers@5', () => {
    FragmentV5.from(basic)
  })
})

describe('Parse ABI event', () => {
  const basic = 'event Foo(address indexed boo)'

  bench('abitype', () => {
    parseAbiItem(basic)
  })

  bench('ethers@6', () => {
    Fragment.from(basic)
  })

  bench('ethers@5', () => {
    FragmentV5.from(basic)
  })
})

describe('comparison', () => {
  bench('abitype', () => {
    parseAbiItem(
      'function name((string name, uint256 age) foo, uint256 tokenId)',
    )
  })

  bench('ethers@5', () => {
    FragmentV5.from(
      'function name(tuple(string name, uint256 age) foo, uint256 tokenId)',
    )
  })

  bench('ethers@6', () => {
    Fragment.from(
      'function name(tuple(string name, uint256 age) foo, uint256 tokenId)',
    )
  })
})
