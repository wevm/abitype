import { describe, expectTypeOf, test } from 'vitest'

import type { Abi } from './abi.js'
import { Abi as AbiSchema } from './zod.js'

describe('Zod Types', () => {
  test('assignable to Abi', () => {
    const parsed: Abi = AbiSchema.parse([])
    type Result = typeof parsed extends Abi ? true : false
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('extends Abi', () => {
    const parsed = AbiSchema.parse([])
    type Result = typeof parsed extends Abi ? true : false
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })
})
