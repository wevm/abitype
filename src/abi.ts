import { InclusiveRange, MultiplesOf8To256 } from './types'

export type SolAddress = 'address'
export type SolBool = 'bool'
export type SolBytes = `bytes${InclusiveRange<1, 32>[number] | ''}`
export type SolFunction = 'function'
export type SolString = 'string'
export type SolTuple = 'tuple'
export type SolInt = `${'u' | ''}int${MultiplesOf8To256 | ''}`
export type SolFixed =
  | `${'u' | ''}fixed${MultiplesOf8To256}x${InclusiveRange<1, 80>[number]}`
  | `${'u' | ''}fixed`

/**
 * Solidity ABI spec elementary types
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#types
 */
export type AbiType =
  | SolAddress
  | SolBool
  | SolBytes
  | SolFunction
  | SolString
  | SolTuple
  | SolInt
  | SolFixed

/**
 * Ethereum address prefixed with `0x`
 */
export type Address = `0x${string}`

export type AbiInternalType =
  | AbiType
  | `contract ${string}`
  | `struct ${string}`

/**
 * Abi parameter
 */
export type AbiParameter = {
  type: AbiType
  name: string
  /** Representation used by Solidity compiler */
  internalType: AbiInternalType
} & (
  | { type: Exclude<AbiType, SolTuple> }
  | {
      type: Extract<AbiType, SolTuple>
      components: readonly AbiParameter[]
    }
)

export type AbiParameterType = 'inputs' | 'outputs'

export type AbiStateMutability = 'pure' | 'view' | 'nonpayable' | 'payable'

/**
 * Abi function
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type AbiFunction<TAbiParameter extends AbiParameter = AbiParameter> = {
  /**
   * @deprecated use `pure` or `view` from {@link AbiStateMutability} instead
   * https://github.com/ethereum/solidity/issues/992
   */
  constant?: boolean
  /**
   * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
   * https://github.com/ethereum/solidity/issues/992
   */
  payable?: boolean
  stateMutability: AbiStateMutability
} & (
  | {
      type: 'function'
      inputs: readonly TAbiParameter[]
      name: string
      outputs: readonly TAbiParameter[]
    }
  | {
      type: 'constructor'
      inputs: readonly TAbiParameter[]
    }
  | { type: 'fallback' }
  | { type: 'receive'; stateMutability: 'payable' }
)

/**
 * Abi event
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type AbiEvent<TAbiParameter extends AbiParameter = AbiParameter> = {
  type: 'event'
  anonymous?: boolean
  inputs: readonly (TAbiParameter & { indexed?: boolean })[]
  name: string
}

/**
 * Abi error
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type AbiError<TAbiParameter extends AbiParameter = AbiParameter> = {
  type: 'error'
  inputs: readonly TAbiParameter[]
  name: string
}

/**
 * Abi
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type Abi<TAbiParameter extends AbiParameter = AbiParameter> = readonly (
  | AbiFunction<TAbiParameter>
  | AbiEvent<TAbiParameter>
  | AbiError<TAbiParameter>
)[]
