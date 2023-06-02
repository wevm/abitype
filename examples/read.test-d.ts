import type { Abi, Address, ResolvedConfig } from 'abitype'
import { parseAbi } from 'abitype'
import {
  wagmiMintExampleAbi,
  wagmiMintExampleHumanReadableAbi,
  writingEditionsFactoryAbi,
} from 'abitype/test'
import { assertType, expectTypeOf, test } from 'vitest'

import { read, readWagmiMintExample } from './read.js'

const abi = parseAbi([
  'function foo() returns (bool)',
  'function foo(uint) view returns (address)',
  'function foo(address) view returns (uint)',
  'function foo(uint256, address) view returns (address, uint8)',
  'function bar() pure returns (address)',
  'function baz(uint) pure returns (string)',
  'function boo(string) pure',
])
expectTypeOf(
  read({
    abi,
    functionName: 'foo',
    args: [123n, '0x'],
  }),
).toEqualTypeOf<readonly [Address, number]>()
expectTypeOf(
  read({
    abi,
    functionName: 'foo',
  }),
).toEqualTypeOf<boolean>()

test('read', () => {
  test('args', () => {
    test('zero', () => {
      const result = read({
        abi: wagmiMintExampleAbi,
        functionName: 'name',
      })
      assertType<string>(result)
    })

    test('one', () => {
      const result = read({
        abi: wagmiMintExampleAbi,
        functionName: 'tokenURI',
        args: [123n],
      })
      assertType<string>(result)
    })

    test('two or more', () => {
      const result = read({
        abi: writingEditionsFactoryAbi,
        functionName: 'predictDeterministicAddress',
        args: ['0x', '0xfoo'],
      })
      assertType<Address>(result)
    })
  })

  test('return types', () => {
    test('string', () => {
      const result = read({
        abi: wagmiMintExampleAbi,
        functionName: 'name',
      })
      assertType<string>(result)
    })

    test('Address', () => {
      const result = read({
        abi: wagmiMintExampleAbi,
        functionName: 'ownerOf',
        args: [123n],
      })
      assertType<Address>(result)
    })

    test('number', () => {
      const result = read({
        abi: wagmiMintExampleAbi,
        functionName: 'balanceOf',
        args: ['0x'],
      })
      assertType<ResolvedConfig['BigIntType']>(result)
    })
  })

  test('behavior', () => {
    test('write function not allowed', () => {
      const result = read({
        abi: wagmiMintExampleAbi,
        // @ts-expect-error Trying to use non-read function
        functionName: 'approve',
      })
      assertType<void>(result)
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
      const result1 = read({
        abi: abi,
        functionName: 'foo',
      })
      const result2 = read({
        abi: abi,
        functionName: 'bar',
        args: ['0x'],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      assertType<Result1>('hello')
      assertType<Result2>('0x123')
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
      const result1 = read({
        abi: abi,
        functionName: 'foo',
      })
      const result2 = read({
        abi: abi,
        functionName: 'bar',
        args: ['0x'],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      assertType<Result1>('hello')
      assertType<Result2>('0x123')
    })

    test('defined inline', () => {
      const result1 = read({
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
      const result2 = read({
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
        args: ['0x'],
      })
      type Result1 = typeof result1
      type Result2 = typeof result2
      assertType<Result1>('hello')
      assertType<Result2>('0x123')
    })

    test('human readable', () => {
      const result = read({
        abi: parseAbi(wagmiMintExampleHumanReadableAbi),
        functionName: 'balanceOf',
        args: ['0x'],
      })
      assertType<bigint>(result)
    })
  })
})

test('readWagmiMintExample', () => {
  test('args', () => {
    test('zero', () => {
      const result = readWagmiMintExample({
        functionName: 'name',
      })
      assertType<string>(result)
    })

    test('one', () => {
      const result = readWagmiMintExample({
        functionName: 'balanceOf',
        args: ['0x'],
      })
      assertType<bigint>(result)
    })
  })
})
