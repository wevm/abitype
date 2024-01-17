import { attest } from '@arktype/attest'
import { test } from 'vitest'
import type {
  AbiParametersToPrimitiveTypes,
  TypedDataToPrimitiveTypes,
} from './utils.js'

test('deeply nested parameters', () => {
  type Result = AbiParametersToPrimitiveTypes<
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
  attest<
    [
      {
        a: number
        b: readonly number[]
        c: readonly { x: number; y: number }[]
      },
      { x: number; y: number },
      number,
      readonly [{ x: bigint; y: bigint }, { x: bigint; y: bigint }],
    ],
    Result
  >()
})

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
