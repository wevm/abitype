import { assertType, test } from 'vitest'

import type { Abi, Address, ResolvedConfig } from '../src'
import {
  address,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../test'
import { useContractRead, useWagmiMintExampleRead } from './useContractRead'

test('useContractRead', () => {
  test('args', () => {
    test('zero', () => {
      const result = useContractRead({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'name',
        // ^?
      })
      assertType<{ data: string }>(result)
    })

    test('one', () => {
      const result = useContractRead({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'tokenURI',
        args: [123n],
      })
      assertType<{ data: string }>(result)
    })

    test('two or more', () => {
      const result = useContractRead({
        address,
        abi: writingEditionsFactoryAbi,
        functionName: 'predictDeterministicAddress',
        args: [address, '0xfoo'],
      })
      assertType<{ data: Address }>(result)
    })
  })

  test('return types', () => {
    test('string', () => {
      const result = useContractRead({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'name',
      })
      assertType<{ data: string }>(result)
    })

    test('Address', () => {
      const result = useContractRead({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'ownerOf',
        args: [123n],
      })
      assertType<{ data: Address }>(result)
    })

    test('number', () => {
      const result = useContractRead({
        address,
        abi: wagmiMintExampleAbi,
        functionName: 'balanceOf',
        args: [address],
      })
      assertType<{ data: ResolvedConfig['BigIntType'] }>(result)
    })
  })

  test('behavior', () => {
    test('write function not allowed', () => {
      const result = useContractRead({
        address,
        abi: wagmiMintExampleAbi,
        // @ts-expect-error Trying to use non-read function
        functionName: 'approve',
      })
      assertType<{ data: void }>(result)
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
      const result1 = useContractRead({
        address,
        abi: abi,
        functionName: 'foo',
      })
      const result2 = useContractRead({
        address,
        abi: abi,
        functionName: 'bar',
        args: [address],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      assertType<Result1['data']>('hello')
      assertType<Result2['data']>('0x123')
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
      const result1 = useContractRead({
        address,
        abi: abi,
        functionName: 'foo',
      })
      const result2 = useContractRead({
        address,
        abi: abi,
        functionName: 'bar',
        args: [address],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      assertType<Result1['data']>('hello')
      assertType<Result2['data']>('0x123')
    })

    test('defined inline', () => {
      const result1 = useContractRead({
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
      })
      const result2 = useContractRead({
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
      assertType<Result1['data']>('hello')
      assertType<Result2['data']>('0x123')
    })
  })
})

test('useWagmiMintExampleRead', () => {
  test('args', () => {
    test('zero', () => {
      const result = useWagmiMintExampleRead({
        address,
        functionName: 'name',
        // ^?
      })
      assertType<{ data: string }>(result)
    })

    test('one', () => {
      const result = useWagmiMintExampleRead({
        address,
        functionName: 'balanceOf',
        args: ['0x…'],
      })
      assertType<{ data: bigint }>(result)
    })
  })
})
