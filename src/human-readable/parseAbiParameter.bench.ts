import { ParamType as ParamTypeV5 } from '@ethersproject/abi'
import { ParamType } from 'ethers'
import { bench, describe } from 'vitest'

import { parseAbiParameter } from './parseAbiParameter.js'

describe('Parse basic ABI Parameter', () => {
  const basic = 'string foo'

  bench('abitype', () => {
    parseAbiParameter(basic)
  })

  bench('ethers@6', () => {
    ParamType.from(basic)
  })

  bench('ethers@5', () => {
    ParamTypeV5.from(basic)
  })
})

describe('Parse inline tuple ABI Parameter', () => {
  const inlineTuple = '(string bar, string baz) foo'

  bench('abitype', () => {
    parseAbiParameter(inlineTuple)
  })

  bench('ethers@6', () => {
    ParamType.from(inlineTuple)
  })

  bench('ethers@5', () => {
    ParamTypeV5.from(inlineTuple)
  })
})
