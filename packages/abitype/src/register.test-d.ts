import { assertType, test } from 'vitest'

import type { ResolvedRegister } from './register.js'

test('ResolvedRegister', () => {
  assertType<ResolvedRegister['ArrayMaxDepth']>(false)
  assertType<ResolvedRegister['FixedArrayMinLength']>(1)
  assertType<ResolvedRegister['FixedArrayMaxLength']>(99)

  type AddressType = ResolvedRegister['AddressType']
  assertType<AddressType>('0x0000000000000000000000000000000000000000')

  type BytesType = ResolvedRegister['BytesType']
  assertType<BytesType>({
    inputs: '0xfoobarbaz',
    outputs: '0xfoobarbaz',
  })

  type IntType = ResolvedRegister['IntType']
  assertType<IntType>(123)

  type BigIntType = ResolvedRegister['BigIntType']
  assertType<BigIntType>(123n)

  type StrictAbiType = ResolvedRegister['StrictAbiType']
  assertType<StrictAbiType>(false)
})
