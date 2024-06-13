import { attest } from '@arktype/attest'
import { test } from 'vitest'

import type {
  AbiParametersToPrimitiveTypes,
  TypedDataToPrimitiveTypes,
} from './utils.js'

test('deeply nested parameters', () => {
  const res = {} as AbiParametersToPrimitiveTypes<
    [
      {
        name: 's'
        type: 'tuple'
        components: [
          { name: 'a'; type: 'uint8' },
          { name: 'b'; type: 'uint8[]' },
          {
            name: 'c'
            type: 'tuple[]'
            components: [
              { name: 'x'; type: 'uint8' },
              { name: 'y'; type: 'uint8' },
            ]
          },
        ]
      },
      {
        name: 't'
        type: 'tuple'
        components: [{ name: 'x'; type: 'uint8' }, { name: 'y'; type: 'uint8' }]
      },
      { name: 'a'; type: 'uint8' },
      {
        name: 't'
        type: 'tuple[2]'
        components: [
          { name: 'x'; type: 'uint256' },
          { name: 'y'; type: 'uint256' },
        ]
      },
    ]
  >
  attest(res).snap()
})

test('self-referencing', () => {
  const res = {} as TypedDataToPrimitiveTypes<{
    Name: [{ name: 'first'; type: 'Name' }, { name: 'last'; type: 'string' }]
  }>
  attest(res).snap()
})
