import { z } from 'zod'

import type {
  AbiConstructor as AbiConstructorType,
  AbiFallback as AbiFallbackType,
  AbiFunction as AbiFunctionType,
  AbiParameter as AbiParameterType,
  AbiReceive as AbiReceiveType,
  Address as AddressType,
} from '../abi.js'
import { bytesRegex, integerRegex } from '../regex.js'

export const Address = z.string().transform((val, ctx) => {
  const regex = /^0x[a-fA-F0-9]{40}$/

  if (!regex.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Invalid Address ${val}`,
    })
  }

  return val as AddressType
})

// From https://docs.soliditylang.org/en/latest/abi-spec.html#types
export const SolidityAddress = z.literal('address')
export const SolidityBool = z.literal('bool')
export const SolidityBytes = z.string().regex(bytesRegex)
export const SolidityFunction = z.literal('function')
export const SolidityString = z.literal('string')
export const SolidityTuple = z.literal('tuple')
export const SolidityInt = z.string().regex(integerRegex)
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

export const AbiEventParameter = z.intersection(
  AbiParameter,
  z.object({ indexed: z.boolean().optional() }),
)

export const AbiStateMutability = z.union([
  z.literal('pure'),
  z.literal('view'),
  z.literal('nonpayable'),
  z.literal('payable'),
])

export const AbiFunction = z.preprocess(
  (val) => {
    const abiFunction = val as unknown as AbiFunctionType
    // Calculate `stateMutability` for deprecated `constant` and `payable` fields
    if (abiFunction.stateMutability === undefined) {
      if (abiFunction.constant) abiFunction.stateMutability = 'view'
      else if (abiFunction.payable) abiFunction.stateMutability = 'payable'
      else abiFunction.stateMutability = 'nonpayable'
    }
    return val
  },
  z.object({
    type: z.literal('function'),
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
    inputs: z.array(AbiParameter),
    name: z.string(),
    outputs: z.array(AbiParameter),
    /**
     * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
     * https://github.com/ethereum/solidity/issues/992
     */
    payable: z.boolean().optional(),
    stateMutability: AbiStateMutability,
  }),
)

export const AbiConstructor = z.preprocess(
  (val) => {
    const abiFunction = val as unknown as AbiConstructorType
    // Calculate `stateMutability` for deprecated `payable` field
    if (abiFunction.stateMutability === undefined) {
      if (abiFunction.payable) abiFunction.stateMutability = 'payable'
      else abiFunction.stateMutability = 'nonpayable'
    }
    return val
  },
  z.object({
    type: z.literal('constructor'),
    /**
     * @deprecated use `pure` or `view` from {@link AbiStateMutability} instead
     * https://github.com/ethereum/solidity/issues/992
     */
    inputs: z.array(AbiParameter),
    /**
     * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
     * https://github.com/ethereum/solidity/issues/992
     */
    payable: z.boolean().optional(),
    stateMutability: z.union([z.literal('nonpayable'), z.literal('payable')]),
  }),
)

export const AbiFallback = z.preprocess(
  (val) => {
    const abiFunction = val as unknown as AbiFallbackType
    // Calculate `stateMutability` for deprecated `payable` field
    if (abiFunction.stateMutability === undefined) {
      if (abiFunction.payable) abiFunction.stateMutability = 'payable'
      else abiFunction.stateMutability = 'nonpayable'
    }
    return val
  },
  z.object({
    type: z.literal('fallback'),
    /**
     * @deprecated use `pure` or `view` from {@link AbiStateMutability} instead
     * https://github.com/ethereum/solidity/issues/992
     */
    inputs: z.tuple([]).optional(),
    /**
     * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
     * https://github.com/ethereum/solidity/issues/992
     */
    payable: z.boolean().optional(),
    stateMutability: z.union([z.literal('nonpayable'), z.literal('payable')]),
  }),
)

export const AbiReceive = z.object({
  type: z.literal('receive'),
  stateMutability: z.literal('payable'),
})

export const AbiEvent = z.object({
  type: z.literal('event'),
  anonymous: z.boolean().optional(),
  inputs: z.array(AbiEventParameter),
  name: z.string(),
})

export const AbiError = z.object({
  type: z.literal('error'),
  inputs: z.array(AbiParameter),
  name: z.string(),
})

export const AbiItemType = z.union([
  z.literal('constructor'),
  z.literal('event'),
  z.literal('error'),
  z.literal('fallback'),
  z.literal('function'),
  z.literal('receive'),
])

/**
 * Zod Schema for Contract [ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)
 *
 * @example
 * const parsedAbi = Abi.parse([…])
 */
export const Abi = z.array(
  z.union([
    AbiError,
    AbiEvent,
    // TODO: Replace code below to `z.switch` (https://github.com/colinhacks/zod/issues/2106)
    // Need to redefine `AbiFunction | AbiConstructor | AbiFallback | AbiReceive` since `z.discriminate` doesn't support `z.preprocess` on `options`
    // https://github.com/colinhacks/zod/issues/1490
    z.preprocess(
      (val) => {
        const abiItem = val as
          | AbiConstructorType
          | AbiFallbackType
          | AbiFunctionType
          | AbiReceiveType
        if (abiItem.type === 'receive') return abiItem
        // Calculate `stateMutability` for deprecated fields: `constant` and `payable`
        if (
          (val as { stateMutability: AbiFunctionType['stateMutability'] })
            .stateMutability === undefined
        ) {
          if (
            abiItem.type === 'function' &&
            (abiItem as AbiFunctionType).constant
          )
            abiItem.stateMutability = 'view'
          else if (
            (abiItem as AbiConstructorType | AbiFallbackType | AbiFunctionType)
              .payable
          )
            abiItem.stateMutability = 'payable'
          else abiItem.stateMutability = 'nonpayable'
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
          z.object({
            type: z.literal('fallback'),
            inputs: z.tuple([]).optional(),
          }),
          z.object({
            type: z.literal('receive'),
            stateMutability: z.literal('payable'),
          }),
        ]),
      ),
    ),
  ]),
)
