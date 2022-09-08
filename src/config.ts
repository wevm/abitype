/**
 * Override `Config` to customize type options
 *
 * ```
 * // create abitype.d.ts in your project source
 * // if it isn't being picked up, check tsconfig compilerOptions.types
 * declare module 'abitype' {
 *   export interface Config {
 *     FixedArrayUpperBound: 6
 *   }
 * }
 * ```
 */
export interface Config {
  [key: string]: unknown
}

export interface DefaultConfig {
  /** Maximum depth for nested array types (e.g. string[][]) */
  ArrayMaxDepth: 2
  /** Lower bound for fixed array length */
  FixedArrayLengthLowerBound: 1
  /** Upper bound for fixed array length */
  FixedArrayLengthUpperBound: 5
}
