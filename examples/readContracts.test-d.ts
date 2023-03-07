import type { ResolvedConfig } from 'abitype'
import {
  address,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from 'abitype/test'
import { assertType, test } from 'vitest'

import { readContracts } from './readContracts'

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
      assertType<
        [
          string,
          {
            nounId: ResolvedConfig['BigIntType']
            amount: ResolvedConfig['BigIntType']
            startTime: ResolvedConfig['BigIntType']
            endTime: ResolvedConfig['BigIntType']
            bidder: ResolvedConfig['AddressType']
            settled: boolean
          } & readonly [
            ResolvedConfig['BigIntType'],
            ResolvedConfig['BigIntType'],
            ResolvedConfig['BigIntType'],
            ResolvedConfig['BigIntType'],
            ResolvedConfig['AddressType'],
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
      assertType<[ResolvedConfig['BigIntType'], ResolvedConfig['AddressType']]>(
        result,
      )
    })

    test('Read bytes input types', () => {
      const result = readContracts({
        contracts: [
          {
            address,
            abi: wagmiMintExampleAbi,
            functionName: 'supportsInterface',
            args: ['0xfoobar'],
            //^?
          },
        ],
      })
      assertType<[boolean]>(result)
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
              { x: 5n, y: 6n },
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
      assertType<[void, ResolvedConfig['BytesType']['outputs']]>(result)
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
      assertType<[void]>(result)
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
      type Expected = Result extends [string, `0x${string}`, bigint]
        ? true
        : false
      assertType<Expected>(true)
    })

    test('without const assertion', () => {
      const contracts = [
        {
          address,
          abi: wagmiMintExampleAbi,
          functionName: 'tokenURI',
          args: [1n],
        },
        {
          address,
          abi: wagmiMintExampleAbi,
          functionName: 'balanceOf',
          args: ['0x…'],
        },
      ]
      const result = readContracts({
        contracts,
      })
      assertType<unknown[]>(result)
    })
  })
})
