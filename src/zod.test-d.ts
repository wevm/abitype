import type { Abi, AbiEvent } from './abi.js'
import { Abi as AbiSchema, AbiEvent as AbiEventSchema } from './zod.js'
import { describe, expectTypeOf, test } from 'vitest'

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

  test('assignable to AbiEvent', () => {
    const parsed: AbiEvent = AbiEventSchema.parse({
      anonymous: false,
      inputs: [
        { indexed: true, name: 'owner', type: 'address' },
        { indexed: true, name: 'spender', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'event',
    })
    type Result = typeof parsed extends AbiEvent ? true : false
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })

  test('extends Abi', () => {
    const parsed = AbiEventSchema.parse({
      anonymous: false,
      inputs: [
        { indexed: true, name: 'owner', type: 'address' },
        { indexed: true, name: 'spender', type: 'address' },
        { indexed: false, name: 'value', type: 'uint256' },
      ],
      name: 'Approval',
      type: 'event',
    })
    type Result = typeof parsed extends AbiEvent ? true : false
    expectTypeOf<Result>().toEqualTypeOf<true>()
  })
})
