import { assertType, describe, expectTypeOf, test } from 'vitest'

import type { Abi } from './abi.js'
import type {
  customSolidityErrorsAbi,
  ensRegistryWithFallbackAbi,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  wethAbi,
  writingEditionsFactoryAbi,
} from './abis/json.js'
import type {
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiTypeToPrimitiveType,
  ExtractAbiError,
  ExtractAbiErrorNames,
  ExtractAbiErrors,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  ExtractAbiFunctions,
  IsAbi,
  IsTypedData,
  TypedDataToPrimitiveTypes,
} from './utils.js'

const zeroAddress = '0x0000000000000000000000000000000000000000'

describe('AbiTypeToPrimitiveType', () => {
  test('address', () => {
    assertType<AbiTypeToPrimitiveType<'address'>>(zeroAddress)
  })

  test('bool', () => {
    assertType<AbiTypeToPrimitiveType<'bool'>>(true)
    assertType<AbiTypeToPrimitiveType<'bool'>>(false)
  })

  test('bytes', () => {
    assertType<AbiTypeToPrimitiveType<'bytes'>>('0xfoo')
    assertType<AbiTypeToPrimitiveType<'bytes1'>>('0xfoo')
    assertType<AbiTypeToPrimitiveType<'bytes24'>>('0xfoo')
    assertType<AbiTypeToPrimitiveType<'bytes32'>>('0xfoo')
    assertType<AbiTypeToPrimitiveType<'bytes', 'outputs'>>('0xfoo')
  })

  test('function', () => {
    assertType<AbiTypeToPrimitiveType<'function'>>(`${zeroAddress}foo`)
  })

  test('string', () => {
    assertType<AbiTypeToPrimitiveType<'string'>>('foo')
  })

  test('number', () => {
    assertType<AbiTypeToPrimitiveType<'int'>>(1n)
    assertType<AbiTypeToPrimitiveType<'int'>>(BigInt(1))
    assertType<AbiTypeToPrimitiveType<'uint'>>(1n)
    assertType<AbiTypeToPrimitiveType<'uint'>>(BigInt(1))

    assertType<AbiTypeToPrimitiveType<'int8'>>(1)
    assertType<AbiTypeToPrimitiveType<'int32'>>(1)
    assertType<AbiTypeToPrimitiveType<'uint8'>>(1)
    assertType<AbiTypeToPrimitiveType<'int8'>>(1)
    // @ts-expect-error should be number
    assertType<AbiTypeToPrimitiveType<'int8'>>(1n)

    assertType<AbiTypeToPrimitiveType<'int256'>>(1n)
    assertType<AbiTypeToPrimitiveType<'int256'>>(BigInt(1))
    assertType<AbiTypeToPrimitiveType<'uint256'>>(1n)
    assertType<AbiTypeToPrimitiveType<'uint256'>>(BigInt(1))
    // @ts-expect-error should be bigint
    assertType<AbiTypeToPrimitiveType<'int256'>>(1)
  })

  test('tuple', () => {
    assertType<AbiTypeToPrimitiveType<'tuple'>>({ foo: 'bar' })
  })

  test('array', () => {
    assertType<AbiTypeToPrimitiveType<'string[]'>>(['foo'])
    assertType<AbiTypeToPrimitiveType<'string[1]'>>(['foo', 'foo'])
  })

  test('2d array', () => {
    assertType<AbiTypeToPrimitiveType<'string[][]'>>([['foo']])
    assertType<AbiTypeToPrimitiveType<'string[1][]'>>([['foo', 'foo']])
  })
})

