import { Fragment as FragmentV5 } from '@ethersproject/abi'
import { Fragment } from 'ethers'
import { bench, describe } from 'vitest'

import { formatAbiItem } from './formatAbiItem.js'

describe('Format basic ABI function', () => {
  const basic = {
    type: 'function',
    name: 'foo',
    inputs: [
      {
        type: 'string',
        name: 'bar',
      },
      {
        type: 'string',
        name: 'baz',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  } as const

  bench('abitype', () => {
    formatAbiItem(basic)
  })

  bench('ethers@6', () => {
    Fragment.from(basic).format('minimal')
  })

  bench('ethers@5', () => {
    FragmentV5.from(basic).format('minimal')
  })
})
