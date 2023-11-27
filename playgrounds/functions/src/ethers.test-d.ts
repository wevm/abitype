import type { ExtractAbiEvent, ResolvedRegister } from 'abitype'
import type { ContractTransaction } from 'ethers'
import type { CallOverrides, Event, Overrides } from './utils.js'

import { wagmiMintExampleAbi } from 'abitype/abis'
import { assertType, describe, expectTypeOf } from 'vitest'
import { getContract } from './ethers.js'

describe('getContract', () => {
  const contract = getContract({
    address: '0xfoo',
    abi: wagmiMintExampleAbi,
  })

  describe('regular function', () => {
    expectTypeOf(contract.balanceOf).toBeCallableWith('0x…', { from: '0x…' })
    expectTypeOf(contract.balanceOf)
      .parameter(0)
      .toEqualTypeOf<ResolvedRegister['AddressType']>()
    expectTypeOf(contract.balanceOf)
      .parameter(1)
      .toEqualTypeOf<CallOverrides | undefined>()
    expectTypeOf(contract.balanceOf).returns.resolves.toEqualTypeOf<bigint>()

    expectTypeOf(contract.functions.balanceOf).toBeCallableWith('0x…', {
      from: '0x…',
    })
    expectTypeOf(contract.functions.balanceOf)
      .parameter(0)
      .toEqualTypeOf<ResolvedRegister['AddressType']>()
    expectTypeOf(contract.functions.balanceOf)
      .parameter(1)
      .toEqualTypeOf<CallOverrides | undefined>()
    expectTypeOf(contract.functions.balanceOf).returns.resolves.toEqualTypeOf<
      [bigint]
    >()
  })

  describe('overloaded function', () => {
    const functionNameA = 'safeTransferFrom(address,address,uint256)'
    expectTypeOf(contract[functionNameA]).toBeCallableWith(
      '0x…',
      '0x…',
      BigInt('123'),
      { from: '0x…' },
    )
    expectTypeOf(contract[functionNameA])
      .parameter(0)
      .toEqualTypeOf<ResolvedRegister['AddressType']>()
    expectTypeOf(contract[functionNameA])
      .parameter(1)
      .toEqualTypeOf<ResolvedRegister['AddressType']>()
    expectTypeOf(contract[functionNameA])
      .parameter(2)
      .toEqualTypeOf<ResolvedRegister['BigIntType']>()
    expectTypeOf(contract[functionNameA])
      .parameter(3)
      .toEqualTypeOf<
        (Overrides & { from?: `0x${string}` | undefined }) | undefined
      >()
    expectTypeOf(
      contract[functionNameA],
    ).returns.resolves.toEqualTypeOf<ContractTransaction>()

    const functionNameB = 'safeTransferFrom(address,address,uint256,bytes)'
    expectTypeOf(contract[functionNameB]).toBeCallableWith(
      '0x…',
      '0x…',
      BigInt('123'),
      '0x…',
      { from: '0x…' },
    )
    expectTypeOf(contract[functionNameB])
      .parameter(0)
      .toEqualTypeOf<ResolvedRegister['AddressType']>()
    expectTypeOf(contract[functionNameB])
      .parameter(1)
      .toEqualTypeOf<ResolvedRegister['AddressType']>()
    expectTypeOf(contract[functionNameB])
      .parameter(2)
      .toEqualTypeOf<ResolvedRegister['BigIntType']>()
    expectTypeOf(contract[functionNameB])
      .parameter(3)
      .toEqualTypeOf<ResolvedRegister['BytesType']['inputs']>()
    expectTypeOf(contract[functionNameB])
      .parameter(4)
      .toEqualTypeOf<
        (Overrides & { from?: `0x${string}` | undefined }) | undefined
      >()
    expectTypeOf(
      contract[functionNameB],
    ).returns.resolves.toEqualTypeOf<ContractTransaction>()
  })

  // Events
  contract.on('Transfer', (from, to, value, event) => {
    assertType<ResolvedRegister['AddressType']>(from)
    assertType<ResolvedRegister['AddressType']>(to)
    assertType<ResolvedRegister['BigIntType']>(value)
    assertType<
      Event<ExtractAbiEvent<typeof wagmiMintExampleAbi, 'Transfer'>>
    >(event)
  })
})
