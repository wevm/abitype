import {
  address,
  expectType,
  test,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../../test'

import { Abi, Address } from '../abi'
import { ResolvedConfig } from '../config'
import { readContract } from './readContract'

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
      expectType<void>(result)
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
