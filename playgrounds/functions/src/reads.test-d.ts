import { type Address, type ResolvedRegister, parseAbi } from 'abitype'
import {
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from 'abitype/abis'
import { assertType, expectTypeOf, test } from 'vitest'

import { reads, useReads } from './reads.js'

test('args', () => {
  test('zero', () => {
    const result = reads({
      contracts: [
        {
          abi: wagmiMintExampleAbi,
          functionName: 'name',
        },
        {
          abi: nounsAuctionHouseAbi,
          functionName: 'auction',
        },
      ],
    })
    assertType<
      [
        string,
        readonly [
          ResolvedRegister['BigIntType'],
          ResolvedRegister['BigIntType'],
          ResolvedRegister['BigIntType'],
          ResolvedRegister['BigIntType'],
          ResolvedRegister['AddressType'],
          boolean,
        ],
      ]
    >(result)
  })

  test('one', () => {
    const result = reads({
      contracts: [
        {
          abi: wagmiMintExampleAbi,
          functionName: 'balanceOf',
          args: ['0x'],
        },
        {
          abi: wagmiMintExampleAbi,
          functionName: 'ownerOf',
          args: [123n],
        },
      ],
    })
    assertType<
      [ResolvedRegister['BigIntType'], ResolvedRegister['AddressType']]
    >(result)
  })

  test('Read bytes input types', () => {
    const result = reads({
      contracts: [
        {
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
    const result = reads({
      contracts: [
        {
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
          abi: writingEditionsFactoryAbi,
          functionName: 'getSalt',
          args: [
            '0x',
            {
              name: 'Test',
              symbol: '$TEST',
              description: 'Foo bar baz',
              imageURI: 'ipfs://hash',
              contentURI: 'arweave://digest',
              price: 0.1,
              limit: 100n,
              fundingRecipient: '0x',
              renderer: '0x',
              nonce: 123n,
              fee: 0,
            },
          ],
        },
      ],
    })
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    assertType<[void, ResolvedRegister['BytesType']['outputs']]>(result)
  })
})

test('behavior', () => {
  test('write function not allowed', () => {
    const result = reads({
      contracts: [
        {
          abi: wagmiMintExampleAbi,
          // @ts-expect-error Trying to use non-read function
          functionName: 'approve',
        },
      ],
    })
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    assertType<[void]>(result)
  })

  test('mixed result', () => {
    const result = reads({
      contracts: [
        {
          abi: wagmiMintExampleAbi,
          functionName: 'tokenURI',
          args: [1n],
        },
        {
          abi: writingEditionsFactoryAbi,
          functionName: 'predictDeterministicAddress',
          args: ['0x', '0x'],
        },
        {
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
          args: [['0x'], ['0x'], 1n],
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
        abi: wagmiMintExampleAbi,
        functionName: 'tokenUI',
        args: [1n],
      },
      {
        abi: wagmiMintExampleAbi,
        functionName: 'balanceOf',
        args: ['0x'],
      },
    ]
    const result = reads({ contracts })
    assertType<unknown[]>(result)
  })
})

const abi = parseAbi([
  'function foo() returns (bool)',
  'function foo(uint) view returns (address)',
  'function foo(address) view returns (uint)',
  'function foo(uint256, address) view returns (address, uint8)',
  'function bar() pure returns (address)',
  'function baz(uint) pure returns (string)',
  'function boo(string) pure',
])
const res = reads({
  contracts: [
    {
      abi,
      functionName: 'foo',
      args: [123n, '0x'],
    },
    {
      abi,
      functionName: 'foo',
    },
  ],
})
expectTypeOf(res).toEqualTypeOf<[readonly [Address, number], boolean]>()

const res2 = useReads({
  contracts: [
    {
      abi,
      functionName: 'foo',
      args: [123n, '0x'],
    },
    {
      abi,
      functionName: 'foo',
    },
  ],
})
expectTypeOf(res2).toEqualTypeOf<[readonly [Address, number], boolean]>()
