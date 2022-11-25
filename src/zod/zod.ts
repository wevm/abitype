import { z } from 'zod'

import type {
  AbiFunction as AbiFunctionType,
  AbiParameter as AbiParameterType,
} from '../abi'

// From https://docs.soliditylang.org/en/latest/abi-spec.html#types
export const SolidityAddress = z.literal('address')
export const SolidityBool = z.literal('bool')
export const SolidityBytes = z.string().regex(
  // `bytes<M>`: binary type of `M` bytes, `0 < M <= 32`
  /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/,
)
export const SolidityFunction = z.literal('function')
export const SolidityString = z.literal('string')
export const SolidityTuple = z.literal('tuple')
export const SolidityInt = z.string().regex(
  // `(u)int<M>`: (un)signed integer type of `M` bits, `0 < M <= 256`, `M % 8 == 0`
  /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/,
)
export const SolidityArrayWithoutTuple = z
  .string()
  .regex(
    /^(address|bool|function|string|bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?|u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?)(\[[0-9]{0,}\])+$/,
  )
export const SolidityArrayWithTuple = z
  .string()
  .regex(/^tuple(\[[0-9]{0,}\])+$/)
export const SolidityArray = z.union([
  SolidityArrayWithTuple,
  SolidityArrayWithoutTuple,
])

export const AbiParameter: z.ZodType<AbiParameterType> = z.lazy(() =>
  z.intersection(
    z.object({
      name: z.string().optional(),
      /** Representation used by Solidity compiler */
      internalType: z.string().optional(),
    }),
    z.union([
      z.object({
        type: z.union([
          SolidityAddress,
          SolidityBool,
          SolidityBytes,
          SolidityFunction,
          SolidityString,
          SolidityInt,
          SolidityArrayWithoutTuple,
        ]),
      }),
      z.object({
        type: z.union([SolidityTuple, SolidityArrayWithTuple]),
        components: z.array(AbiParameter),
      }),
    ]),
  ),
)

export const AbiStateMutability = z.union([
  z.literal('pure'),
  z.literal('view'),
  z.literal('nonpayable'),
  z.literal('payable'),
])

export const AbiFunction = z.preprocess(
  (val) => {
    const abiFunction = val as unknown as {
      constant?: AbiFunctionType['constant']
      payable?: AbiFunctionType['payable']
      stateMutability?: z.infer<typeof AbiStateMutability>
      type: AbiFunctionType['type']
    }
    if (
      abiFunction.type === 'constructor' ||
      abiFunction.type === 'fallback' ||
      abiFunction.type === 'receive'
    )
      return abiFunction
    // Calculate `stateMutability` for deprecated `constant` and `payable` fields
    if (abiFunction.stateMutability === undefined) {
      if (abiFunction.constant) abiFunction.stateMutability = 'view'
      else if (abiFunction.payable) abiFunction.stateMutability = 'payable'
      else abiFunction.stateMutability = 'nonpayable'
    }
    return val
  },
  z.intersection(
    z.object({
      /**
       * @deprecated use `pure` or `view` from {@link AbiStateMutability} instead
       * https://github.com/ethereum/solidity/issues/992
       */
      constant: z.boolean().optional(),
      /**
       * @deprecated Vyper used to provide gas estimates
       * https://github.com/vyperlang/vyper/issues/2151
       */
      gas: z.number().optional(),
      /**
       * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
       * https://github.com/ethereum/solidity/issues/992
       */
      payable: z.boolean().optional(),
      stateMutability: AbiStateMutability,
    }),
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('function'),
        inputs: z.array(AbiParameter),
        name: z.string(),
        outputs: z.array(AbiParameter),
      }),
      z.object({
        type: z.literal('constructor'),
        inputs: z.array(AbiParameter),
      }),
      z.object({ type: z.literal('fallback'), inputs: z.tuple([]) }),
      z.object({
        type: z.literal('receive'),
        stateMutability: z.literal('payable'),
      }),
    ]),
  ),
)

export const AbiEvent = z.object({
  type: z.literal('event'),
  anonymous: z.boolean().optional(),
  inputs: z.array(
    z.intersection(AbiParameter, z.object({ indexed: z.boolean().optional() })),
  ),
  name: z.string(),
})

export const AbiError = z.object({
  type: z.literal('event'),
  inputs: z.array(AbiParameter),
  name: z.string(),
})

/**
 * Zod Schema for Contract [ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)
 *
 * @example
 * const parsedAbi = Abi.parse([…])
 */
export const Abi = z.array(z.union([AbiFunction, AbiEvent, AbiError]))
