import { assertType, test } from 'vitest'

import type { ResolvedConfig } from './config.js'

// For testing updates to config properties:
// declare module './config.js' {
//   export interface Config {
//     FixedArrayMaxLength: 6
//   }
// }

test('Config', () => {
  assertType<ResolvedConfig['ArrayMaxDepth']>(false)
  assertType<ResolvedConfig['FixedArrayMinLength']>(1)
  assertType<ResolvedConfig['FixedArrayMaxLength']>(99)

  type AddressType = ResolvedConfig['AddressType']
  assertType<AddressType>('0x0000000000000000000000000000000000000000')

  type BytesType = ResolvedConfig['BytesType']
  assertType<BytesType>({
    inputs: '0xfoobarbaz',
    outputs: '0xfoobarbaz',
  })

  type IntType = ResolvedConfig['IntType']
  assertType<IntType>(123)

  type BigIntType = ResolvedConfig['BigIntType']
  assertType<BigIntType>(123n)

  type StrictAbiType = ResolvedConfig['StrictAbiType']
  assertType<StrictAbiType>(false)
})
