import { describe, expectTypeOf, test } from 'vitest'

import type {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiParameter,
} from './abi.js'
import {
  customSolidityErrorsAbi,
  ensRegistryWithFallbackAbi,
  erc20Abi,
} from './abis/json.js'
import {
  Abi as AbiSchema,
  AbiConstructor as AbiConstructorSchema,
  AbiError as AbiErrorSchema,
  AbiEvent as AbiEventSchema,
  AbiParameter as AbiParameterSchema,
} from './zod.js'

describe('Zod Types', () => {
  describe('Abi', () => {
    test('assignable to Abi', () => {
      const parsed: Abi = AbiSchema.parse(erc20Abi)
      type Result = typeof parsed extends Abi ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })

    test('extends Abi', () => {
      const parsed = AbiSchema.parse(erc20Abi)
      type Result = typeof parsed extends Abi ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })
  })

  describe('AbiConstructor', () => {
    const ensRegistryConstructor = ensRegistryWithFallbackAbi[0]

    test('assignable to AbiConstructor', () => {
      const parsed: AbiConstructor = AbiConstructorSchema.parse(
        ensRegistryConstructor,
      )
      type Result = typeof parsed extends AbiConstructor ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })

    test('extends AbiConstructor', () => {
      const parsed = AbiConstructorSchema.parse(ensRegistryConstructor)
      type Result = typeof parsed extends AbiConstructor ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })
  })

  describe('AbiError', () => {
    const approvalCallerNotOwnerNorApproved = customSolidityErrorsAbi[1]

    test('assignable to AbiError', () => {
      const parsed: AbiError = AbiErrorSchema.parse(
        approvalCallerNotOwnerNorApproved,
      )
      type Result = typeof parsed extends AbiError ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })

    test('extends AbiError', () => {
      const parsed = AbiErrorSchema.parse(approvalCallerNotOwnerNorApproved)
      type Result = typeof parsed extends AbiError ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })
  })

  describe('AbiEvent', () => {
    const approvalEvent = erc20Abi[0]

    test('assignable to AbiEvent', () => {
      const parsed: AbiEvent = AbiEventSchema.parse(approvalEvent)
      type Result = typeof parsed extends AbiEvent ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })

    test('extends AbiEvent', () => {
      const parsed = AbiEventSchema.parse(approvalEvent)
      type Result = typeof parsed extends AbiEvent ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })
  })

  describe('AbiParameter', () => {
    const approvalOwnerParameter = erc20Abi[0].inputs[0]

    test('assignable to AbiParameter', () => {
      const parsed: AbiParameter = AbiParameterSchema.parse(
        approvalOwnerParameter,
      )
      type Result = typeof parsed extends AbiParameter ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })

    test('extends AbiParameter', () => {
      const parsed = AbiParameterSchema.parse(approvalOwnerParameter)
      type Result = typeof parsed extends AbiParameter ? true : false
      expectTypeOf<Result>().toEqualTypeOf<true>()
    })
  })
})
