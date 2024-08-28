import type { AbiParametersToPrimitiveTypes, ResolvedRegister } from 'abitype'
import { assertType, expectTypeOf, test } from 'vitest'

type EncryptedUint8 = {
  data: `0x${string}`
}
type EncryptedUint16 = {
  data: `0x${string}`
}

declare module 'abitype' {
  interface Register {
    structTypeMatches: {
      eUint8: EncryptedUint8
      eUint16: EncryptedUint16
    }
  }
}

test('Register structTypeMatches', () => {
  type StructTypeMatches = ResolvedRegister['structTypeMatches']
  assertType<StructTypeMatches>({
    eUint8: { data: '0xfoobarbaz' },
    eUint16: { data: '0xfoobarbaz' },
  })

  type Result = AbiParametersToPrimitiveTypes<
    [
      {
        components: [
          {
            internalType: 'bytes'
            name: 'data'
            type: 'bytes'
          },
        ]
        internalType: 'struct eUint8'
        name: 'encryptedA8'
        type: 'tuple'
      },
      {
        components: [
          {
            internalType: 'bytes'
            name: 'data'
            type: 'bytes'
          },
        ]
        internalType: 'struct eUint16'
        name: 'encryptedB16'
        type: 'tuple'
      },
    ]
  >
  assertType<Result>([{ data: '0xfoobarbaz' }, { data: '0xfoobarbaz' }])
  expectTypeOf<Result>().toEqualTypeOf<[EncryptedUint8, EncryptedUint16]>()
})
