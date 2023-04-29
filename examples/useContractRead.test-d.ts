import type { Abi, Address, ResolvedConfig } from 'abitype'
import {
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
  zeroAddress,
} from 'abitype/test'
import { assertType, test } from 'vitest'

import { useContractRead, useWagmiMintExampleRead } from './useContractRead.js'

test('useContractRead', () => {
  test('args', () => {
    test('zero', () => {
      const result = useContractRead({
        address: zeroAddress,
        abi: wagmiMintExampleAbi,
        functionName: 'name',
        // ^?
      })
      assertType<{ data: string }>(result)
    })

    test('one', () => {
      const result = useContractRead({
        address: zeroAddress,
        abi: wagmiMintExampleAbi,
        functionName: 'tokenURI',
        args: [123n],
      })
      assertType<{ data: string }>(result)
    })

    test('two or more', () => {
      const result = useContractRead({
        address: zeroAddress,
        abi: writingEditionsFactoryAbi,
        functionName: 'predictDeterministicAddress',
        args: [zeroAddress, '0xfoo'],
      })
      assertType<{ data: Address }>(result)
    })
  })

  test('return types', () => {
    test('string', () => {
      const result = useContractRead({
        address: zeroAddress,
        abi: wagmiMintExampleAbi,
        functionName: 'name',
      })
      assertType<{ data: string }>(result)
    })

    test('Address', () => {
      const result = useContractRead({
        address: zeroAddress,
        abi: wagmiMintExampleAbi,
        functionName: 'ownerOf',
        args: [123n],
      })
      assertType<{ data: Address }>(result)
    })

    test('number', () => {
      const result = useContractRead({
        address: zeroAddress,
        abi: wagmiMintExampleAbi,
        functionName: 'balanceOf',
        args: [zeroAddress],
      })
      assertType<{ data: ResolvedConfig['BigIntType'] }>(result)
    })
  })

  test('behavior', () => {
    test('write function not allowed', () => {
      const result = useContractRead({
        address: zeroAddress,
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
        address: zeroAddress,
        abi: abi,
        functionName: 'foo',
      })
      const result2 = useContractRead({
        address: zeroAddress,
        abi: abi,
        functionName: 'bar',
        args: [zeroAddress],
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
        address: zeroAddress,
        abi: abi,
        functionName: 'foo',
      })
      const result2 = useContractRead({
        address: zeroAddress,
        abi: abi,
        functionName: 'bar',
        args: [zeroAddress],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      assertType<Result1['data']>('hello')
      assertType<Result2['data']>('0x123')
    })

    test('defined inline', () => {
      const result1 = useContractRead({
        address: zeroAddress,
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
        address: zeroAddress,
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
        args: [zeroAddress],
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
        address: zeroAddress,
        functionName: 'name',
        // ^?
      })
      assertType<{ data: string }>(result)
    })

    test('one', () => {
      const result = useWagmiMintExampleRead({
        address: zeroAddress,
        functionName: 'balanceOf',
        args: ['0x…'],
      })
      assertType<{ data: bigint }>(result)
    })
  })
})
