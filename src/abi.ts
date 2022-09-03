import { MultiplesOf8To256, Range } from './types'

export type Address = `0x${string}`

////////////////////////////////////////////////////////////////////////////////////////////////////

// Solidity Types

export type SolidityAddress = 'address'
export type SolidityBool = 'bool'
export type SolidityBytes = `bytes${Range<1, 32>[number] | ''}`
export type SolidityFunction = 'function'
export type SolidityString = 'string'
export type SolidityTuple = 'tuple'
export type SolidityInt = `${'u' | ''}int${MultiplesOf8To256 | ''}`
// No need to support "fixed" until Solidity does
// https://github.com/ethereum/solidity/issues/409
// export type SolidityFixed =
//   | `${'u' | ''}fixed`
//   | `${'u' | ''}fixed${MultiplesOf8To256}x${Range<1, 20>[number]}`

export type SolidityFixedArrayRange = Range<1, 10>[number]
export type SolidityFixedArraySizeLookup = {
  [Prop in SolidityFixedArrayRange as `${Prop}`]: Prop
}
export type SolidityArray =
  | `${
      | SolidityAddress
      | SolidityBool
      | SolidityBytes
      | SolidityFunction
      | SolidityString
      | SolidityTuple
      | SolidityInt}[${'' | SolidityFixedArrayRange}]`

////////////////////////////////////////////////////////////////////////////////////////////////////

// Abi Types

export type AbiType =
  | SolidityAddress
  | SolidityString
  | SolidityBool
  | SolidityFunction
  | SolidityBytes
  | SolidityInt
  | SolidityTuple
  | SolidityArray

export type AbiInternalType =
  | AbiType
  | `address ${string}`
  | `contract ${string}`
  | `enum ${string}`
  | `struct ${string}`

export type AbiParameter = {
  type: AbiType
  name: string
  /** Representation used by Solidity compiler */
  internalType?: AbiInternalType
} & (
  | { type: Exclude<AbiType, SolidityTuple> }
  | {
      type: `${SolidityTuple}` | `${SolidityTuple}[]`
      components: readonly AbiParameter[]
    }
)

export type AbiStateMutability = 'pure' | 'view' | 'nonpayable' | 'payable'

export type AbiFunction = {
  /**
   * @deprecated use `pure` or `view` from {@link AbiStateMutability} instead
   * https://github.com/ethereum/solidity/issues/992
   */
  constant?: boolean
  /**
   * @deprecated Vyper used to provide gas estimates
   * https://github.com/vyperlang/vyper/issues/2151
   */
  gas?: number
  /**
   * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
   * https://github.com/ethereum/solidity/issues/992
   */
  payable?: boolean
  stateMutability: AbiStateMutability
} & (
  | {
      type: 'function'
      inputs: readonly AbiParameter[]
      name: string
      outputs: readonly AbiParameter[]
    }
  | {
      type: 'constructor'
      inputs: readonly AbiParameter[]
    }
  | { type: 'fallback'; inputs?: [] }
  | { type: 'receive'; stateMutability: 'payable' }
)

export type AbiEvent = {
  type: 'event'
  anonymous?: boolean
  inputs: readonly (AbiParameter & { indexed?: boolean })[]
  name: string
}

export type AbiError = {
  type: 'error'
  inputs: readonly AbiParameter[]
  name: string
}

/**
 * Abi
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type Abi = readonly (AbiFunction | AbiEvent | AbiError)[]
