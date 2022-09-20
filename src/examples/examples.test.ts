import {
  address,
  ensRegistryWithFallbackAbi,
  expectType,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  test,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../../test'

import { Abi, Address } from '../abi'
import { ResolvedConfig } from '../config'
import {
  readContract,
  readContracts,
  signTypedData,
  watchContractEvent,
  writeContract,
} from './examples'

test('readContract', () => {
  test('args', () => {
    test('zero', () => {
      const result = readContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'name',
      })
      expectType<string>(result)
    })

    test('one', () => {
      const result = readContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'tokenURI',
        args: [123n],
      })
      expectType<string>(result)
    })

    test('two or more', () => {
      const result = readContract({
        address,
        abi: writingEditionsFactoryAbi,
        functionName: 'predictDeterministicAddress',
        args: [address, '0xfoo'],
      })
      expectType<Address>(result)
    })
  })

  test('return types', () => {
    test('string', () => {
      const result = readContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'name',
      })
      expectType<string>(result)
    })

    test('Address', () => {
      const result = readContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'ownerOf',
        args: [123n],
      })
      expectType<Address>(result)
    })

    test('number', () => {
      const result = readContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'balanceOf',
        args: [address],
      })
      expectType<ResolvedConfig['BigIntType']>(result)
    })
  })

  test('behavior', () => {
    test('write function not allowed', () => {
      const result = readContract({
        address,
        abi: wagmiMintExampleAbi,
        // @ts-expect-error Trying to use non-read function
        functionName: 'approve',
      })
      expectType<any>(result)
    })

    test('without const assertion', () => {
      const abi = [
        {
          name: 'foo',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'string', name: '' }],
        },
        {
          name: 'bar',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ type: 'address', name: '' }],
          outputs: [{ type: 'address', name: '' }],
        },
      ]
      const result1 = readContract({
        address,
        abi: abi,
        functionName: 'foo',
      })
      const result2 = readContract({
        address,
        abi: abi,
        functionName: 'bar',
        args: [address],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      expectType<Result1>('hello')
      expectType<Result2>('0x123')
    })

    test('declared as Abi type', () => {
      const abi: Abi = [
        {
          name: 'foo',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'string', name: '' }],
        },
        {
          name: 'bar',
          type: 'function',
          stateMutability: 'view',
          inputs: [{ type: 'address', name: '' }],
          outputs: [{ type: 'address', name: '' }],
        },
      ]
      const result1 = readContract({
        address,
        abi: abi,
        functionName: 'foo',
      })
      const result2 = readContract({
        address,
        abi: abi,
        functionName: 'bar',
        args: [address],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      expectType<Result1>('hello')
      expectType<Result2>('0x123')
    })

    test('defined inline', () => {
      const result1 = readContract({
        address,
        abi: [
          {
            name: 'foo',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ type: 'string', name: '' }],
          },
          {
            name: 'bar',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ type: 'address', name: '' }],
            outputs: [{ type: 'address', name: '' }],
          },
        ],
        functionName: 'foo',
        args: [],
      })
      const result2 = readContract({
        address,
        abi: [
          {
            name: 'foo',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ type: 'string', name: '' }],
          },
          {
            name: 'bar',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ type: 'address', name: '' }],
            outputs: [{ type: 'address', name: '' }],
          },
        ],
        functionName: 'bar',
        args: [address],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      expectType<Result1>('hello')
      expectType<Result2>('0x123')
    })
  })
})

