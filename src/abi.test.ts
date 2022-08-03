import { describe, test } from 'vitest'

import {
  address,
  expectType,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../test'

import {
  Abi,
  AbiFunction,
  AbiParameter,
  AbiParameterType,
  AbiParameterTypeToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiStateMutability,
  AbiType,
  AbiTypeToPrimitiveType,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ExtractAbiFunctionParameters,
} from './abi'

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

    expectType<AbiType>('fixed18x128')
    expectType<AbiType>('ufixed18x128')

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

describe('utilities', () => {
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

describe('functions', () => {
  test('readContract', () => {
    function readContract<
      TAbi extends Abi,
      TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
      TArgs extends AbiParametersToPrimitiveTypes<
        ExtractAbiFunctionParameters<TAbi, TFunctionName, 'inputs'>
      >,
      TResponse extends AbiParametersToPrimitiveTypes<
        ExtractAbiFunctionParameters<TAbi, TFunctionName, 'outputs'>
      >,
    >(
      _config: {
        address: Address
        contractInterface: TAbi
        functionName: TFunctionName
      } & (TArgs extends undefined ? { args?: never } : { args: TArgs }),
    ): TResponse extends undefined ? void : TResponse {
      return {} as TResponse extends undefined ? void : TResponse
    }

    expectType<string>(
      readContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'tokenURI',
        args: 123,
      }),
    )

    expectType<string>(
      readContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'symbol',
      }),
    )

    expectType<Address>(
      readContract({
        address,
        contractInterface: writingEditionsFactoryAbi,
        functionName: 'predictDeterministicAddress',
        args: [address, 'test'],
      }),
    )
  })

  test('writeContract', () => {
    function writeContract<
      TAbi extends Abi,
      TFunctionName extends ExtractAbiFunctionNames<
        TAbi,
        'payable' | 'nonpayable'
      >,
      TArgs extends AbiParametersToPrimitiveTypes<
        ExtractAbiFunctionParameters<TAbi, TFunctionName, 'inputs'>
      >,
      TResponse extends AbiParametersToPrimitiveTypes<
        ExtractAbiFunctionParameters<TAbi, TFunctionName, 'outputs'>
      >,
    >(
      _config: {
        address: Address
        contractInterface: TAbi
        functionName: TFunctionName
      } & (TArgs extends undefined ? { args?: never } : { args: TArgs }),
    ): TResponse extends undefined ? void : TResponse {
      return {} as TResponse extends undefined ? void : TResponse
    }

    expectType<void>(
      writeContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'approve',
        args: [address, 123],
      }),
    )

    expectType<void>(
      writeContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'transferFrom',
        args: [address, address, 123],
      }),
    )

    expectType<Address>(
      writeContract({
        address,
        contractInterface: writingEditionsFactoryAbi,
        functionName: 'create',
        args: {
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
        },
      }),
    )
  })
})
