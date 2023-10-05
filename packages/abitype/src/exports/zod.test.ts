import { expect, it } from 'vitest'

import * as Exports from './zod.js'

it('exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "Address",
      "SolidityAddress",
      "SolidityBool",
      "SolidityBytes",
      "SolidityFunction",
      "SolidityString",
      "SolidityTuple",
      "SolidityInt",
      "SolidityArrayWithoutTuple",
      "SolidityArrayWithTuple",
      "SolidityArray",
      "AbiParameter",
      "AbiEventParameter",
      "AbiStateMutability",
      "AbiFunction",
      "AbiConstructor",
      "AbiFallback",
      "AbiReceive",
      "AbiEvent",
      "AbiError",
      "AbiItemType",
      "Abi",
      "TypedDataDomain",
      "TypedDataType",
      "TypedDataParameter",
      "TypedData",
    ]
  `)
})
