import { bench } from '@arktype/attest'

import type { Merge, Tuple } from './types.js'

bench('Merge', () => {
  type Result = Merge<{ foo: number }, { bar: string }>
  return {} as Result
}).types([42, 'instantiations'])

bench('Tuple', () => {
  type Result = Tuple<string, 2>
  return {} as Result
}).types([57, 'instantiations'])
