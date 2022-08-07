import { describe, it, test } from 'vitest'

import {
  address,
  ensRegistryWithFallbackAbi,
  expectType,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../test'
import { Abi } from './abi'
import {
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiTypeToPrimitiveType,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ExtractAbiFunctionParameters,
  ExtractAbiFunctions,
  IsAbi,
} from './utils'

test('AbiTypeToPrimitiveType', () => {
  expectType<AbiTypeToPrimitiveType<'address'>>(address)
  expectType<AbiTypeToPrimitiveType<'bool'>>(true)

  expectType<AbiTypeToPrimitiveType<'bytes'>>('foo')
  expectType<AbiTypeToPrimitiveType<'bytes1'>>('foo')
  expectType<AbiTypeToPrimitiveType<'bytes24'>>('foo')
  expectType<AbiTypeToPrimitiveType<'bytes32'>>('foo')
  expectType<AbiTypeToPrimitiveType<'bytes'>>([1])

  expectType<AbiTypeToPrimitiveType<'function'>>(`${address}foo`)
  expectType<AbiTypeToPrimitiveType<'string'>>('foo')

  expectType<AbiTypeToPrimitiveType<'int'>>(1)
  expectType<AbiTypeToPrimitiveType<'int8'>>(1)
  expectType<AbiTypeToPrimitiveType<'int32'>>(1)
  expectType<AbiTypeToPrimitiveType<'int256'>>(1)
  expectType<AbiTypeToPrimitiveType<'int'>>(BigInt(1))
  expectType<AbiTypeToPrimitiveType<'uint'>>(1)
  expectType<AbiTypeToPrimitiveType<'uint8'>>(1)
  expectType<AbiTypeToPrimitiveType<'uint32'>>(1)
  expectType<AbiTypeToPrimitiveType<'uint256'>>(1)
  expectType<AbiTypeToPrimitiveType<'uint'>>(BigInt(1))

  expectType<AbiTypeToPrimitiveType<'string[]'>>(['foo'])
  expectType<AbiTypeToPrimitiveType<'string[2]'>>(['foo', 'foo'])
})

describe('AbiParameterToPrimitiveType', () => {
  it('address', () => {
    expectType<
      AbiParameterToPrimitiveType<{
        internalType: 'address'
        name: 'owner'
        type: 'address'
      }>
    >(address)
  })

  it('bool', () => {
    expectType<
      AbiParameterToPrimitiveType<{
        internalType: 'bool'
        name: ''
        type: 'bool'
      }>
    >(true)
  })

  it('bytes', () => {
    expectType<
      AbiParameterToPrimitiveType<{
        internalType: 'bytes'
        name: '_data'
        type: 'bytes'
      }>
    >('foo')
  })

  it('function', () => {
    expectType<
      AbiParameterToPrimitiveType<{
        internalType: 'function'
        name: ''
        type: 'function'
      }>
    >(`${address}foo`)
  })

  it('string', () => {
    expectType<
      AbiParameterToPrimitiveType<{
        internalType: 'string'
        name: ''
        type: 'string'
      }>
    >('foo')
  })

  it('tuple', () => {
    expectType<
      AbiParameterToPrimitiveType<{
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

  it('int', () => {
    expectType<
      AbiParameterToPrimitiveType<{
        internalType: 'uint256'
        name: 'tokenId'
        type: 'uint256'
      }>
    >(123)
  })

  it('string[]', () => {
    expectType<
      AbiParameterToPrimitiveType<{
        internalType: 'string[]'
        name: ''
        type: 'string[]'
      }>
    >(['foo', 'bar', 'baz'])
  })

  it('string[4]', () => {
    type Result = AbiParameterToPrimitiveType<{
      internalType: 'string[3]'
      name: ''
      type: 'string[3]'
    }>
    expectType<Result>(['foo', 'bar', 'baz'])
  })

  it('tuple[]', () => {
    type Result = AbiParameterToPrimitiveType<{
      name: 'c'
      type: 'tuple[]'
      components: [
        {
          name: 'x'
          type: 'uint256'
        },
        {
          name: 'y'
          type: 'uint256'
        },
      ]
    }>
    expectType<Result>([{ x: 1, y: 1 }])
  })

  it('tuple[2]', () => {
    type Result = AbiParameterToPrimitiveType<{
      name: 'c'
      type: 'tuple[2]'
      components: [
        {
          name: 'x'
          type: 'uint256'
        },
        {
          name: 'y'
          type: 'uint256'
        },
      ]
    }>
    expectType<Result>([
      { x: 1, y: 1 },
      { x: 1, y: 1 },
    ])
  })

  it('Nested tuple', () => {
    expectType<
      AbiParameterToPrimitiveType<{
        name: 's'
        type: 'tuple'
        components: [
          {
            name: 'a'
            type: 'uint256'
          },
          {
            name: 'b'
            type: 'uint256[]'
          },
          {
            name: 'c'
            type: 'tuple[]'
            components: [
              {
                name: 'x'
                type: 'uint256'
              },
              {
                name: 'y'
                type: 'uint256'
              },
            ]
          },
        ]
      }>
    >({ a: 1, b: [2], c: [{ x: 1, y: 1 }] })
  })
})

describe('AbiParametersToPrimitiveTypes', () => {
  it('No parameters', () => {
    expectType<AbiParametersToPrimitiveTypes<[]>>([])
  })

  it('Single parameter', () => {
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
    >([1])
  })

  it('Multiple parameters', () => {
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
          {
            internalType: 'string'
            name: 'trait'
            type: 'string'
          },
        ]
      >
    >([address, 1, 'foo'])
  })

  it('Wild collection of parameters', () => {
    expectType<
      AbiParametersToPrimitiveTypes<
        [
          {
            name: 's'
            type: 'tuple'
            components: [
              {
                name: 'a'
                type: 'uint256'
              },
              {
                name: 'b'
                type: 'uint256[]'
              },
              {
                name: 'c'
                type: 'tuple[]'
                components: [
                  {
                    name: 'x'
                    type: 'uint256'
                  },
                  {
                    name: 'y'
                    type: 'uint256'
                  },
                ]
              },
            ]
          },
          {
            name: 't'
            type: 'tuple'
            components: [
              {
                name: 'x'
                type: 'uint256'
              },
              {
                name: 'y'
                type: 'uint256'
              },
            ]
          },
          {
            name: 'a'
            type: 'uint256'
          },
          {
            name: 't'
            type: 'tuple[2]'
            components: [
              {
                name: 'x'
                type: 'uint256'
              },
              {
                name: 'y'
                type: 'uint256'
              },
            ]
          },
        ]
      >
    >([
      { a: 1, b: [2], c: [{ x: 1, y: 1 }] },
      { x: 1, y: 1 },
      1,
      [
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ],
    ])
  })
})

describe('IsAbi', () => {
  it('const assertion', () => {
    expectType<IsAbi<typeof nestedTupleArrayAbi>>(true)
    expectType<IsAbi<typeof wagmiMintExampleAbi>>(true)
    expectType<IsAbi<typeof writingEditionsFactoryAbi>>(true)
    expectType<IsAbi<typeof ensRegistryWithFallbackAbi>>(true)
    expectType<IsAbi<typeof nounsAuctionHouseAbi>>(true)
  })

  it('declared as Abi type', () => {
    const abi: Abi = [
      {
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'a', type: 'uint256' }],
        name: 'foo',
        outputs: [],
      },
    ]
    expectType<IsAbi<typeof abi>>(true)
  })

  it('no const assertion', () => {
    const abi = [
      {
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'a', type: 'uint256' }],
        name: 'foo',
        outputs: [],
      },
    ]
    expectType<IsAbi<typeof abi>>(false)
  })

  it('invalid abi', () => {
    const abi = 'foo'
    expectType<IsAbi<typeof abi>>(false)
  })
})

