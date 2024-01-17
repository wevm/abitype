import { attest } from '@arktype/attest'
import { test } from 'vitest'
import { type TypedDataToPrimitiveTypes } from './utils.js'

test('self-referencing', () => {
  type Result = TypedDataToPrimitiveTypes<{
    Name: [{ name: 'first'; type: 'Name' }, { name: 'last'; type: 'string' }]
  }>
  attest<
    {
      Name: {
        first: [
          "Error: Cannot convert self-referencing struct 'Name' to primitive type.",
        ]
        last: string
      }
    },
    Result
  >()
})
