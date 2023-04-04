import type { Abi } from '../abi'
import type { ParseAbiParameters } from '../human-readable/types/utils'
import type { Selectors } from './config'
import type {
  ADDRESS_ZERO_MASK,
  UINT104_ZERO_MASK,
  UINT112_ZERO_MASK,
  UINT120_ZERO_MASK,
  UINT128_ZERO_MASK,
  UINT136_ZERO_MASK,
  UINT144_ZERO_MASK,
  UINT152_ZERO_MASK,
  UINT168_ZERO_MASK,
  UINT16_ZERO_MASK,
  UINT176_ZERO_MASK,
  UINT184_ZERO_MASK,
  UINT192_ZERO_MASK,
  UINT200_ZERO_MASK,
  UINT208_ZERO_MASK,
  UINT216_ZERO_MASK,
  UINT224_ZERO_MASK,
  UINT232_ZERO_MASK,
  UINT240_ZERO_MASK,
  UINT248_ZERO_MASK,
  UINT24_ZERO_MASK,
  UINT32_ZERO_MASK,
  UINT40_ZERO_MASK,
  UINT48_ZERO_MASK,
  UINT56_ZERO_MASK,
  UINT64_ZERO_MASK,
  UINT72_ZERO_MASK,
  UINT80_ZERO_MASK,
  UINT88_ZERO_MASK,
  UINT8_ZERO_MASK,
  UINT96_ZERO_MASK,
} from './mask'
import type { ExtractSelectors } from './selectors'

import type { ExtractName, ExtractParameters, SplitByChunks } from './utils'

export type InferConstructorArguments<T extends string[]> = {
  [K in keyof T]: T[K] extends `${UINT8_ZERO_MASK}${string}`
    ?
        | { readonly type: 'uint8' }
        | { readonly type: 'bytes1' }
        | { readonly type: 'bool' }
    : T[K] extends `${UINT16_ZERO_MASK}${string}`
    ? { readonly type: 'uint16' } | { readonly type: 'bytes2' }
    : T[K] extends `${UINT24_ZERO_MASK}${string}`
    ? { readonly type: 'uint24' } | { readonly type: 'bytes3' }
    : T[K] extends `${UINT32_ZERO_MASK}${string}`
    ? { readonly type: 'uint32' } | { readonly type: 'bytes4' }
    : T[K] extends `${UINT40_ZERO_MASK}${string}`
    ? { readonly type: 'uint40' } | { readonly type: 'bytes5' }
    : T[K] extends `${UINT48_ZERO_MASK}${string}`
    ? { readonly type: 'uint48' } | { readonly type: 'bytes6' }
    : T[K] extends `${UINT56_ZERO_MASK}${string}`
    ? { readonly type: 'uint56' } | { readonly type: 'bytes7' }
    : T[K] extends `${UINT64_ZERO_MASK}${string}`
    ? { readonly type: 'uint64' } | { readonly type: 'bytes8' }
    : T[K] extends `${UINT72_ZERO_MASK}${string}`
    ? { readonly type: 'uint72' } | { readonly type: 'bytes9' }
    : T[K] extends `${UINT80_ZERO_MASK}${string}`
    ? { readonly type: 'uint80' } | { readonly type: 'bytes10' }
    : T[K] extends `${UINT88_ZERO_MASK}${string}`
    ? { readonly type: 'uint88' } | { readonly type: 'bytes11' }
    : T[K] extends `${UINT96_ZERO_MASK}${string}`
    ? { readonly type: 'uint96' } | { readonly type: 'bytes12' }
    : T[K] extends `${UINT104_ZERO_MASK}${string}`
    ? { readonly type: 'uint104' } | { readonly type: 'bytes13' }
    : T[K] extends `${UINT112_ZERO_MASK}${string}`
    ? { readonly type: 'uint112' } | { readonly type: 'bytes14' }
    : T[K] extends `${UINT120_ZERO_MASK}${string}`
    ? { readonly type: 'uint120' } | { readonly type: 'bytes15' }
    : T[K] extends `${UINT128_ZERO_MASK}${string}`
    ? { readonly type: 'uint128' } | { readonly type: 'bytes16' }
    : T[K] extends `${UINT136_ZERO_MASK}${string}`
    ? { readonly type: 'uint136' } | { readonly type: 'bytes17' }
    : T[K] extends `${UINT144_ZERO_MASK}${string}`
    ? { readonly type: 'uint144' } | { readonly type: 'bytes18' }
    : T[K] extends `${UINT152_ZERO_MASK}${string}`
    ? { readonly type: 'uint152' } | { readonly type: 'bytes19' }
    : T[K] extends `${ADDRESS_ZERO_MASK}${string}`
    ?
        | { readonly type: 'address' }
        | { readonly type: 'uint160' }
        | { readonly type: 'bytes20' }
    : T[K] extends `${UINT168_ZERO_MASK}${string}`
    ? { readonly type: 'uint168' } | { readonly type: 'bytes21' }
    : T[K] extends `${UINT176_ZERO_MASK}${string}`
    ? { readonly type: 'uint176' } | { readonly type: 'bytes22' }
    : T[K] extends `${UINT184_ZERO_MASK}${string}`
    ? { readonly type: 'uint184' } | { readonly type: 'bytes23' }
    : T[K] extends `${UINT192_ZERO_MASK}${string}`
    ? { readonly type: 'uint192' } | { readonly type: 'bytes24' }
    : T[K] extends `${UINT200_ZERO_MASK}${string}`
    ? { readonly type: 'uint200' } | { readonly type: 'bytes25' }
    : T[K] extends `${UINT208_ZERO_MASK}${string}`
    ? { readonly type: 'uint208' } | { readonly type: 'bytes26' }
    : T[K] extends `${UINT216_ZERO_MASK}${string}`
    ? { readonly type: 'uint216' } | { readonly type: 'bytes27' }
    : T[K] extends `${UINT224_ZERO_MASK}${string}`
    ? { readonly type: 'uint224' } | { readonly type: 'bytes28' }
    : T[K] extends `${UINT232_ZERO_MASK}${string}`
    ? { readonly type: 'uint232' } | { readonly type: 'bytes29' }
    : T[K] extends `${UINT240_ZERO_MASK}${string}`
    ? { readonly type: 'uint240' } | { readonly type: 'bytes30' }
    : T[K] extends `${UINT248_ZERO_MASK}${string}`
    ? { readonly type: 'uint248' } | { readonly type: 'bytes31' }
    : T[K] extends `${string}0`
    ? { readonly type: 'string' }
    : { readonly type: 'uint256' } | { readonly type: 'bytes32' }
}

