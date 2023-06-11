import type { Abi, ResolvedConfig } from 'abitype'
import { wagmiMintExampleAbi, writingEditionsFactoryAbi } from 'abitype/test'
import { assertType, test } from 'vitest'

import { watchEvent } from './watchEvent.js'

test('args', () => {
  test('zero', () => {
    watchEvent({
      abi: [
        {
          name: 'Foo',
          type: 'event',
          inputs: [],
          anonymous: false,
        },
        {
          name: 'Bar',
          type: 'event',
          inputs: [{ name: 'baz', type: 'uint256', indexed: false }],
          anonymous: false,
        },
      ],
      eventName: 'Foo',
      onEmit(...args) {
        assertType<[]>(args)
      },
    })
  })

  test('one', () => {
    watchEvent({
      abi: writingEditionsFactoryAbi,
      eventName: 'FactoryGuardSet',
      onEmit(guard) {
        assertType<boolean | null>(guard)
      },
    })
  })

  test('two or more', () => {
    watchEvent({
      abi: wagmiMintExampleAbi,
      eventName: 'Transfer',
      onEmit(from, to, tokenId) {
        assertType<ResolvedConfig['AddressType']>(from)
        assertType<ResolvedConfig['AddressType']>(to)
        assertType<ResolvedConfig['BigIntType']>(tokenId)
      },
    })
  })
})

test('behavior', () => {
  test('works without const assertion', () => {
    const abi = [
      {
        name: 'Foo',
        type: 'event',
        inputs: [
          {
            indexed: true,
            name: 'name',
            type: 'address',
          },
        ],
        anonymous: false,
      },
    ]
    watchEvent({
      abi,
      eventName: 'Foo',
      onEmit(name) {
        assertType<unknown>(name)
      },
    })
  })

  test('declared as Abi type', () => {
    const abi: Abi = [
      {
        name: 'Foo',
        type: 'event',
        inputs: [
          {
            indexed: true,
            name: 'name',
            type: 'address',
          },
        ],
        anonymous: false,
      },
    ]
    watchEvent({
      abi,
      eventName: 'Foo',
      onEmit(name) {
        assertType<unknown>(name)
      },
    })
  })

  test('defined inline', () => {
    watchEvent({
      abi: [
        {
          name: 'Foo',
          type: 'event',
          inputs: [
            {
              indexed: true,
              name: 'name',
              type: 'address',
            },
          ],
          anonymous: false,
        },
      ],
      eventName: 'Foo',
      onEmit(name) {
        assertType<ResolvedConfig['AddressType']>(name)
      },
    })
  })
})
