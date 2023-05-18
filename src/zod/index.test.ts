import { expect, it } from 'vitest'

import * as Exports from './index.js'

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "Abi",
      "AbiConstructor",
      "AbiEvent",
      "AbiEventParameter",
      "AbiError",
      "AbiFallback",
      "AbiFunction",
      "AbiItemType",
      "AbiParameter",
      "AbiReceive",
      "AbiStateMutability",
      "SolidityAddress",
      "SolidityArray",
      "SolidityArrayWithoutTuple",
      "SolidityArrayWithTuple",
      "SolidityBool",
      "SolidityBytes",
      "SolidityFunction",
      "SolidityInt",
      "SolidityString",
      "SolidityTuple",
    ]
  `)
})
