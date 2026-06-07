import type * as a from 'abitype'
import { wagmiMintExampleAbi, writingEditionsFactoryAbi } from 'abitype/abis'
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
        assertType<a.resolvedRegister['addressType']>(from)
        assertType<a.resolvedRegister['addressType']>(to)
        assertType<a.resolvedRegister['bigIntType']>(tokenId)
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
    const abi: a.abi = [
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
        assertType<a.resolvedRegister['addressType']>(name)
      },
    })
  })
})
