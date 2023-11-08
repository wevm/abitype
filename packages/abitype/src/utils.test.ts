import { attest } from '@arktype/attest'
import { test } from 'vitest'
import type { TypedDataToPrimitiveTypes } from './utils.js'

test('self-referencing', () => {
  const types = {
    Name: [
      { name: 'first', type: 'Name' },
      { name: 'last', type: 'string' },
    ],
  } as const
  type Result = TypedDataToPrimitiveTypes<typeof types>
  attest<
    Result,
    {
      Name: {
        first: [
          "Error: Cannot convert self-referencing struct 'Name' to primitive type.",
        ]
        last: 'Meagher'
      }
    }
  >()
})
