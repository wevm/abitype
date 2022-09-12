import { Address } from './abi'
import { IsUnknown } from './types'

/**
 * Override `Config` to customize type options
 *
 * @example
 * declare module 'abitype' {
 *   export interface Config {
 *     FixedArrayMaxLength: 6
 *   }
 * }
 */
export interface Config {
  [key: string]: unknown
}

/**
 * Default {@link Config} options
 */
export interface DefaultConfig {
  /** Maximum depth for nested array types (e.g. string[][]) */
  ArrayMaxDepth: 2
  /** Lower bound for fixed array length */
  FixedArrayMinLength: 1
  /** Upper bound for fixed array length */
  FixedArrayMaxLength: 5

  /** TypeScript type to use for `address` values */
  AddressType: Address
  /** TypeScript type to use for `bytes` values */
  BytesType: string | ArrayLike<number>
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48` */
  BigIntType: bigint
  /** TypeScript type to use for `int` and `uint` values, where `M <= 48` */
  IntType: number
}

/**
 * Resolve {@link Config} between user defined options and {@link DefaultConfig}
 *
 * @example
 * import { ResolvedConfig } from 'abitype'
 *
 * ResolvedConfig['ArrayMaxDepth']
 */
export interface ResolvedConfig {
  ArrayMaxDepth: Config['ArrayMaxDepth'] extends number | false
    ? Config['ArrayMaxDepth']
    : DefaultConfig['ArrayMaxDepth']
  FixedArrayMinLength: Config['FixedArrayMinLength'] extends number
    ? Config['FixedArrayMinLength']
    : DefaultConfig['FixedArrayMinLength']
  FixedArrayMaxLength: Config['FixedArrayMaxLength'] extends number
    ? Config['FixedArrayMaxLength']
    : DefaultConfig['FixedArrayMaxLength']

  AddressType: IsUnknown<Config['AddressType']> extends true
    ? DefaultConfig['AddressType']
    : Config['AddressType']
  BytesType: IsUnknown<Config['BytesType']> extends true
    ? DefaultConfig['BytesType']
    : Config['BytesType']
  BigIntType: IsUnknown<Config['BigIntType']> extends true
    ? DefaultConfig['BigIntType']
    : Config['BigIntType']
  IntType: IsUnknown<Config['IntType']> extends true
    ? DefaultConfig['IntType']
    : Config['IntType']
}
