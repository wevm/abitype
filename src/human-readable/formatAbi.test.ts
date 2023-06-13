import { expect, test } from 'vitest'

import { customSolidityErrorsAbi, seaportAbi } from '../test/abis.js'
import { formatAbi } from './formatAbi.js'

test('formatAbi', () => {
  const result = formatAbi(seaportAbi)
  expect(result).toMatchSnapshot()

  expect(formatAbi(customSolidityErrorsAbi)).toMatchInlineSnapshot(`
    [
      "constructor()",
      "error ApprovalCallerNotOwnerNorApproved()",
      "error ApprovalQueryForNonexistentToken()",
    ]
  `)
})