test('writeContract', () => {
  test('args', () => {
    test('zero', () => {
      const result = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'mint',
      })
      expectType<void>(result)
    })

    test('one', () => {
      const result = writeContract({
        address,
        abi: nounsAuctionHouseAbi,
        functionName: 'createBid',
        args: [123n],
      })
      expectType<void>(result)
    })

    test('two or more', () => {
      const result1 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'approve',
        args: [address, 123n],
      })
      const result2 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'transferFrom',
        args: [address, address, 123n],
      })
      expectType<void>(result1)
      expectType<void>(result2)
    })

    test('tuple', () => {
      const result = writeContract({
        address,
        abi: writingEditionsFactoryAbi,
        functionName: 'create',
        args: [
          {
            name: 'Test',
            symbol: '$TEST',
            description: 'Foo bar baz',
            imageURI: 'ipfs://hash',
            contentURI: 'arweave://digest',
            price: 0.1,
            limit: 100n,
            fundingRecipient: address,
            renderer: address,
            nonce: 123n,
            fee: 0,
          },
        ],
      })
      expectType<Address>(result)
    })
  })

  test('return types', () => {
    test('void', () => {
      const result = writeContract({
        address,
        abi: nounsAuctionHouseAbi,
        functionName: 'pause',
      })
      expectType<void>(result)
    })

    test('bytes32', () => {
      const result = writeContract({
        address,
        abi: ensRegistryWithFallbackAbi,
        functionName: 'setSubnodeOwner',
        args: ['0xfoo', '0xbar', address],
      })
      expectType<ResolvedConfig['BytesType']>(result)
    })

    test('tuple', () => {
      const abi = [
        {
          type: 'function',
          name: 'foo',
          stateMutability: 'payable',
          inputs: [],
          outputs: [
            {
              components: [
                { name: 'name', type: 'string' },
                { name: 'symbol', type: 'string' },
                { name: 'fundingRecipient', type: 'address' },
              ],
              name: 'foo',
              type: 'tuple',
            },
          ],
        },
      ] as const
      type Output = {
        name: string
        symbol: string
        fundingRecipient: Address
      }
      const result = writeContract({
        address,
        abi,
        functionName: 'foo',
      })
      expectType<Output>(result)
    })

    test('tuple[]', () => {
      const result = writeContract({
        address,
        abi: nestedTupleArrayAbi,
        functionName: 'f',
        args: [{ a: 1, b: [2], c: [{ x: 1, y: 1 }] }, { x: 1, y: 1 }, 1n],
      })
      expectType<
        readonly {
          x: ResolvedConfig['BigIntType']
          y: ResolvedConfig['BigIntType']
        }[]
      >(result)
    })
  })

  test('behavior', () => {
    test('read function not allowed', () => {
      const result = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        // @ts-expect-error Trying to use read function
        functionName: 'symbol',
      })
      expectType<string>(result)
    })

    test('function with overloads', () => {
      const result1 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'safeTransferFrom',
        args: [address, address, 123n],
      })
      expectType<void>(result1)

      const result2 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'safeTransferFrom',
        args: [address, address, 123n, '0xfoo'],
      })
      expectType<void>(result2)
    })

    test('works without const assertion', () => {
      const abi = [
        {
          name: 'foo',
          type: 'function',
          stateMutability: 'payable',
          inputs: [{ type: 'string', name: '' }],
          outputs: [{ type: 'string', name: '' }],
        },
      ]
      const result = writeContract({
        address,
        abi,
        functionName: 'foo',
        args: ['bar'],
      })
      expectType<any>(result)
    })

    test('declared as Abi type', () => {
      const abi: Abi = [
        {
          name: 'foo',
          type: 'function',
          stateMutability: 'payable',
          inputs: [{ type: 'string', name: '' }],
          outputs: [{ type: 'string', name: '' }],
        },
      ]
      const result = writeContract({
        address,
        abi,
        functionName: 'foo',
        args: ['bar'],
      })
      expectType<any>(result)
    })

    test('defined inline', () => {
      const result = writeContract({
        address,
        abi: [
          {
            name: 'foo',
            type: 'function',
            stateMutability: 'payable',
            inputs: [{ type: 'string', name: '' }],
            outputs: [{ type: 'string', name: '' }],
          },
        ],
        functionName: 'foo',
        args: ['bar'],
      })
      expectType<any>(result)
    })
  })
})

test('watchContractEvent', () => {
  test('args', () => {
    test('zero', () => {
      const abi = [
        {
          name: 'Foo',
          type: 'event',
          inputs: [],
          anonymous: false,
        },
      ] as const
      watchContractEvent({
        address,
        abi,
        eventName: 'Foo',
        // @ts-expect-error no args allowed
        listener(_arg) {
          return
        },
      })
    })

    test('one', () => {
      watchContractEvent({
        address,
        abi: writingEditionsFactoryAbi,
        eventName: 'FactoryGuardSet',
        listener(guard) {
          expectType<boolean>(guard)
        },
      })
    })

    test('two or more', () => {
      watchContractEvent({
        address,
        abi: wagmiMintExampleAbi,
        eventName: 'Transfer',
        listener(from, to, tokenId) {
          expectType<Address>(from)
          expectType<Address>(to)
          expectType<ResolvedConfig['BigIntType']>(tokenId)
        },
      })
    })
  })

  test('behavior', () => {
    test('works without const assertion', () => {
      watchContractEvent({
        address,
        abi: [
          {
            name: 'Foo',
            type: 'event',
            inputs: [
              {
                indexed: true,
                name: 'name',
                type: 'string',
              },
            ],
            anonymous: false,
          },
        ],
        eventName: 'Foo',
        listener(name) {
          expectType<any>(name)
        },
      })
    })
  })
})