describe('ExtractAbiFunctions', () => {
  it('extracts function', () => {
    const abiFunction = {
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'a', type: 'uint256' }],
      name: 'foo',
      outputs: [],
    } as const
    expectType<ExtractAbiFunctions<[typeof abiFunction]>>(abiFunction)
  })

  it('no functions', () => {
    expectType<ExtractAbiFunctions<[]>>(undefined as never)
  })
})

describe('ExtractAbiFunctionNames', () => {
  it('extracts names', () => {
    test('ExtractAbiFunctionNames', () => {
      expectType<ExtractAbiFunctionNames<typeof wagmiMintExampleAbi>>('symbol')
    })
  })

  it('no names', () => {
    expectType<ExtractAbiFunctionNames<[]>>(undefined as never)
  })
})

describe('ExtractAbiFunction', () => {
  it('extracts function', () => {
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

  it('extract function with override', () => {
    type Result = ExtractAbiFunction<
      typeof wagmiMintExampleAbi,
      'safeTransferFrom'
    >
    expectType<Result>({
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    })
    expectType<Result>({
      inputs: [
        { internalType: 'address', name: 'from', type: 'address' },
        { internalType: 'address', name: 'to', type: 'address' },
        { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        { internalType: 'bytes', name: '_data', type: 'bytes' },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    })
  })
})

describe('ExtractAbiFunctionParameters', () => {
  it('extracts function', () => {
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

  it('extract function with override', () => {
    type Result = ExtractAbiFunctionParameters<
      typeof wagmiMintExampleAbi,
      'safeTransferFrom',
      'inputs'
    >
    expectType<Result>([
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ])
    expectType<Result>([
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'bytes', name: '_data', type: 'bytes' },
    ])
  })
})

describe('ExtractAbiEvents', () => {
  it('extracts events', () => {
    const abiEvent = {
      type: 'event',
      anonymous: false,
      inputs: [{ name: 'a', type: 'uint256' }],
      name: 'foo',
    } as const
    expectType<ExtractAbiEvents<[typeof abiEvent]>>(abiEvent)
  })

  it('no events', () => {
    expectType<ExtractAbiEvents<[]>>(undefined as never)
  })
})

describe('ExtractAbiEventNames', () => {
  it('extracts names', () => {
    test('ExtractAbiEventNames', () => {
      expectType<ExtractAbiEventNames<typeof wagmiMintExampleAbi>>(
        'ApprovalForAll',
      )
    })
  })

  it('no names', () => {
    expectType<ExtractAbiEventNames<[]>>(undefined as never)
  })
})
