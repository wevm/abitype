import { bench, describe } from 'vitest'

import { parseAbiParameters } from './parseAbiParameters'

describe('Parse basic ABI Parameter', () => {
  const basic = 'string foo, address baz'

  bench('abitype', () => {
    parseAbiParameters(basic)
  })
})

describe('Parse inline tuple ABI Parameter', () => {
  const inlineTuple =
    '(string bar, string baz) foo, (string tac, string toe) tic'

  bench('abitype', () => {
    parseAbiParameters(inlineTuple)
  })
})
