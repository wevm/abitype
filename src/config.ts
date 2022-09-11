/**
 * Override `Config` to customize type options
 *
 * @example
 * declare module 'abitype' {
 *   export interface Config {
 *     FixedArrayLengthUpperBound: 6
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
  FixedArrayLengthLowerBound: 1
  /** Upper bound for fixed array length */
  FixedArrayLengthUpperBound: 5
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
  FixedArrayLengthLowerBound: Config['FixedArrayLengthLowerBound'] extends number
    ? Config['FixedArrayLengthLowerBound']
    : DefaultConfig['FixedArrayLengthLowerBound']
  FixedArrayLengthUpperBound: Config['FixedArrayLengthUpperBound'] extends number
    ? Config['FixedArrayLengthUpperBound']
    : DefaultConfig['FixedArrayLengthUpperBound']
}
