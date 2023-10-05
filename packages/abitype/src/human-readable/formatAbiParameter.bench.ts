import { ParamType as ParamTypeV5 } from '@ethersproject/abi'
import { ParamType } from 'ethers'
import { bench, describe } from 'vitest'

import { formatAbiParameter } from './formatAbiParameter.js'

describe('Format basic ABI Parameter', () => {
  const basic = { type: 'address', name: 'foo' }

  bench('abitype', () => {
    formatAbiParameter(basic)
  })

  bench('ethers@6', () => {
    ParamType.from(basic).format('minimal')
  })

  bench('ethers@5', () => {
    ParamTypeV5.from(basic).format('minimal')
  })
})

describe('Format inline tuple ABI Parameter', () => {
  const inlineTuple = {
    type: 'tuple',
    components: [
      { type: 'string', name: 'bar' },
      { type: 'string', name: 'baz' },
    ],
    name: 'foo',
  }

  bench('abitype', () => {
    formatAbiParameter(inlineTuple)
  })

  bench('ethers@6', () => {
    ParamType.from(inlineTuple).format('minimal')
  })

  bench('ethers@5', () => {
    ParamTypeV5.from(inlineTuple).format('minimal')
  })
})
