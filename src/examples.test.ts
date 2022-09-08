import {
  address,
  ensRegistryWithFallbackAbi,
  expectType,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  test,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../test'

import { Abi, Address } from './abi'
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
        args: [123],
      })
      expectType<string>(result)
    })

    test('two or more', () => {
      const result = readContract({
        address,
        abi: writingEditionsFactoryAbi,
        functionName: 'predictDeterministicAddress',
        args: [address, 'foo'],
      })
      expectType<Address>(result)
    })
  })

  test('return types', () => {
    test('string', () => {
      const result = readContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'symbol',
      })
      expectType<string>(result)
    })

    test('Address', () => {
      const result = readContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'ownerOf',
        args: [123],
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
      expectType<number | bigint>(result)
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
      expectType<any>(result1)
      expectType<any>(result2)
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
      expectType<any>(result1)
      expectType<any>(result2)
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
      expectType<any>(result1)
      expectType<any>(result2)
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
        args: [123],
      })
      expectType<void>(result)
    })

    test('two or more', () => {
      const result1 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'approve',
        args: [address, 123],
      })
      const result2 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'transferFrom',
        args: [address, address, 123],
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
            limit: 100,
            fundingRecipient: address,
            renderer: address,
            nonce: 123,
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
        args: ['foo', 'bar', address],
      })
      expectType<string | ArrayLike<number>>(result)
    })

    test('tuple', () => {
      const contractInterface = [
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
        abi: contractInterface,
        functionName: 'foo',
      })
      expectType<Output>(result)
    })

    test('tuple[]', () => {
      const result = writeContract({
        address,
        abi: nestedTupleArrayAbi,
        functionName: 'f',
        args: [{ a: 1, b: [2], c: [{ x: 1, y: 1 }] }, { x: 1, y: 1 }, 1],
      })
      expectType<void>(result)
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
      expectType<void>(result)
    })

    test('function with overrides', () => {
      const result1 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'safeTransferFrom',
        args: [address, address, 123],
      })
      expectType<void>(result1)

      const result2 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'safeTransferFrom',
        args: [address, address, 123, 'foo'],
      })
      expectType<void>(result2)
    })

    test('works without const assertion', () => {
      const contractInterface = [
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
        abi: contractInterface,
        functionName: 'foo',
        args: ['bar'],
      })
      expectType<any>(result)
    })

    test('declared as Abi type', () => {
      const contractInterface: Abi = [
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
        abi: contractInterface,
        functionName: 'foo',
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
      const contractInterface = [
        {
          name: 'Foo',
          type: 'event',
          inputs: [],
          anonymous: false,
        },
      ] as const
      watchContractEvent({
        address,
        abi: contractInterface,
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
          expectType<number | bigint>(tokenId)
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
      const result = readContracts([
        {
          address,
          abi: wagmiMintExampleAbi,
          functionName: 'name' as const,
        },
        {
          address,
          abi: nounsAuctionHouseAbi,
          functionName: 'auction' as const,
        },
      ])
      expectType<
        [
          string,
          readonly [
            number | bigint,
            number | bigint,
            number | bigint,
            number | bigint,
            Address,
            boolean,
          ],
        ]
      >(result)
    })

    test('one', () => {
      const result = readContracts([
        {
          address,
          abi: wagmiMintExampleAbi,
          functionName: 'balanceOf' as const,
          args: [address],
        },
        {
          address,
          abi: wagmiMintExampleAbi,
          functionName: 'ownerOf' as const,
          args: [123],
        },
      ])
      expectType<[number | bigint, Address]>(result)
    })

    test('two or more', () => {
      const result = readContracts([
        {
          address,
          abi: nestedTupleArrayAbi,
          functionName: 'v' as const,
          args: [
            [
              { a: 1, b: [2] },
              { a: 1, b: [2] },
            ],
            { x: 5, y: 6 },
            7,
          ],
        },
        {
          address,
          abi: writingEditionsFactoryAbi,
          functionName: 'getSalt' as const,
          args: [
            address,
            {
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
          ],
        },
      ])
      expectType<[void, string | ArrayLike<number>]>(result)
    })
  })

  test('behavior', () => {
    test('write function not allowed', () => {
      const result = readContracts([
        {
          address,
          abi: wagmiMintExampleAbi,
          // @ts-expect-error Trying to use non-read function
          functionName: 'approve',
        },
      ])
      expectType<any>(result)
    })
  })
})

test('signTypedData', () => {
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
    types,
    value: {
      first: 'Tom',
      last: 'Meagher',
    },
  })

  signTypedData({
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
    types,
    value: {
      first: 'Tom',
      // @ts-expect-error wrong type
      last: 123,
    },
  })

  signTypedData({
    types,
    // @ts-expect-error missing `name` property
    value: {
      wallet: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
      favoriteColors: ['gray', 'forest green', 'orange'],
      age: 29,
    },
  })
})
