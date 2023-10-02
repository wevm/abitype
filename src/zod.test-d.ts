import type { Abi as AbiType } from './abi.js'
import { Abi } from './zod.js'
import { describe, expectTypeOf, test } from 'vitest'

describe('Zod Types', () => {
  test('assignable to Abi', () => {
    const parsed: AbiType = Abi.parse([])

    type ZodParse = typeof parsed extends AbiType ? true : false

    expectTypeOf<ZodParse>().toEqualTypeOf<true>()
  })
})