describe('AbiParameterToPrimitiveType', () => {
  test('address', () => {
    type Result = AbiParameterToPrimitiveType<{
      name: 'owner'
      type: 'address'
    }>
    assertType<Result>(zeroAddress)
    // @ts-expect-error missing "0x" prefix
    assertType<Result>('foo')
  })

  test('bool', () => {
    type Result = AbiParameterToPrimitiveType<{ type: 'bool' }>
    assertType<Result>(true)
    assertType<Result>(false)
  })

  test('bytes', () => {
    type Result = AbiParameterToPrimitiveType<{
      name: 'data'
      type: 'bytes'
    }>
    assertType<Result>('0xfoo')
  })

  test('function', () => {
    type FunctionResult = AbiParameterToPrimitiveType<{
      type: 'function'
    }>
    assertType<FunctionResult>(`${zeroAddress}foo`)
  })

  test('string', () => {
    type Result = AbiParameterToPrimitiveType<{
      type: 'string'
    }>
    assertType<Result>('foo')
    assertType<Result>(zeroAddress)
  })

  test('tuple', () => {
    type Result = AbiParameterToPrimitiveType<
      {
        components: [
          { name: 'name'; type: 'string' },
          { name: 'symbol'; type: 'string' },
          { name: 'description'; type: 'string' },
          { name: 'imageURI'; type: 'string' },
          { name: 'contentURI'; type: 'string' },
          { name: 'price'; type: 'uint' },
          { name: 'limit'; type: 'uint256' },
          { name: 'fundingRecipient'; type: 'address' },
          { name: 'renderer'; type: 'address' },
          { name: 'nonce'; type: 'uint256' },
          { name: 'fee'; type: 'uint16' },
        ]
        internalType: 'struct IWritingEditions.WritingEdition'
        name: 'edition'
        type: 'tuple'
      },
      'inputs'
    >
    assertType<Result>({
      name: 'Test',
      symbol: '$TEST',
      description: 'Foo bar baz',
      imageURI: 'ipfs://hash',
      contentURI: 'arweave://digest',
      price: 1n,
      limit: 100n,
      fundingRecipient: zeroAddress,
      renderer: zeroAddress,
      nonce: 123n,
      fee: 0,
    })
    // @ts-expect-error missing keys
    assertType<Result>({
      name: 'Test',
      symbol: '$TEST',
      description: 'Foo bar baz',
      imageURI: 'ipfs://hash',
    })
    assertType<Result>({
      name: 'Test',
      symbol: '$TEST',
      description: 'Foo bar baz',
      imageURI: 'ipfs://hash',
      contentURI: 'arweave://digest',
      // @ts-expect-error invalid value
      price: '0.1',
      limit: 100n,
      fundingRecipient: zeroAddress,
      renderer: zeroAddress,
      nonce: 123n,
      fee: 0,
    })

    type NestedTupleResult = AbiParameterToPrimitiveType<{
      name: 's'
      type: 'tuple'
      components: [
        { name: 'a'; type: 'uint8' },
        { name: 'b'; type: 'uint8[2]' },
        {
          name: 'c'
          type: 'tuple[]'
          components: [
            { name: 'x'; type: 'uint256' },
            {
              name: 'y'
              type: 'tuple'
              components: [{ name: 'a'; type: 'string' }]
            },
          ]
        },
      ]
    }>
    assertType<NestedTupleResult>({
      a: 1,
      b: [2, 3],
      c: [{ x: 1n, y: { a: 'foo' } }],
    })

    type WithoutNamedComponentResult = AbiParameterToPrimitiveType<{
      components: [
        { name: ''; type: 'string' },
        { type: 'string' },
        { name: 'symbol'; type: 'string' },
        { name: 'description'; type: 'string' },
        { name: 'imageURI'; type: 'string' },
        { name: 'contentURI'; type: 'string' },
        { name: 'price'; type: 'uint' },
        { name: 'limit'; type: 'uint256' },
        { name: 'fundingRecipient'; type: 'address' },
        { name: 'renderer'; type: 'address' },
        { name: 'nonce'; type: 'uint256' },
        { name: 'fee'; type: 'uint16' },
      ]
      internalType: 'struct IWritingEditions.WritingEdition'
      name: 'edition'
      type: 'tuple'
    }>
    assertType<WithoutNamedComponentResult>([
      'Test',
      'Test',
      '$TEST',
      'Foo bar baz',
      'ipfs://hash',
      'arweave://digest',
      1n,
      100n,
      zeroAddress,
      zeroAddress,
      123n,
      0,
    ])

    type WithoutNamedComponentsResult = AbiParameterToPrimitiveType<{
      components: [{ type: 'string' }, { type: 'uint' }, { type: 'address' }]
      internalType: 'struct IWritingEditions.WritingEdition'
      name: 'edition'
      type: 'tuple'
    }>
    assertType<WithoutNamedComponentsResult>([
      'Test',
      5n,
      '0x0000000000000000000000000000000000000000',
    ])

    type WithoutComponentsResult = AbiParameterToPrimitiveType<{
      components: []
      internalType: 'struct IWritingEditions.WritingEdition'
      name: 'edition'
      type: 'tuple'
    }>
    assertType<WithoutComponentsResult>([])
  })

  test('number', () => {
    type Result = AbiParameterToPrimitiveType<{
      name: 'tokenId'
      type: 'uint256'
    }>
    assertType<Result>(123n)
    assertType<Result>(123n)
    assertType<Result>(BigInt(123))
    // @ts-expect-error string value
    assertType<Result>('123')
  })

  test('array', () => {
    test('dynamic', () => {
      type Result = AbiParameterToPrimitiveType<{
        type: 'string[]'
      }>
      assertType<Result>(['foo', 'bar', 'baz'])
    })

    test('fixed', () => {
      type Result = AbiParameterToPrimitiveType<{
        type: 'string[3]'
      }>
      assertType<Result>(['foo', 'bar', 'baz'])
      // @ts-expect-error not enough items
      assertType<Result>(['foo', 'bar'])
    })

    test('dynamic with tuple', () => {
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
      assertType<Result>([{ x: 1n, y: 1n }])
    })

    test('fixed with tuple', () => {
      type Result = AbiParameterToPrimitiveType<{
        name: 'c'
        type: 'tuple[2]'
        components: [
          {
            name: 'x'
            type: 'uint8'
          },
          {
            name: 'y'
            type: 'uint8'
          },
        ]
      }>
      assertType<Result>([
        { x: 1, y: 1 },
        { x: 1, y: 1 },
      ])
    })
  })

  test('2d array', () => {
    test('dynamic', () => {
      type Result = AbiParameterToPrimitiveType<{
        type: 'string[][]'
      }>
      assertType<Result>([['foo'], ['bar'], ['baz']])
    })

    test('fixed', () => {
      assertType<
        AbiParameterToPrimitiveType<{
          type: 'string[][3]'
        }>
      >([['foo'], ['bar'], ['baz']])

      assertType<
        AbiParameterToPrimitiveType<{
          type: 'string[3][]'
        }>
      >([
        ['foo', 'bar', 'baz'],
        ['foo', 'bar', 'baz'],
      ])

      assertType<
        AbiParameterToPrimitiveType<{
          type: 'string[3][3]'
        }>
      >([
        ['foo', 'bar', 'baz'],
        ['foo', 'bar', 'baz'],
        ['foo', 'bar', 'baz'],
      ])

      assertType<
        AbiParameterToPrimitiveType<{
          type: 'string[3][3]'
        }>
        // @ts-expect-error not enough items
      >([
        ['foo', 'bar', 'baz'],
        ['foo', 'bar', 'baz'],
      ])
    })
  })

  test('unknown', () => {
    test('single value', () => {
      type Result = AbiParameterToPrimitiveType<{
        name: 'data'
        type: 'foo'
      }>
      assertType<Result>(null)
    })

    test('array', () => {
      type Result = AbiParameterToPrimitiveType<{
        name: 'data'
        type: 'foo[2][2]'
      }>
      assertType<Result>([
        [null, null],
        [null, null],
      ])
    })
  })

  test('inputs and outputs types', () => {
    const parameter = {
      name: 'foo',
      type: 'bytes32',
    } as const
    assertType<AbiParameterToPrimitiveType<typeof parameter, 'inputs'>>('0xfoo')
    assertType<AbiParameterToPrimitiveType<typeof parameter, 'outputs'>>(
      '0xfoo',
    )
    assertType<AbiParameterToPrimitiveType<typeof parameter, 'outputs'>>(
      '0xfoo',
    )
  })
})

