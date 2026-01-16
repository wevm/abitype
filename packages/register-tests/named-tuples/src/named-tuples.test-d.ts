import type { AbiParametersToPrimitiveTypes } from 'abitype'
import { describe, expectTypeOf, test } from 'vitest'

describe('experimental_namedTuples', () => {
  test('common names', () => {
    type Result = AbiParametersToPrimitiveTypes<
      [{ name: 'amount'; type: 'uint256' }]
    >
    expectTypeOf<Result>().toEqualTypeOf<readonly [amount: bigint]>()
  })

  test('custom names', () => {
    type Result1 = AbiParametersToPrimitiveTypes<
      [{ name: 'myCustomParam'; type: 'uint256' }]
    >
    expectTypeOf<Result1>().toEqualTypeOf<readonly [myCustomParam: bigint]>()

    type Result2 = AbiParametersToPrimitiveTypes<
      [{ name: 'projectSpecificName'; type: 'address' }]
    >
    expectTypeOf<Result2>().toEqualTypeOf<
      readonly [projectSpecificName: `0x${string}`]
    >()

    type Mixed = AbiParametersToPrimitiveTypes<
      [
        { name: 'myCustomParam'; type: 'uint256' },
        { name: 'amount'; type: 'uint256' },
        { name: 'projectSpecificName'; type: 'address' },
      ]
    >
    expectTypeOf<Mixed>().toEqualTypeOf<
      readonly [
        myCustomParam: bigint,
        amount: bigint,
        projectSpecificName: `0x${string}`,
      ]
    >()
  })
})
