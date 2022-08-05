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
 * To make the dev experience (e.g. autocomplete/type checking speed) almost instant,
 * the following caveats are in place for array types:
 *
 * * Missing fixed arrays (e.g `string[M]`)
 * *
 */
export type SolArray = `${
  | SolAddress
  | SolBool
  | SolBytes
  | SolFunction
  | SolString
  | SolTuple
  | SolInt
  | SolFixed}[]`

export type AbiType =
  | SolAddress
  | SolString
  | SolBool
  | SolFunction
  | SolBytes
  | SolInt
  | SolFixed
  | SolTuple
  | SolArray

export type Address = `0x${string}`

export type AbiInternalType =
  | AbiType
  | `contract ${string}`
  | `struct ${string}`

export type AbiParameter = {
  type: AbiType
  name: string
  /** Representation used by Solidity compiler */
  internalType?: AbiInternalType
} & (
  | { type: Exclude<AbiType, SolTuple> }
  | {
      type: `${SolTuple}` | `${SolTuple}[]`
      components: readonly AbiParameter[]
    }
)

export type AbiParameterType = 'inputs' | 'outputs'

export type AbiStateMutability = 'pure' | 'view' | 'nonpayable' | 'payable'

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

export type AbiEvent<TAbiParameter extends AbiParameter = AbiParameter> = {
  type: 'event'
  anonymous?: boolean
  inputs: readonly (TAbiParameter & { indexed?: boolean })[]
  name: string
}

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
