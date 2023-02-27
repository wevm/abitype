import { expect, test } from 'vitest'

import {
  customSolidityErrorsHumanReadableAbi,
  seaportHumanReadableAbi,
} from '../test'
import { parseAbi } from './parseAbi'

test('parseAbi', () => {
  const result = parseAbi(seaportHumanReadableAbi)
  expect(result).toMatchSnapshot()

  expect(parseAbi(customSolidityErrorsHumanReadableAbi)).toMatchInlineSnapshot(`
    [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor",
      },
      {
        "inputs": [],
        "name": "ApprovalCallerNotOwnerNorApproved",
        "type": "error",
      },
      {
        "inputs": [],
        "name": "ApprovalQueryForNonexistentToken",
        "type": "error",
      },
    ]
  `)
})
