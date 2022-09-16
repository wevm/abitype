import { expectType, test } from '../test'
import { ResolvedConfig } from './config'

// declare module './config' {
//   export interface Config {
//     FixedArrayMaxLength: 6
//   }
// }

test('Config', () => {
  expectType<ResolvedConfig['ArrayMaxDepth']>(2)
  expectType<ResolvedConfig['FixedArrayMinLength']>(1)
  expectType<ResolvedConfig['FixedArrayMaxLength']>(5)

  type AddressType = ResolvedConfig['AddressType']
  expectType<AddressType>('0x0000000000000000000000000000000000000000')

  type BytesType = ResolvedConfig['BytesType']
  expectType<BytesType>('0xfoobarbaz')

  type IntType = ResolvedConfig['IntType']
  expectType<IntType>(123)

  type BigIntType = ResolvedConfig['BigIntType']
  expectType<BigIntType>(123n)
})
