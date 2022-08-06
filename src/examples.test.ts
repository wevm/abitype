import { describe, it } from 'vitest'

import {
  address,
  ensRegistryWithFallbackAbi,
  expectType,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from '../test'

import { Abi, Address } from './abi'
import {
  AbiParametersToPrimitiveTypes,
  ExtractAbiEventNames,
  ExtractAbiEventParameters,
  ExtractAbiFunctionNames,
  ExtractAbiFunctionParameters,
} from './utils'

describe('readContract', () => {
  function readContract<
    TAbi extends Abi,
    TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
    TArgs extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunctionParameters<TAbi, TFunctionName, 'inputs'>
    >,
    TResponse extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunctionParameters<TAbi, TFunctionName, 'outputs'>
    >,
  >(
    _config: {
      address: Address
      contractInterface: TAbi
      functionName: TFunctionName
    } & (TArgs extends undefined ? { args?: never } : { args: TArgs }),
  ): TResponse extends undefined ? void : TResponse {
    return {} as TResponse extends undefined ? void : TResponse
  }

  describe('args', () => {
    it('zero', () => {
      expectType<string>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'symbol',
        }),
      )
    })

    it('one', () => {
      expectType<string>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'tokenURI',
          args: 123,
        }),
      )
    })

    it('two or more', () => {
      expectType<Address>(
        readContract({
          address,
          contractInterface: writingEditionsFactoryAbi,
          functionName: 'predictDeterministicAddress',
          args: [address, 'foo'],
        }),
      )
    })
  })

  describe('return types', () => {
    it('string', () => {
      expectType<string>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'symbol',
        }),
      )
    })

    it('Address', () => {
      expectType<Address>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'ownerOf',
          args: 123,
        }),
      )
    })

    it('number', () => {
      expectType<number>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'balanceOf',
          args: address,
        }),
      )
    })
  })

  describe('behavior', () => {
    it('write function not allowed', () => {
      expectType<string>(
        readContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          // @ts-expect-error Trying to use non-read function
          functionName: 'approve',
        }),
      )
    })
  })
})

describe('writeContract', () => {
  function writeContract<
    TAbi extends Abi,
    TFunctionName extends ExtractAbiFunctionNames<
      TAbi,
      'payable' | 'nonpayable'
    >,
    TArgs extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunctionParameters<TAbi, TFunctionName, 'inputs'>
    >,
    TResponse extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunctionParameters<TAbi, TFunctionName, 'outputs'>
    >,
  >(
    _config: {
      address: Address
      contractInterface: TAbi
      functionName: TFunctionName
    } & (TArgs extends undefined ? { args?: never } : { args: TArgs }),
  ): TResponse extends undefined ? void : TResponse {
    return {} as TResponse extends undefined ? void : TResponse
  }

  describe('args', () => {
    it('zero', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'mint',
        }),
      )
    })

    it('one', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: nounsAuctionHouseAbi,
          functionName: 'createBid',
          args: 123,
        }),
      )
    })

    it('two or more', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'approve',
          args: [address, 123],
        }),
      )

      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'transferFrom',
          args: [address, address, 123],
        }),
      )
    })

    it('tuple', () => {
      expectType<Address>(
        writeContract({
          address,
          contractInterface: writingEditionsFactoryAbi,
          functionName: 'create',
          args: {
            name: 'Test',
            symbol: '$TEST',
            description: 'Foo bar baz',
            imageURI: 'ipfs://hash',
            contentURI: 'arweave://digest',
            price: 0.1,
            limit: 100,
            fundingRecipient: address,
            renderer: address,
            nonce: 123,
            fee: 0,
          },
        }),
      )
    })
  })

  describe('return types', () => {
    it('void', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: nounsAuctionHouseAbi,
          functionName: 'pause',
        }),
      )
    })

    it('bytes32', () => {
      expectType<string>(
        writeContract({
          address,
          contractInterface: ensRegistryWithFallbackAbi,
          functionName: 'setSubnodeOwner',
          args: ['foo', 'bar', address],
        }),
      )
    })

    it('tuple', () => {
      const contractInterface = [
        {
          type: 'function',
          name: 'foo',
          stateMutability: 'payable',
          inputs: [],
          outputs: [
            {
              components: [
                { internalType: 'string', name: 'name', type: 'string' },
                { internalType: 'string', name: 'symbol', type: 'string' },
                {
                  internalType: 'address',
                  name: 'fundingRecipient',
                  type: 'address',
                },
              ],
              internalType: 'struct Foo',
              name: 'foo',
              type: 'tuple',
            },
          ],
        },
      ] as const
      type Output = {
        name: 'Test'
        symbol: '$TEST'
        fundingRecipient: Address
      }
      expectType<Output>(
        writeContract({
          address,
          contractInterface,
          functionName: 'foo',
        }),
      )
    })

    it('tuple[]', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: nestedTupleArrayAbi,
          functionName: 'f',
          args: [{ a: 1, b: [2], c: [{ x: 1, y: 1 }] }, { x: 1, y: 1 }, 1],
        }),
      )
    })
  })

  describe('behavior', () => {
    it('read function not allowed', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          // @ts-expect-error Trying to use read function
          functionName: 'symbol',
        }),
      )
    })

    it('function with overrides', () => {
      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'safeTransferFrom',
          args: [address, address, 123],
        }),
      )

      expectType<void>(
        writeContract({
          address,
          contractInterface: wagmiMintExampleAbi,
          functionName: 'safeTransferFrom',
          args: [address, address, 123, 'foo'],
        }),
      )
    })
  })
})

describe.todo('readContracts')

describe('watchContractEvent', () => {
  function watchContractEvent<
    TAbi extends Abi,
    TEventName extends ExtractAbiEventNames<TAbi>,
    TArgs extends AbiParametersToPrimitiveTypes<
      ExtractAbiEventParameters<TAbi, TEventName>
    >,
  >(_config: {
    address: Address
    contractInterface: TAbi
    eventName: TEventName
    listener(args: TArgs): void
  }) {
    return
  }

  describe('args', () => {
    it('zero', () => {
      watchContractEvent({
        address,
        contractInterface: wagmiMintExampleAbi,
        eventName: 'Transfer',
        listener(args) {
          expectType<readonly [Address, Address, number | bigint]>(args)
        },
      })
    })
  })
})
