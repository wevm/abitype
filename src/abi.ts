import { MultiplesOf8To256, Range } from './types'

export type SolAddress = 'address'
export type SolBool = 'bool'
export type SolBytes = `bytes${Range<1, 32>[number] | ''}`
export type SolFunction = 'function'
export type SolString = 'string'
export type SolTuple = 'tuple'
export type SolInt = `${'u' | ''}int${MultiplesOf8To256 | ''}`
export type SolFixed =
  | `${'u' | ''}fixed`
  | `${'u' | ''}fixed${MultiplesOf8To256}x${Range<1, 80>[number]}`

/**
 * Creating range for fixed-length arrays so type isn't too complex for TypeScript compiler
 * Ideally range is unnecessary and fixed-length can be any number greater than zero
 */
type FixedArrayRange = Range<1, 16>[number]
// TODO: Missing `tuple[]` and `tuple[M]` - too complex for compiler
export type SolArray<T extends FixedArrayRange = FixedArrayRange> = `${
  | SolAddress
  | SolBool
  | SolBytes
  | SolFunction
  | SolString
  | SolInt
  | SolFixed}[${T | ''}]`

/**
 * Solidity types
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
  | SolArray

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
  internalType?: AbiInternalType
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
  | { type: 'fallback'; inputs?: [] }
  | { type: 'receive'; stateMutability: 'payable' }
)

/**
 * Abi event
 */
export type AbiEvent<TAbiParameter extends AbiParameter = AbiParameter> = {
  type: 'event'
  anonymous?: boolean
  inputs: readonly (TAbiParameter & { indexed?: boolean })[]
  name: string
}

/**
 * Abi error
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
