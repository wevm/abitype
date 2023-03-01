import { expect, it } from 'vitest'

import * as Exports from './'

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "Abi",
      "AbiFunction",
      "AbiEvent",
      "AbiError",
      "AbiParameter",
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
