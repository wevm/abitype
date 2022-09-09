import { Config, DefaultConfig } from './config'
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

type FixedArrayLowerBound = Config['FixedArrayLengthLowerBound'] extends number
  ? Config['FixedArrayLengthLowerBound']
  : DefaultConfig['FixedArrayLengthLowerBound']
type FixedArrayUpperBound = Config['FixedArrayLengthUpperBound'] extends number
  ? Config['FixedArrayLengthUpperBound']
  : DefaultConfig['FixedArrayLengthUpperBound']

export type SolidityFixedArrayRange = Range<
  FixedArrayLowerBound,
  FixedArrayUpperBound
>[number]
export type SolidityFixedArraySizeLookup = {
  [Prop in SolidityFixedArrayRange as `${Prop}`]: Prop
}

type MAXIMUM_DEPTH = Config['ArrayMaxDepth'] extends number
  ? Config['ArrayMaxDepth']
  : DefaultConfig['ArrayMaxDepth']
type BuildArrayTypes<
  T extends string,
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? T
  : T extends `${any}[${SolidityFixedArrayRange | ''}]`
  ? BuildArrayTypes<T | `${T}[${SolidityFixedArrayRange | ''}]`, [...Depth, 1]>
  : BuildArrayTypes<`${T}[${SolidityFixedArrayRange | ''}]`, [...Depth, 1]>

export type SolidityArrayWithoutTuple = BuildArrayTypes<
  | SolidityAddress
  | SolidityBool
  | SolidityBytes
  | SolidityFunction
  | SolidityInt
  | SolidityString
>
export type SolidityArrayWithTuple = BuildArrayTypes<SolidityTuple>
export type SolidityArray = SolidityArrayWithoutTuple | SolidityArrayWithTuple

////////////////////////////////////////////////////////////////////////////////////////////////////
// Abi Types

export type AbiType =
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
        | Exclude<AbiType, SolidityTuple | SolidityArray>
        | SolidityArrayWithoutTuple
    }
  | {
      type: SolidityTuple | SolidityArrayWithTuple
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
 * Contract [ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)
 */
export type Abi = readonly (AbiFunction | AbiEvent | AbiError)[]

////////////////////////////////////////////////////////////////////////////////////////////////////
// Typed Data Types

// Subset of `AbiType` that excludes `tuple` and `function`
export type TypedDataType =
  | Exclude<AbiType, SolidityArray | SolidityFunction | SolidityTuple>
  | SolidityArrayWithoutTuple

/**
 * [EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Typed Data Specification
 */
export type TypedData = {
  [key: string]: readonly {
    name: string
    type: TypedDataType | keyof TypedData | `${keyof TypedData}[${string | ''}]`
  }[]
} & {
  [_ in TypedDataType]?: never
}
