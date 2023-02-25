import { assertType, test } from 'vitest'

import type { Abi, ResolvedConfig } from '../'
import {
  address,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../src/test'
import { watchContractEvent } from './watchContractEvent'

test('watchContractEvent', () => {
  test('args', () => {
    test('zero', () => {
      watchContractEvent({
        address,
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
        listener(...args) {
          assertType<[]>(args)
        },
      })
    })

    test('one', () => {
      watchContractEvent({
        address,
        abi: writingEditionsFactoryAbi,
        eventName: 'FactoryGuardSet',
        listener(guard) {
          assertType<boolean | null>(guard)
        },
      })
    })

    test('two or more', () => {
      watchContractEvent({
        address,
        abi: wagmiMintExampleAbi,
        eventName: 'Transfer',
        listener(from, to, tokenId) {
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
      watchContractEvent({
        address,
        abi,
        eventName: 'Foo',
        listener(name) {
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
      watchContractEvent({
        address,
        abi,
        eventName: 'Foo',
        listener(name) {
          assertType<unknown>(name)
        },
      })
    })

    test('defined inline', () => {
      watchContractEvent({
        address,
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
        listener(name) {
          assertType<ResolvedConfig['AddressType']>(name)
        },
      })
    })
  })
})
