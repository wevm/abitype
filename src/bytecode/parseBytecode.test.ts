import { test } from 'vitest'

import { seaport, uniswap, weth } from '../test/bytecodes'
import { parseBytecode } from './parseBytecode'

const resolved = new Map([
  ['0xddf252ad', 'Transfer(address,address,uint256)'],
  ['0x2e1a7d4d', 'withdraw(uint256)'],
])

test('Run', () => {
  console.log('WETH: ', parseBytecode(weth, resolved))
  console.log('Uniswap: ', parseBytecode(uniswap))
  console.log('Seaport: ', parseBytecode(seaport))
})
