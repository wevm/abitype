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

  // Will fail and prevent CI if test below is not commented out
  assertType<ResolvedRegister['structTypeMatches']>({})
})

/*
 * ! Note: This test should be permanently commented out !
 *
 * It tests declaration merging with the abitype Register
 * Uncomment to test locally, but cannot be run as part of CI
 */

// import type { AbiParametersToPrimitiveTypes } from './utils.js'
// import { expectTypeOf } from 'vitest'

// type EncryptedUint8 = {
//   data: `0x${string}`
// }
// type EncryptedUint16 = {
//   data: `0x${string}`
// }
// declare module 'abitype' {
//   // biome-ignore lint/suspicious/noExportsInTest: Temporary merging for test, should be commented
//   export interface Register {
//     structTypeMatches: {
//       eUint8: EncryptedUint8
//       eUint16: EncryptedUint16
//     }
//   }
// }
// test('Register structTypeMatches', () => {
//   type StructTypeMatches = ResolvedRegister['structTypeMatches']
//   assertType<StructTypeMatches>({
//     eUint8: { data: '0xfoobarbaz' },
//     eUint16: { data: '0xfoobarbaz' },
//   })

//   type Result = AbiParametersToPrimitiveTypes<
//     [
//       {
//         components: [
//           {
//             internalType: 'bytes'
//             name: 'data'
//             type: 'bytes'
//           },
//         ]
//         internalType: 'struct eUint8'
//         name: 'encryptedA8'
//         type: 'tuple'
//       },
//       {
//         components: [
//           {
//             internalType: 'bytes'
//             name: 'data'
//             type: 'bytes'
//           },
//         ]
//         internalType: 'struct eUint16'
//         name: 'encryptedB16'
//         type: 'tuple'
//       },
//     ]
//   >
//   assertType<Result>([{ data: '0xfoobarbaz' }, { data: '0xfoobarbaz' }])
//   expectTypeOf<Result>().toEqualTypeOf<[EncryptedUint8, EncryptedUint16]>()
// })