export type ParseBytecodeFunctionSelector<T extends string> = {
  readonly name: Selectors[T] extends string ? ExtractName<Selectors[T]> : T
  readonly stateMutability: 'nonpayable'
  readonly inputs: Selectors[T] extends string
    ? ParseAbiParameters<ExtractParameters<Selectors[T]>>
    : readonly []
  readonly outputs: readonly []
  readonly type: 'function'
}

export type ParseBytecodeEventSelector<T extends string> = {
  readonly name: Selectors[T] extends string ? ExtractName<Selectors[T]> : T
  readonly inputs: Selectors[T] extends string
    ? ParseAbiParameters<ExtractParameters<Selectors[T]>>
    : readonly []
  readonly type: 'event'
}

export type ParseBytecodeErrorSelector<T extends string> = {
  readonly name: Selectors[T] extends string ? ExtractName<Selectors[T]> : T
  readonly inputs: Selectors[T] extends string
    ? ParseAbiParameters<ExtractParameters<Selectors[T]>>
    : readonly []
  readonly type: 'error'
}

export type ParseBytecodeConstructor<T extends string> = {
  readonly type: 'constructor'
  readonly stateMutability: 'nonpayable'
  readonly inputs: InferConstructorArguments<SplitByChunks<T>>
}

export type ParseSelectors<T extends { type: string; selector: string }[]> = {
  readonly [K in keyof T]: T[K]['type'] extends 'constructor'
    ? ParseBytecodeConstructor<T[K]['selector']>
    : T[K]['type'] extends 'error'
    ? ParseBytecodeErrorSelector<T[K]['selector']>
    : T[K]['type'] extends 'event'
    ? ParseBytecodeEventSelector<T[K]['selector']>
    : T[K]['type'] extends 'function'
    ? ParseBytecodeFunctionSelector<T[K]['selector']>
    : never
}

export type ParseBytecode<T extends string> = string extends T
  ? Abi
  : ExtractSelectors<T> extends infer Result extends {
      type: string
      selector: string
    }[]
  ? ParseSelectors<Result>
  : readonly []
