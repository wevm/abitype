import { ParamType } from 'ethers'
import { bench, describe } from 'vitest'

import { parseAbiParameter } from './parseAbiParameter'

describe('Parse basic ABI Parameter', () => {
  const basic = 'string foo'

  bench('abitype', () => {
    parseAbiParameter(basic)
  })

  bench('ethers', () => {
    ParamType.from(basic)
  })
})

describe('Parse inline tuple ABI Parameter', () => {
  const inlineTuple = '(string bar, string baz) foo'

  bench('abitype', () => {
    parseAbiParameter(inlineTuple)
  })

  bench('ethers', () => {
    ParamType.from(inlineTuple)
  })
})
