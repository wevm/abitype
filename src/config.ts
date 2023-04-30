import type { IsUnknown } from './types.js'

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
  ArrayMaxDepth: false
  /** Lower bound for fixed array length */
  FixedArrayMinLength: 1
  /** Upper bound for fixed array length */
  FixedArrayMaxLength: 99

  /** TypeScript type to use for `address` values */
  AddressType: `0x${string}`
  /** TypeScript type to use for `bytes` values */
  BytesType: {
    /** TypeScript type to use for `bytes` input values */
    inputs: `0x${string}`
    /** TypeScript type to use for `bytes` output values */
    outputs: `0x${string}`
  }
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48` */
  BigIntType: bigint
  /** TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48` */
  IntType: number

  /** When set, validates {@link AbiParameter}'s `type` against {@link AbiType} */
  StrictAbiType: false
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
   *
   * Note: You probably only want to set this to a specific number if parsed types are returning as `unknown`
   * and you want to figure out why. If you set this, you should probably also reduce `FixedArrayMaxLength`.
   *
   * @default false
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
   * @default 99
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
   * @default { inputs: `0x${string}` | Uint8Array; outputs: `0x${string}` }
   */
  BytesType: Config['BytesType'] extends { inputs: unknown; outputs: unknown }
    ? Config['BytesType']
    : DefaultConfig['BytesType']

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

  /**
   * When set, validates {@link AbiParameter}'s `type` against {@link AbiType}
   *
   * Note: You probably only want to set this to `true` if parsed types are returning as `unknown`
   * and you want to figure out why.
   *
   * @default false
   */
  StrictAbiType: Config['StrictAbiType'] extends true
    ? Config['StrictAbiType']
    : DefaultConfig['StrictAbiType']
}
