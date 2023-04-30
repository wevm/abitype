import { describe, expectTypeOf, test } from 'vitest'

import {
  seaportBytecode,
  uniswapBytecode,
  wethBytecode,
} from '../test/bytecodes.js'
import { parseBytecode } from './parseBytecode.js'

describe('Return type of different bytecodes', () => {
  test('error', () => {
    expectTypeOf(parseBytecode('invalid')).toEqualTypeOf<
      ['Error: Cannot infer abi from provided bytecode']
    >()
  })

  test('wethBytecode', () => {
    expectTypeOf(parseBytecode(wethBytecode)).toEqualTypeOf<
      readonly [
        {
          readonly type: 'event'
          readonly name: '0xe1fffcc4'
          readonly inputs: readonly []
        },
        {
          readonly type: 'event'
          readonly name: '0x8c5be1e5'
          readonly inputs: readonly []
        },
        {
          readonly type: 'event'
          readonly name: 'Transfer'
          readonly inputs: readonly [
            { readonly type: 'address' },
            { readonly type: 'address' },
            { readonly type: 'uint256' },
          ]
        },
        {
          readonly type: 'event'
          readonly name: '0x7fcf532c'
          readonly inputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0x06fdde03'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0x095ea7b3'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0x18160ddd'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0x23b872dd'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: 'withdraw'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly [{ readonly type: 'uint256' }]
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0x313ce567'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0x70a08231'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0x95d89b41'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0xa9059cbb'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0xd0e30db0'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly name: '0xdd62ed3e'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
      ]
    >()
  })

  test('uniswapBytecode', () => {
    expectTypeOf(parseBytecode(uniswapBytecode)).toEqualTypeOf<
      readonly [
        {
          readonly type: 'constructor'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xe8e33700'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xf305d719'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xfb3bdb41'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xc45a0155'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xd06ca61f'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xded9382a'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xaf2979eb'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xb6f9de95'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xbaa2abde'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x8803dbee'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xad5c4648'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xad615dec'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x791ac947'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x7ff36ab5'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x85f8c259'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x4a25d94a'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x5b0d5984'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x5c11d795'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x1f00ca74'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x2195995c'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x38ed1739'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x02751cec'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x054d50d4'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x18cbafe5'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
      ]
    >()
  })

  test('seaportBytecode', () => {
    expectTypeOf(parseBytecode(seaportBytecode)).toEqualTypeOf<
      readonly [
        {
          readonly type: 'constructor'
          readonly stateMutability: 'nonpayable'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x6ab37ce7'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x39f3e3fd'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x466aa616'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x21ccfeb7'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x8ffff980'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x69f95827'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xa61be9f0'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xbc806b96'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x91b3e514'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xd13d53d4'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x1cf99b26'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xc63cf089'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x133c37c6'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xa8930e9a'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xd6929332'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x94eb6af6'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x09bde339'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x375c24c1'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x375c24c1'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xa5f54208'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xbced929d'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x93979285'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x7fa8a987'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x4f7fb80d'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x1f003d0a'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x8baa579f'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x10fda3e1'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xfb5014fc'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x8ffff980'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x6ab37ce7'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xf486bc87'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x12d3f5a3'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x09bde339'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xd5da9a1b'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x7fda7279'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x4e487b71'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x98e9db6e'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xee9e0e63'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x1a515574'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x5a052b32'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xa11b63ff'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x2165628a'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xfed398fc'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0xf486bc87'
          readonly inputs: readonly []
        },
        {
          readonly type: 'error'
          readonly name: '0x1a515574'
          readonly inputs: readonly []
        },
        {
          readonly type: 'event'
          readonly name: '0x6bacc01d'
          readonly inputs: readonly []
        },
        {
          readonly type: 'event'
          readonly name: '0x4b9f2d36'
          readonly inputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x06fdde03'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x46423aa7'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x5b34b966'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x79df72bd'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x87201b41'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0x88147732'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xa8174404'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xa900866b'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xb3a34c4c'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xe7acab24'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xed98a574'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xf07ec373'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xf2d12b12'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xf47b7740'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
        {
          readonly type: 'function'
          readonly stateMutability: 'nonpayable'
          readonly name: '0xfb0f3ee1'
          readonly inputs: readonly []
          readonly outputs: readonly []
        },
      ]
    >()
  })
})
