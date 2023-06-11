import { expect, test } from 'vitest'

import { seaportAbi } from '../test/abis.js'
import { formatAbiItem } from './formatAbiItem.js'

test('default', () => {
  const result = formatAbiItem(seaportAbi[1])
  expect(result).toMatchInlineSnapshot(
    '"function cancel((address offerer, address zone, (uint8 itemType, address token, uint256 identifierOrCriteria, uint256 startAmount, uint256 endAmount)[] offer, (uint8 itemType, address token, uint256 identifierOrCriteria, uint256 startAmount, uint256 endAmount, address recipient)[] consideration, uint8 orderType, uint256 startTime, uint256 endTime, bytes32 zoneHash, uint256 salt, bytes32 conduitKey, uint256 counter)[] orders) returns (bool cancelled)"',
  )
})