test('readContracts', () => {
  test('args', () => {
    test('zero', () => {
      const result = readContracts({
        contracts: [
          {
            address,
            abi: wagmiMintExampleAbi,
            functionName: 'name',
          },
          {
            address,
            abi: nounsAuctionHouseAbi,
            functionName: 'auction',
          },
        ],
      })
      expectType<
        [
          string,
          {
            nounId: ResolvedConfig['BigIntType']
            amount: ResolvedConfig['BigIntType']
            startTime: ResolvedConfig['BigIntType']
            endTime: ResolvedConfig['BigIntType']
            bidder: Address
            settled: boolean
          } & readonly [
            ResolvedConfig['BigIntType'],
            ResolvedConfig['BigIntType'],
            ResolvedConfig['BigIntType'],
            ResolvedConfig['BigIntType'],
            Address,
            boolean,
          ],
        ]
      >(result)
    })

    test('one', () => {
      const result = readContracts({
        contracts: [
          {
            address,
            abi: wagmiMintExampleAbi,
            functionName: 'balanceOf',
            args: [address],
          },
          {
            address,
            abi: wagmiMintExampleAbi,
            functionName: 'ownerOf',
            args: [123n],
          },
        ],
      })
      expectType<[ResolvedConfig['BigIntType'], Address]>(result)
    })

    test('two or more', () => {
      const result = readContracts({
        contracts: [
          {
            address,
            abi: nestedTupleArrayAbi,
            functionName: 'v',
            args: [
              [
                { a: 1, b: [2] },
                { a: 1, b: [2] },
              ],
              { x: 5, y: 6 },
              7n,
            ],
          },
          {
            address,
            abi: writingEditionsFactoryAbi,
            functionName: 'getSalt',
            args: [
              address,
              {
                name: 'Test',
                symbol: '$TEST',
                description: 'Foo bar baz',
                imageURI: 'ipfs://hash',
                contentURI: 'arweave://digest',
                price: 0.1,
                limit: 100n,
                fundingRecipient: address,
                renderer: address,
                nonce: 123n,
                fee: 0,
              },
            ],
          },
        ],
      })
      expectType<[void, ResolvedConfig['BytesType']]>(result)
    })
  })

  test('behavior', () => {
    test('write function not allowed', () => {
      const result = readContracts({
        contracts: [
          {
            address,
            abi: wagmiMintExampleAbi,
            // @ts-expect-error Trying to use non-read function
            functionName: 'approve',
          },
        ],
      })
      expectType<any>(result)
    })

    test('mixed result', () => {
      const result = readContracts({
        contracts: [
          {
            address,
            abi: wagmiMintExampleAbi,
            functionName: 'tokenURI',
            args: [1n],
          },
          {
            address,
            abi: writingEditionsFactoryAbi,
            functionName: 'predictDeterministicAddress',
            args: [address, address],
          },
          {
            address,
            abi: [
              {
                type: 'function',
                name: 'balanceOf',
                stateMutability: 'view',
                inputs: [
                  { type: 'address[]', name: 'owner' },
                  { type: 'address[1]', name: 'owner' },
                  { type: 'uint256', name: 'id' },
                ],
                outputs: [{ type: 'uint256', name: 'balance' }],
              },
            ],
            functionName: 'balanceOf',
            args: [[address], [address], 1n],
          },
        ],
      })
      type Result = typeof result
      //   ^?
      type Expected = [string, `0x${string}`, any] extends Result ? true : false
      expectType<Expected>(true)
    })
  })
})

test('signTypedData', () => {
  test('basic', () => {
    const domain = {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    } as const
    const types = {
      Person: [
        { name: 'name', type: 'Name' },
        { name: 'wallet', type: 'address' },
        { name: 'favoriteColors', type: 'string[3]' },
        { name: 'age', type: 'uint8' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
      Name: [
        { name: 'first', type: 'string' },
        { name: 'last', type: 'string' },
      ],
    } as const

    signTypedData({
      domain,
      types,
      value: {
        first: 'Tom',
        last: 'Meagher',
      },
    })

    signTypedData({
      domain,
      types,
      value: {
        name: {
          first: 'Tom',
          last: 'Meagher',
        },
        wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
        favoriteColors: ['gray', 'forest green', 'orange'],
        age: 29,
      },
    })

    signTypedData({
      domain,
      types,
      value: {
        from: {
          name: {
            first: 'Tom',
            last: 'Meagher',
          },
          wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
          favoriteColors: ['gray', 'forest green', 'orange'],
          age: 29,
        },
        to: {
          name: {
            first: 'Foo',
            last: 'Bar',
          },
          wallet: '0xd2135CfB216b74109775236E36d4b433F1DF507B',
          favoriteColors: ['purple', 'red', 'blue'],
          age: 69,
        },
        contents: 'Hello, Foo!',
      },
    })

    signTypedData({
      domain,
      types,
      value: {
        first: 'Tom',
        // @ts-expect-error wrong type
        last: 123,
      },
    })

    signTypedData({
      domain,
      types,
      // @ts-expect-error missing `name` property
      value: {
        wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
        favoriteColors: ['gray', 'forest green', 'orange'],
        age: 29,
      },
    })
  })

  test('deeply nested structs', () => {
    const domain = {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    } as const
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
      ],
    } as const

    signTypedData({
      domain,
      types,
      value: {
        name: 'John Doe',
        address: '0x0000000000000000000000000000000000000000',
      },
    })

    signTypedData({
      domain,
      types,
      value: {
        name: 'My Organization',
        projects: [
          {
            name: 'My Project',
            contributors: [
              {
                name: 'John Doe',
                address: '0x0000000000000000000000000000000000000000',
              },
              {
                name: 'John Doe',
                address: '0x0000000000000000000000000000000000000000',
              },
            ],
            website: {
              domain: 'example.com',
              webmaster: {
                name: 'John Doe',
                address: '0x0000000000000000000000000000000000000000',
              },
            },
          },
        ],
      },
    })
  })
})