describe('AbiParametersToPrimitiveTypes', () => {
  test('no parameters', () => {
    type Result = AbiParametersToPrimitiveTypes<[]>
    assertType<Result>([])
  })

  test('single parameter', () => {
    type Result = AbiParametersToPrimitiveTypes<
      [
        {
          name: 'tokenId'
          type: 'uint8[2]'
        },
      ]
    >
    assertType<Result>([[1, 1]])
    //          ^?
  })

  test('multiple parameters', () => {
    type Result = AbiParametersToPrimitiveTypes<
      [
        { name: 'to'; type: 'address' },
        { name: 'tokenId'; type: 'uint256' },
        { name: 'trait'; type: 'string[]' },
      ]
    >
    assertType<Result>([zeroAddress, 1n, ['foo']])
  })

  test('deeply nested parameters', () => {
    type Result = AbiParametersToPrimitiveTypes<
      [
        {
          name: 's'
          type: 'tuple'
          components: [
            { name: 'a'; type: 'uint8' },
            { name: 'b'; type: 'uint8[]' },
            {
              name: 'c'
              type: 'tuple[]'
              components: [
                { name: 'x'; type: 'uint8' },
                { name: 'y'; type: 'uint8' },
              ]
            },
          ]
        },
        {
          name: 't'
          type: 'tuple'
          components: [
            { name: 'x'; type: 'uint8' },
            { name: 'y'; type: 'uint8' },
          ]
        },
        { name: 'a'; type: 'uint8' },
        {
          name: 't'
          type: 'tuple[2]'
          components: [
            { name: 'x'; type: 'uint256' },
            { name: 'y'; type: 'uint256' },
          ]
        },
      ]
    >
    assertType<Result>([
      { a: 1, b: [2], c: [{ x: 1, y: 1 }] },
      { x: 1, y: 1 },
      1,
      [
        { x: 1n, y: 1n },
        { x: 1n, y: 1n },
      ],
    ])
  })

  test('inputs and outputs types', () => {
    const parameters = [
      {
        name: 'foo',
        type: 'bytes32',
      },
    ] as const
    assertType<AbiParametersToPrimitiveTypes<typeof parameters, 'inputs'>>([
      '0xfoo',
    ])
    assertType<AbiParametersToPrimitiveTypes<typeof parameters, 'outputs'>>([
      '0xfoo',
    ])
    assertType<AbiParametersToPrimitiveTypes<typeof parameters, 'outputs'>>([
      '0xfoo',
    ])
  })
})

