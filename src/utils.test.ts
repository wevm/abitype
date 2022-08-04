import { describe, test } from 'vitest'

import { address, expectType, wagmiMintExampleAbi } from '../test'
import {
  AbiParameterTypeToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiTypeToPrimitiveType,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ExtractAbiFunctionParameters,
} from './utils'

describe('utilities', () => {
  test.todo('IsAbi')

  test('AbiTypeToPrimitiveType', () => {
    expectType<AbiTypeToPrimitiveType<'address'>>(address)
    expectType<AbiTypeToPrimitiveType<'bool'>>(true)
    expectType<AbiTypeToPrimitiveType<'bytes'>>('foo')
    expectType<AbiTypeToPrimitiveType<'function'>>(address)
    expectType<AbiTypeToPrimitiveType<'string'>>('foo')
    expectType<AbiTypeToPrimitiveType<'int'>>(1)
    expectType<AbiTypeToPrimitiveType<'fixed128x18'>>(1)
    expectType<AbiTypeToPrimitiveType<'fixed'>>(1)
  })

  test('AbiParameterTypeToPrimitiveType', () => {
    expectType<
      AbiParameterTypeToPrimitiveType<{
        components: [
          { internalType: 'string'; name: 'name'; type: 'string' },
          { internalType: 'string'; name: 'symbol'; type: 'string' },
          { internalType: 'string'; name: 'description'; type: 'string' },
          { internalType: 'string'; name: 'imageURI'; type: 'string' },
          { internalType: 'string'; name: 'contentURI'; type: 'string' },
          { internalType: 'uint256'; name: 'price'; type: 'uint256' },
          { internalType: 'uint256'; name: 'limit'; type: 'uint256' },
          {
            internalType: 'address'
            name: 'fundingRecipient'
            type: 'address'
          },
          { internalType: 'address'; name: 'renderer'; type: 'address' },
          { internalType: 'uint256'; name: 'nonce'; type: 'uint256' },
          { internalType: 'uint16'; name: 'fee'; type: 'uint16' },
        ]
        internalType: 'struct IWritingEditions.WritingEdition'
        name: 'edition'
        type: 'tuple'
      }>
    >({
      name: 'Test',
      symbol: '$TEST',
      description: 'Foo bar baz',
      imageURI: 'ipfs://hash',
      contentURI: 'arweave://digest',
      price: 0.1,
      limit: 100,
      fundingRecipient: address,
      renderer: address,
      nonce: 123,
      fee: 0,
    })
  })

  test('AbiParametersToPrimitiveTypes', () => {
    // No args
    expectType<AbiParametersToPrimitiveTypes<[]>>(undefined)

    // Single arg
    expectType<
      AbiParametersToPrimitiveTypes<
        [
          {
            internalType: 'uint256'
            name: 'tokenId'
            type: 'uint256'
          },
        ]
      >
    >(1)

    // Multiple args
    expectType<
      AbiParametersToPrimitiveTypes<
        [
          {
            internalType: 'address'
            name: 'to'
            type: 'address'
          },
          {
            internalType: 'uint256'
            name: 'tokenId'
            type: 'uint256'
          },
        ]
      >
    >([address, 1])
  })

  describe('functions', () => {
    test.todo('ExtractAbiFunctions')

    test('ExtractAbiFunctionNames', () => {
      expectType<ExtractAbiFunctionNames<typeof wagmiMintExampleAbi>>('symbol')
    })

    test('ExtractAbiFunction', () => {
      expectType<ExtractAbiFunction<typeof wagmiMintExampleAbi, 'tokenURI'>>({
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'tokenURI',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'pure',
        type: 'function',
      })
    })

    test('ExtractAbiFunctionParameters', () => {
      expectType<
        ExtractAbiFunctionParameters<
          typeof wagmiMintExampleAbi,
          'tokenURI',
          'inputs'
        >
      >([
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ])
    })
  })
})
