import {
  address,
  expectType,
  test,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../../test'
import { ResolvedConfig } from '../config'
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
          expectType<[]>(args)
        },
      })
    })

    test('one', () => {
      watchContractEvent({
        address,
        abi: writingEditionsFactoryAbi,
        eventName: 'FactoryGuardSet',
        listener(guard) {
          expectType<boolean | null>(guard)
        },
      })
    })

    test('two or more', () => {
      watchContractEvent({
        address,
        abi: wagmiMintExampleAbi,
        eventName: 'Transfer',
        listener(from, to, tokenId) {
          expectType<ResolvedConfig['AddressType']>(from)
          expectType<ResolvedConfig['AddressType']>(to)
          expectType<ResolvedConfig['BigIntType']>(tokenId)
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
          expectType<unknown>(name)
        },
      })
    })
  })
})
