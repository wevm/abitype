import type { Abi, ResolvedConfig } from 'abitype'
import { parseAbi } from 'abitype'
import {
  ensRegistryWithFallbackAbi,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  wagmiMintExampleHumanReadableAbi,
  writingEditionsFactoryAbi,
  zeroAddress,
} from 'abitype/test'
import { assertType, test } from 'vitest'

import { write } from './write.js'

test('write', () => {
  test('args', () => {
    test('zero', () => {
      const result = write({
        abi: wagmiMintExampleAbi,
        functionName: 'mint',
      })
      assertType<void>(result)
    })

    test('one', () => {
      const result = write({
        abi: nounsAuctionHouseAbi,
        functionName: 'createBid',
        args: [123n],
      })
      assertType<void>(result)
    })

    test('two or more', () => {
      const result1 = write({
        abi: wagmiMintExampleAbi,
        functionName: 'approve',
        args: [zeroAddress, 123n],
      })
      const result2 = write({
        abi: wagmiMintExampleAbi,
        functionName: 'transferFrom',
        args: [zeroAddress, zeroAddress, 123n],
      })
      assertType<void>(result1)
      assertType<void>(result2)
    })

    test('tuple', () => {
      const result = write({
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
            fundingRecipient: zeroAddress,
            renderer: zeroAddress,
            nonce: 123n,
            fee: 0,
          },
        ],
      })
      assertType<ResolvedConfig['AddressType']>(result)

      write({
        abi: parseAbi([
          'struct WritingEdition { string name; }',
          'function create(WritingEdition edition) returns (address clone)',
        ]),
        functionName: 'create',
        args: [
          {
            name: 'Test',
            // @ts-expect-error more keys than in the struct
            symbol: '$TEST',
          },
        ],
      })
    })
  })

  test('return types', () => {
    test('void', () => {
      const result = write({
        abi: nounsAuctionHouseAbi,
        functionName: 'pause',
      })
      assertType<void>(result)
    })

    test('bytes32', () => {
      const result = write({
        abi: ensRegistryWithFallbackAbi,
        functionName: 'setSubnodeOwner',
        args: ['0xfoo', '0xbar', zeroAddress],
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
      const result = write({
        abi,
        functionName: 'foo',
      })
      assertType<Output>(result)
    })

    test('tuple[]', () => {
      const result = write({
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
      const result = write({
        abi: wagmiMintExampleAbi,
        // @ts-expect-error Trying to use read function
        functionName: 'symbol',
      })
      assertType<string>(result)
    })

    test('function with overloads', () => {
      const result1 = write({
        abi: wagmiMintExampleAbi,
        functionName: 'safeTransferFrom',
        args: [zeroAddress, zeroAddress, 123n],
      })
      assertType<void>(result1)

      const result2 = write({
        abi: wagmiMintExampleAbi,
        functionName: 'safeTransferFrom',
        args: [zeroAddress, zeroAddress, 123n, '0xfoo'],
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
      const result = write({
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
      const result = write({
        abi,
        functionName: 'foo',
        args: ['bar'],
      })
      assertType<typeof result>(result as unknown)
    })

    test('defined inline', () => {
      const result = write({
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

    test('human readable', () => {
      const result = write({
        abi: parseAbi(wagmiMintExampleHumanReadableAbi),
        functionName: 'safeTransferFrom',
        args: [zeroAddress, zeroAddress, 123n],
      })
      assertType<void>(result)
    })
  })
})
