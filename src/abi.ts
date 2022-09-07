import { Range } from './types'

export type Address = `0x${string}`

////////////////////////////////////////////////////////////////////////////////////////////////////
// Solidity Types

// prettier-ignore
type MBits =
  | ''  | 8   | 16  | 24  | 32  | 40  | 48  | 56  | 64  | 72
  | 80  | 88  | 96  | 104 | 112 | 120 | 128 | 136 | 144 | 152
  | 160 | 168 | 176 | 184 | 192 | 200 | 208 | 216 | 224 | 232
  | 240 | 248 | 256

// prettier-ignore
type MBytes =
  | '' | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9
  | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
  | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
  | 30 | 31 | 32

export type SolidityAddress = 'address'
export type SolidityBool = 'bool'
export type SolidityBytes = `bytes${MBytes}`
export type SolidityFunction = 'function'
export type SolidityString = 'string'
export type SolidityTuple = 'tuple'
export type SolidityInt = `${'u' | ''}int${MBits}`
// No need to support "fixed" until Solidity does
// https://github.com/ethereum/solidity/issues/409
// export type SolidityFixed =
//   | `${'u' | ''}fixed`
//   | `${'u' | ''}fixed${MBits}x${Range<1, 20>[number]}`

declare global {
  type FixedArrayLowerBound = 1
  type FixedArrayUpperBound = 5

  type Fixed2DArrayLowerBound = 1
  type Fixed2DArrayUpperBound = 5
}

export type SolidityFixedArrayRange = Range<
  FixedArrayLowerBound,
  FixedArrayUpperBound
>[number]
export type SolidityFixedArraySizeLookup = {
  [Prop in SolidityFixedArrayRange as `${Prop}`]: Prop
}
export type SolidityFixed2DArrayRange = Range<
  Fixed2DArrayLowerBound,
  Fixed2DArrayUpperBound
>[number]
export type SolidityFixed2DArraySizeLookup = {
  [Prop in SolidityFixed2DArrayRange as `${Prop}`]: Prop
}

// Creating array types with and without tuples for using in `AbiParameter` narrowing
type SolidityArrayWithoutTuple =
  | `${
      | SolidityAddress
      | SolidityBool
      | SolidityBytes
      | SolidityFunction
      | SolidityString
      | SolidityInt}[${SolidityFixedArrayRange | ''}]`
type Solidity2DArrayWithoutTuple = `${SolidityArrayWithoutTuple}[${
  | SolidityFixed2DArrayRange
  | ''}]`
type SolidityArrayWithTuple =
  | `${SolidityTuple}[${SolidityFixedArrayRange | ''}]`
type Solidity2DArrayWithTuple = `${SolidityArrayWithTuple}[${
  | SolidityFixed2DArrayRange
  | ''}]`

export type SolidityArray = SolidityArrayWithTuple | SolidityArrayWithoutTuple
export type Solidity2DArray =
  | Solidity2DArrayWithTuple
  | Solidity2DArrayWithoutTuple

////////////////////////////////////////////////////////////////////////////////////////////////////
// Abi Types

export type AbiType =
  | Solidity2DArray
  | SolidityArray
  | SolidityAddress
  | SolidityBool
  | SolidityBytes
  | SolidityFunction
  | SolidityInt
  | SolidityString
  | SolidityTuple

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
  | {
      type:
        | Exclude<AbiType, SolidityTuple | SolidityArray | Solidity2DArray>
        | SolidityArrayWithoutTuple
        | Solidity2DArrayWithoutTuple
    }
  | {
      type: SolidityTuple | SolidityArrayWithTuple | Solidity2DArrayWithTuple
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
 * Contract ABI Specification
 * https://docs.soliditylang.org/en/latest/abi-spec.html#json
 */
export type Abi = readonly (AbiFunction | AbiEvent | AbiError)[]