describe('IsAbi', () => {
  test('const assertion', () => {
    assertType<IsAbi<typeof nestedTupleArrayAbi>>(true)
    assertType<IsAbi<typeof wagmiMintExampleAbi>>(true)
    assertType<IsAbi<typeof writingEditionsFactoryAbi>>(true)
    assertType<IsAbi<typeof ensRegistryWithFallbackAbi>>(true)
    assertType<IsAbi<typeof nounsAuctionHouseAbi>>(true)
    assertType<IsAbi<typeof wethAbi>>(true)
    assertType<IsAbi<typeof customSolidityErrorsAbi>>(true)
  })

  test('declared as Abi type', () => {
    const abi: Abi = [
      {
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'a', type: 'uint256' }],
        name: 'foo',
        outputs: [],
      },
    ]
    type Result = IsAbi<typeof abi>
    assertType<Result>(true)
  })

  test('no const assertion', () => {
    const abi = [
      {
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'a', type: 'uint256' }],
        name: 'foo',
        outputs: [],
      },
    ]
    type Result = IsAbi<typeof abi>
    assertType<Result>(false)

    type InvalidAbiResult = IsAbi<'foo'>
    assertType<InvalidAbiResult>(false)
  })
})

describe('Function', () => {
  test('ExtractAbiFunctions', () => {
    const abiFunction = {
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'a', type: 'uint256' }],
      name: 'foo',
      outputs: [],
    } as const
    assertType<ExtractAbiFunctions<[typeof abiFunction]>>(abiFunction)
    assertType<ExtractAbiFunctions<[]>>(undefined as never)
  })

  test('ExtractAbiFunctionNames', () => {
    assertType<ExtractAbiFunctionNames<typeof wagmiMintExampleAbi>>('symbol')
    assertType<ExtractAbiFunctionNames<[]>>(undefined as never)
  })

  test('ExtractAbiFunction', () => {
    test('default', () => {
      assertType<ExtractAbiFunction<typeof wagmiMintExampleAbi, 'tokenURI'>>({
        inputs: [
          {
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'tokenURI',
        outputs: [{ type: 'string' }],
        stateMutability: 'pure',
        type: 'function',
      })
    })

    test('with overloads', () => {
      type Result = ExtractAbiFunction<
        typeof wagmiMintExampleAbi,
        'safeTransferFrom'
      >
      assertType<Result>({
        inputs: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      })
      assertType<Result>({
        inputs: [
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
          { name: 'tokenId', type: 'uint256' },
          { name: '_data', type: 'bytes' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      })
    })
  })
})

describe('Events', () => {
  test('ExtractAbiEvents', () => {
    const abiEvent = {
      type: 'event',
      anonymous: false,
      inputs: [{ name: 'a', type: 'uint256' }],
      name: 'foo',
    } as const
    assertType<ExtractAbiEvents<[typeof abiEvent]>>(abiEvent)
    assertType<ExtractAbiEvents<[]>>(undefined as never)
  })

  test('ExtractAbiEventNames', () => {
    assertType<ExtractAbiEventNames<typeof wagmiMintExampleAbi>>(
      'ApprovalForAll',
    )
    assertType<ExtractAbiEventNames<[]>>(undefined as never)
  })

  test('ExtractAbiEvent', () => {
    assertType<ExtractAbiEvent<typeof wagmiMintExampleAbi, 'Transfer'>>({
      inputs: [
        {
          indexed: true,
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          name: 'to',
          type: 'address',
        },
        {
          indexed: true,
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    })
  })
})

describe('Error', () => {
  test('ExtractAbiErrors', () => {
    const abiError = {
      type: 'error',
      inputs: [{ name: 'a', type: 'uint256' }],
      name: 'foo',
    } as const
    assertType<ExtractAbiErrors<[typeof abiError]>>(abiError)
    assertType<ExtractAbiErrors<[]>>(undefined as never)
  })

  test('ExtractAbiErrorNames', () => {
    assertType<
      ExtractAbiErrorNames<
        [
          {
            type: 'error'
            inputs: [{ name: 'a'; type: 'uint256' }]
            name: 'foo'
          },
        ]
      >
    >('foo')
    assertType<ExtractAbiErrorNames<[]>>(undefined as never)
  })

  test('ExtractAbiError', () => {
    const abiError = {
      type: 'error',
      inputs: [{ name: 'a', type: 'uint256' }],
      name: 'foo',
    } as const
    assertType<ExtractAbiError<[typeof abiError], 'foo'>>(abiError)
  })
})

describe('TypedDataToPrimitiveTypes', () => {
  const contributor = {
    name: 'John Doe',
    address: '0x0000000000000000000000000000000000000000' as const,
  }
  const website = {
    domain: 'example.com',
    webmaster: contributor,
  }

  test('single', () => {
    const types = {
      Contributor: [
        { name: 'name', type: 'string' },
        { name: 'address', type: 'address' },
      ],
    } as const
    type Result = TypedDataToPrimitiveTypes<typeof types>
    assertType<Result>({ Contributor: contributor })

    // @ts-expect-error key `Foo` does not exist
    assertType<Result>({ Foo: contributor })
    // @ts-expect-error Incorrect data type for `Contributor`
    assertType<Result>({ Contributor: { foo: 'bar' } })
  })

  test('nested struct', () => {
    const types = {
      Contributor: [
        { name: 'name', type: 'string' },
        { name: 'address', type: 'address' },
      ],
      Website: [
        { name: 'domain', type: 'string' },
        { name: 'webmaster', type: 'Contributor' },
      ],
    } as const
    type Result = TypedDataToPrimitiveTypes<typeof types>
    assertType<Result>({ Contributor: contributor, Website: website })
  })

  test('deeply nested structs', () => {
    const types = {
      Contributor: [
        { name: 'name', type: 'string' },
        { name: 'address', type: 'address' },
      ],
      Website: [
        { name: 'domain', type: 'string' },
        { name: 'webmaster', type: 'Contributor' },
      ],
      Project: [
        { name: 'name', type: 'string' },
        { name: 'contributors', type: 'Contributor[2]' },
        { name: 'website', type: 'Website' },
      ],
      Organization: [
        { name: 'name', type: 'string' },
        { name: 'projects', type: 'Project[]' },
        { name: 'website', type: 'Website' },
      ],
    } as const
    type Result = TypedDataToPrimitiveTypes<typeof types>
    const project: Result['Project'] = {
      name: 'My Project',
      contributors: [contributor, contributor],
      website,
    }
    assertType<Result>({
      Contributor: contributor,
      Website: website,
      Project: project,
      Organization: {
        name: 'My Organization',
        projects: [project, project],
        website,
      },
    })
  })

  test('behavior', () => {
    test('self-referencing struct', () => {
      const types = {
        Name: [
          { name: 'first', type: 'Name' },
          { name: 'last', type: 'string' },
        ],
      } as const
      type Result = TypedDataToPrimitiveTypes<typeof types>
      assertType<Result>({
        Name: {
          first: [
            "Error: Cannot convert self-referencing struct 'Name' to primitive type.",
          ],
          last: 'Meagher',
        },
      })
    })

    test('recursive structs', () => {
      const types = {
        Foo: [{ name: 'bar', type: 'Bar' }],
        Bar: [{ name: 'foo', type: 'Foo' }],
      } as const
      type Result = TypedDataToPrimitiveTypes<typeof types>
      expectTypeOf<Result>().toEqualTypeOf<{
        readonly Foo: {
          bar: {
            foo: [
              "Error: Circular reference detected. 'Foo' is a circular reference.",
            ]
          }
        }
        readonly Bar: {
          foo: {
            bar: [
              "Error: Circular reference detected. 'Bar' is a circular reference.",
            ]
          }
        }
      }>()

      const types2 = {
        Foo: [{ name: 'bar', type: 'Bar[]' }],
        Bar: [{ name: 'foo', type: 'Foo' }],
      } as const
      type Result2 = TypedDataToPrimitiveTypes<typeof types2>
      expectTypeOf<Result2>().toEqualTypeOf<{
        readonly Foo: {
          bar: readonly {
            foo: [
              "Error: Circular reference detected. 'Foo' is a circular reference.",
            ]
          }[]
        }
        readonly Bar: {
          foo: {
            bar: readonly {
              foo: [
                "Error: Circular reference detected. 'Foo' is a circular reference.",
              ]
            }[]
          }
        }
      }>()

      const types3 = {
        Foo: [{ name: 'bar', type: 'Bar[]' }],
        Bar: [{ name: 'foo', type: 'Foo[]' }],
      } as const
      type Result3 = TypedDataToPrimitiveTypes<typeof types3>
      expectTypeOf<Result3>().toEqualTypeOf<{
        readonly Foo: {
          bar: readonly {
            foo: readonly [
              "Error: Circular reference detected. 'Foo[]' is a circular reference.",
            ][]
          }[]
        }
        readonly Bar: {
          foo: readonly {
            bar: readonly [
              "Error: Circular reference detected. 'Bar[]' is a circular reference.",
            ][]
          }[]
        }
      }>()
    })
  })

  test('unknown struct', () => {
    const types = {
      Name: [
        { name: 'first', type: 'Foo' },
        { name: 'last', type: 'string' },
      ],
    } as const
    type Result = TypedDataToPrimitiveTypes<typeof types>
    assertType<Result>({
      Name: {
        first: ["Error: Cannot convert unknown type 'Foo' to primitive type."],
        last: 'Meagher',
      },
    })
  })

  test('IsTypedData', () => {
    type Result = IsTypedData<{
      Person: [
        { name: 'name'; type: 'string' },
        { name: 'wallet'; type: 'address' },
      ]
      Mail: [
        { name: 'from'; type: 'Person' },
        { name: 'to'; type: 'Person' },
        { name: 'contents'; type: 'string' },
      ]
    }>
    assertType<Result>(true)

    type Result2 = IsTypedData<{
      Person: [
        { name: 'name'; type: 'string' },
        { name: 'wallet'; type: 'Foo' },
      ] // `Foo` does not exist in schema
      Mail: [
        { name: 'from'; type: 'Person' },
        { name: 'to'; type: 'Person' },
        { name: 'contents'; type: 'string' },
      ]
    }>
    assertType<Result2>(false)
  })
})
