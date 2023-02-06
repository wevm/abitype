import { assertType, test } from 'vitest'

import type { ResolvedConfig } from './config'

// For testing updates to config properties:
// declare module './config' {
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

  type BytesTypeReturn = ResolvedConfig['BytesType']['outputs']
  assertType<BytesTypeReturn>('0xfoobarbaz')

  type BytesTypeArgs = ResolvedConfig['BytesType']['inputs']
  assertType<BytesTypeArgs>(new Uint8Array(Buffer.from('0xfoobarbaz')))

  type IntType = ResolvedConfig['IntType']
  assertType<IntType>(123)

  type BigIntType = ResolvedConfig['BigIntType']
  assertType<BigIntType>(123n)

  type StrictAbiType = ResolvedConfig['StrictAbiType']
  assertType<StrictAbiType>(false)
})
