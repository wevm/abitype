import { describe, it, test } from 'vitest'

import { expectType } from '../test'

import {
  AbiFunction,
  AbiParameter,
  AbiParameterType,
  AbiStateMutability,
  AbiType,
  Address,
  SolAddress,
  SolBool,
  SolBytes,
} from './abi'

describe('Solidity primitive types', () => {
  it('address', () => {
    expectType<SolAddress>('address')
  })

  it('bool', () => {
    expectType<SolBool>('bool')
  })

  it('bytes', () => {
    expectType<SolBytes>('bytes')
    expectType<SolBytes>('bytes24')
  })
})

describe('types', () => {
  test('Address', () => {
    expectType<Address>('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
    // @ts-expect-error No leading `0x
    expectType<Address>('A0Cf798816D4b9b9866b5330EEa46a18382f251e')
  })

  test('AbiType', () => {
    expectType<AbiType>('address')
    expectType<AbiType>('bool')
    expectType<AbiType>('bytes24')
    expectType<AbiType>('function')
    expectType<AbiType>('string')
    expectType<AbiType>('tuple')

    expectType<AbiType>('int')
    expectType<AbiType>('uint')

    expectType<AbiType>('fixed128x18')
    expectType<AbiType>('ufixed128x18')

    expectType<AbiType>('fixed')
    expectType<AbiType>('ufixed')
  })

  test('AbiParameter', () => {
    expectType<AbiParameter>({
      internalType: 'address',
      name: 'owner',
      type: 'address',
    })

    expectType<AbiParameter>({
      components: [
        { internalType: 'string', name: 'name', type: 'string' },
        { internalType: 'string', name: 'symbol', type: 'string' },
        { internalType: 'string', name: 'description', type: 'string' },
        { internalType: 'string', name: 'imageURI', type: 'string' },
        { internalType: 'string', name: 'contentURI', type: 'string' },
        { internalType: 'uint256', name: 'price', type: 'uint256' },
        { internalType: 'uint256', name: 'limit', type: 'uint256' },
        {
          internalType: 'address',
          name: 'fundingRecipient',
          type: 'address',
        },
        { internalType: 'address', name: 'renderer', type: 'address' },
        { internalType: 'uint256', name: 'nonce', type: 'uint256' },
        { internalType: 'uint16', name: 'fee', type: 'uint16' },
      ],
      internalType: 'struct IWritingEditions.WritingEdition',
      name: 'edition',
      type: 'tuple',
    })
  })

  test('AbiParameterType', () => {
    expectType<AbiParameterType>('inputs')
    expectType<AbiParameterType>('outputs')
  })

  test('StateMutability', () => {
    expectType<AbiStateMutability>('pure')
    expectType<AbiStateMutability>('view')
    expectType<AbiStateMutability>('nonpayable')
    expectType<AbiStateMutability>('payable')
  })

  test('AbiFunction', () => {
    expectType<AbiFunction>({
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'pure',
      type: 'function',
    })

    expectType<AbiFunction>({
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    })

    expectType<AbiFunction>({
      stateMutability: 'nonpayable',
      type: 'fallback',
    })

    expectType<AbiFunction>({
      stateMutability: 'payable',
      type: 'receive',
    })

    expectType<AbiFunction>({
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'pure',
      // @ts-expect-error Must be function type
      type: 'event',
    })
  })

  test.todo('AbiEvent')
  test.todo('AbiError')
  test.todo('Abi')
})
