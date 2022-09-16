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
  AddressType: `0x${string}`
  /** TypeScript type to use for `bytes` values */
  BytesType: `0x${string}`
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48` */
  BigIntType: bigint
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48` */
  IntType: number
}

/**
 * Resolved {@link Config} between user defined options and {@link DefaultConfig}
 *
 * @example
 * import { ResolvedConfig } from 'abitype'
 *
 * ResolvedConfig['BigIntType']
 */
export interface ResolvedConfig {
  /**
   * Maximum depth for nested array types (e.g. string[][])
   * @default 2
   */
  ArrayMaxDepth: Config['ArrayMaxDepth'] extends number | false
    ? Config['ArrayMaxDepth']
    : DefaultConfig['ArrayMaxDepth']
  /**
   * Lower bound for fixed array length
   * @default 1
   */
  FixedArrayMinLength: Config['FixedArrayMinLength'] extends number
    ? Config['FixedArrayMinLength']
    : DefaultConfig['FixedArrayMinLength']
  /**
   * Upper bound for fixed array length
   * @default 5
   */
  FixedArrayMaxLength: Config['FixedArrayMaxLength'] extends number
    ? Config['FixedArrayMaxLength']
    : DefaultConfig['FixedArrayMaxLength']

  /**
   * TypeScript type to use for `address` values
   * @default `0x${string}`
   */
  AddressType: IsUnknown<Config['AddressType']> extends true
    ? DefaultConfig['AddressType']
    : Config['AddressType']
  /**
   * TypeScript type to use for `bytes` values
   * @default `0x${string}`
   */
  BytesType: IsUnknown<Config['BytesType']> extends true
    ? DefaultConfig['BytesType']
    : Config['BytesType']
  /**
   * TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48`
   * @default bigint
   */
  BigIntType: IsUnknown<Config['BigIntType']> extends true
    ? DefaultConfig['BigIntType']
    : Config['BigIntType']
  /**
   * TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48`
   * @default number
   */
  IntType: IsUnknown<Config['IntType']> extends true
    ? DefaultConfig['IntType']
    : Config['IntType']
}
