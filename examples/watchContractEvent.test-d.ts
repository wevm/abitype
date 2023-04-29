import type { Abi, ResolvedConfig } from 'abitype'
import {
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
  zeroAddress,
} from 'abitype/test'
import { assertType, test } from 'vitest'

import { watchContractEvent } from './watchContractEvent'

test('watchContractEvent', () => {
  test('args', () => {
    test('zero', () => {
      watchContractEvent({
        address: zeroAddress,
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
        address: zeroAddress,
        abi: writingEditionsFactoryAbi,
        eventName: 'FactoryGuardSet',
        listener(guard) {
          assertType<boolean | null>(guard)
        },
      })
    })

    test('two or more', () => {
      watchContractEvent({
        address: zeroAddress,
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
        address: zeroAddress,
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
        address: zeroAddress,
        abi,
        eventName: 'Foo',
        listener(name) {
          assertType<unknown>(name)
        },
      })
    })

    test('defined inline', () => {
      watchContractEvent({
        address: zeroAddress,
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
