import { describe, it } from 'vitest'

import {
  address,
  ensRegistryWithFallbackAbi,
  expectType,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../test'

import { Address } from './abi'
import { readContract, watchContractEvent, writeContract } from './examples'

describe('readContract', () => {
  describe('args', () => {
    it('zero', () => {
      expectType<string>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'symbol',
        }),
      )
    })

    it('one', () => {
      expectType<string>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'tokenURI',
          args: 123,
        }),
      )
    })

    it('two or more', () => {
      expectType<Address>(
        readContract({
          address,
          contractInterface: writingEditionsFactoryAbi,
          functionName: 'predictDeterministicAddress',
          args: [address, 'foo'],
        }),
      )
    })
  })

  describe('return types', () => {
    it('string', () => {
      expectType<string>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'symbol',
        }),
      )
    })

    it('Address', () => {
      expectType<Address>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'ownerOf',
          args: 123,
        }),
      )
    })

    it('number', () => {
      expectType<number | bigint>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'balanceOf',
          args: address,
        }),
      )
    })
  })

  describe('behavior', () => {
    it('write function not allowed', () => {
      expectType<any>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          // @ts-expect-error Trying to use non-read function
          functionName: 'approve',
        }),
      )
    })

    it('works without const assertion', () => {
      const contractInterface = [
        {
          name: 'foo',
          type: 'function',
          stateMutability: 'view',
          inputs: [],
          outputs: [{ type: 'string', name: '', internalType: 'string' }],
        },
      ]
      expectType<any>(
        readContract({
          address,
          contractInterface,
          functionName: 'foo',
        }),
      )
    })
  })
})

describe('writeContract', () => {
  describe('args', () => {
    it('zero', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'mint',
        }),
      )
    })

    it('one', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: nounsAuctionHouseAbi,
          functionName: 'createBid',
          args: 123,
        }),
      )
    })

    it('two or more', () => {
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
    })

    it('tuple', () => {
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

  describe('return types', () => {
    it('void', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: nounsAuctionHouseAbi,
          functionName: 'pause',
        }),
      )
    })

    it('bytes32', () => {
      expectType<string | ArrayLike<number>>(
        writeContract({
          address,
          contractInterface: ensRegistryWithFallbackAbi,
          functionName: 'setSubnodeOwner',
          args: ['foo', 'bar', address],
        }),
      )
    })

    it('tuple', () => {
      const contractInterface = [
        {
          type: 'function',
          name: 'foo',
          stateMutability: 'payable',
          inputs: [],
          outputs: [
            {
              components: [
                { internalType: 'string', name: 'name', type: 'string' },
                { internalType: 'string', name: 'symbol', type: 'string' },
                {
                  internalType: 'address',
                  name: 'fundingRecipient',
                  type: 'address',
                },
              ],
              internalType: 'struct Foo',
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

    it('tuple[]', () => {
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

  describe('behavior', () => {
    it('read function not allowed', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          // @ts-expect-error Trying to use read function
          functionName: 'symbol',
        }),
      )
    })

    it('function with overrides', () => {
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

    it('works without const assertion', () => {
      const contractInterface = [
        {
          name: 'foo',
          type: 'function',
          stateMutability: 'payable',
          inputs: [],
          outputs: [{ type: 'string', name: '', internalType: 'string' }],
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

describe.todo('readContracts')

describe('watchContractEvent', () => {
  describe('args', () => {
    it('zero', () => {
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

    it('one', () => {
      watchContractEvent({
        address,
        contractInterface: writingEditionsFactoryAbi,
        eventName: 'FactoryGuardSet',
        listener(guard) {
          expectType<boolean>(guard)
        },
      })
    })

    it('two or more', () => {
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

  describe('behavior', () => {
    it('works without const assertion', () => {
      const contractInterface = [
        {
          name: 'Foo',
          type: 'event',
          inputs: [
            {
              indexed: true,
              internalType: 'string',
              name: 'name',
              type: 'string',
            },
          ],
          anonymous: false,
        },
      ]
      watchContractEvent({
        address,
        contractInterface,
        eventName: 'Foo',
        listener(name) {
          expectType<any>(name)
        },
      })
    })
  })
})
