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
  watchContractEvent,
  writeContract,
} from './examples'

test('readContract', () => {
  test('args', () => {
    test('zero', () => {
      const result = readContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'name',
      })
      expectType<string>(result)
    })

    test('one', () => {
      const result = readContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'tokenURI',
        args: [123],
      })
      expectType<string>(result)
    })

    test('two or more', () => {
      const result = readContract({
        address,
        contractInterface: writingEditionsFactoryAbi,
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
        contractInterface: wagmiMintExampleAbi,
        functionName: 'symbol',
      })
      expectType<string>(result)
    })

    test('Address', () => {
      const result = readContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'ownerOf',
        args: [123],
      })
      expectType<Address>(result)
    })

    test('number', () => {
      const result = readContract({
        address,
        contractInterface: wagmiMintExampleAbi,
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
        contractInterface: wagmiMintExampleAbi,
        // @ts-expect-error Trying to use non-read function
        functionName: 'approve',
      })
      expectType<any>(result)
    })

    test('without const assertion', () => {
      const contractInterface = [
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
        contractInterface,
        functionName: 'foo',
      })
      const result2 = readContract({
        address,
        contractInterface,
        functionName: 'bar',
        args: [address],
      })
      expectType<any>(result1)
      expectType<any>(result2)
    })

    test('declared as Abi type', () => {
      const contractInterface: Abi = [
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
        contractInterface,
        functionName: 'foo',
      })
      const result2 = readContract({
        address,
        contractInterface,
        functionName: 'bar',
        args: [address],
      })
      expectType<any>(result1)
      expectType<any>(result2)
    })

    test('defined inline', () => {
      const result1 = readContract({
        address,
        contractInterface: [
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
        contractInterface: [
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
      expectType<Address[] | string[]>(result1)
      expectType<Address[] | string[]>(result2)
    })
  })
})

test('writeContract', () => {
  test('args', () => {
    test('zero', () => {
      const result = writeContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'mint',
      })
      expectType<void>(result)
    })

    test('one', () => {
      const result = writeContract({
        address,
        contractInterface: nounsAuctionHouseAbi,
        functionName: 'createBid',
        args: [123],
      })
      expectType<void>(result)
    })

    test('two or more', () => {
      const result1 = writeContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'approve',
        args: [address, 123],
      })
      const result2 = writeContract({
        address,
        contractInterface: wagmiMintExampleAbi,
        functionName: 'transferFrom',
        args: [address, address, 123],
      })
      expectType<void>(result1)
      expectType<void>(result2)
    })

    test('tuple', () => {
      expectType<Address>(
        writeContract({
          address,
          contractInterface: writingEditionsFactoryAbi,
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
        }),
      )
    })
  })

  test('return types', () => {
    test('void', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: nounsAuctionHouseAbi,
          functionName: 'pause',
        }),
      )
    })

    test('bytes32', () => {
      expectType<string | ArrayLike<number>>(
        writeContract({
          address,
          contractInterface: ensRegistryWithFallbackAbi,
          functionName: 'setSubnodeOwner',
          args: ['foo', 'bar', address],
        }),
      )
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
      expectType<Output>(
        writeContract({
          address,
          contractInterface,
          functionName: 'foo',
        }),
      )
    })

    test('tuple[]', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: nestedTupleArrayAbi,
          functionName: 'f',
          args: [{ a: 1, b: [2], c: [{ x: 1, y: 1 }] }, { x: 1, y: 1 }, 1],
        }),
      )
    })
  })

  test('behavior', () => {
    test('read function not allowed', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          // @ts-expect-error Trying to use read function
          functionName: 'symbol',
        }),
      )
    })

    test('function with overrides', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'safeTransferFrom',
          args: [address, address, 123],
        }),
      )

      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'safeTransferFrom',
          args: [address, address, 123, 'foo'],
        }),
      )
    })

    test('works without const assertion', () => {
      const contractInterface = [
        {
          name: 'foo',
          type: 'function',
          stateMutability: 'payable',
          inputs: [],
          outputs: [{ type: 'string', name: '' }],
        },
      ]
      expectType<any>(
        writeContract({
          address,
          contractInterface,
          functionName: 'foo',
        }),
      )
    })
  })
})

test('readContracts', () => {
  readContracts({
    contracts: [
      {
        contractInterface: [
          {
            inputs: [{ name: 'owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
          {
            inputs: [{ name: 'tokenId', type: 'uint256' }],
            name: 'tokenURI',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        functionName: 'string',
      } as const,
      // {
      //   contractInterface: [
      //     {
      //       inputs: [
      //         { name: 'tokenId', type: 'address' },
      //         { name: 'value', type: 'uint256' },
      //       ],
      //       name: 'boo',
      //       outputs: [{ name: '', type: 'uint256' }],
      //       stateMutability: 'view',
      //       type: 'function',
      //     },
      //   ],
      //   functionName: 'boo',
      //   args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', 123],
      // },
    ],
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
        contractInterface,
        eventName: 'Foo',
        // @ts-expect-error no args allowed
        listener(_arg) {
          expectType<boolean>(true)
        },
      })
    })

    test('one', () => {
      watchContractEvent({
        address,
        contractInterface: writingEditionsFactoryAbi,
        eventName: 'FactoryGuardSet',
        listener(guard) {
          expectType<boolean>(guard)
        },
      })
    })

    test('two or more', () => {
      watchContractEvent({
        address,
        contractInterface: wagmiMintExampleAbi,
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
        contractInterface: [
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
          expectType<string>(name)
        },
      })
    })
  })
})
