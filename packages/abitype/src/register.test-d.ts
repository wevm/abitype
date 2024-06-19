import { assertType, test } from 'vitest'

import type { ResolvedRegister } from './register.js'

test('ResolvedRegister', () => {
  assertType<ResolvedRegister['arrayMaxDepth']>(false)
  assertType<ResolvedRegister['fixedArrayMinLength']>(1)
  assertType<ResolvedRegister['fixedArrayMaxLength']>(99)

  type AddressType = ResolvedRegister['addressType']
  assertType<AddressType>('0x0000000000000000000000000000000000000000')

  type BytesType = ResolvedRegister['bytesType']
  assertType<BytesType>({
    inputs: '0xfoobarbaz',
    outputs: '0xfoobarbaz',
  })

  type IntType = ResolvedRegister['intType']
  assertType<IntType>(123)

  type BigIntType = ResolvedRegister['bigIntType']
  assertType<BigIntType>(123n)

  type StrictAbiType = ResolvedRegister['strictAbiType']
  assertType<StrictAbiType>(false)
})
