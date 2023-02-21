import { assertType, test } from 'vitest'

import {
  address,
  ensRegistryWithFallbackAbi,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../../test'
import type { Abi } from '../abi'
import type { ResolvedConfig } from '../config'
import { writeContract } from './writeContract'

test('writeContract', () => {
  test('args', () => {
    test('zero', () => {
      const result = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'mint',
      })
      assertType<void>(result)
    })

    test('one', () => {
      const result = writeContract({
        address,
        abi: nounsAuctionHouseAbi,
        functionName: 'createBid',
        args: [123n],
      })
      assertType<void>(result)
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
      assertType<void>(result1)
      assertType<void>(result2)
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
      assertType<ResolvedConfig['AddressType']>(result)
    })
  })

  test('return types', () => {
    test('void', () => {
      const result = writeContract({
        address,
        abi: nounsAuctionHouseAbi,
        functionName: 'pause',
      })
      assertType<void>(result)
    })

    test('bytes32', () => {
      const result = writeContract({
        address,
        abi: ensRegistryWithFallbackAbi,
        functionName: 'setSubnodeOwner',
        args: ['0xfoo', '0xbar', address],
      })
      assertType<ResolvedConfig['BytesType']['outputs']>(result)
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
        fundingRecipient: ResolvedConfig['AddressType']
      }
      const result = writeContract({
        address,
        abi,
        functionName: 'foo',
      })
      assertType<Output>(result)
    })

    test('tuple[]', () => {
      const result = writeContract({
        address,
        abi: nestedTupleArrayAbi,
        functionName: 'f',
        args: [{ a: 1, b: [2], c: [{ x: 1, y: 1 }] }, { x: 1n, y: 1n }, 1n],
      })
      assertType<
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
      assertType<string>(result)
    })

    test('function with overloads', () => {
      const result1 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'safeTransferFrom',
        args: [address, address, 123n],
      })
      assertType<void>(result1)

      const result2 = writeContract({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'safeTransferFrom',
        args: [address, address, 123n, '0xfoo'],
      })
      assertType<void>(result2)
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
      assertType<typeof result>(result as unknown)
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
      assertType<typeof result>(result as unknown)
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
            outputs: [{ type: 'address', name: '' }],
          },
        ],
        functionName: 'foo',
        args: ['bar'],
      })
      assertType<ResolvedConfig['AddressType']>(result)
    })
  })
})
