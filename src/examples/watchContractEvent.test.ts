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
      const abi = [
        {
          name: 'Foo',
          type: 'event',
          inputs: [],
          anonymous: false,
        },
      ] as const
      watchContractEvent({
        address,
        abi,
        eventName: 'Foo',
        // @ts-expect-error no args allowed
        listener(_arg) {
          return
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
                type: 'string',
              },
            ],
            anonymous: false,
          },
        ],
        eventName: 'Foo',
        listener(name) {
          expectType<typeof name>(name as unknown)
        },
      })
    })
  })
})
