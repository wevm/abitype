import type { Address } from 'abitype'
import { expectTypeOf, test } from 'vitest'

test('default', async () => {
  expectTypeOf<Address>().toEqualTypeOf<
    `0x${string}` & { _tag: 'addressType' }
  >()
})
