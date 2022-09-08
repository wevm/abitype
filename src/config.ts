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
  ArrayMaxDepth: 2
  FixedArrayLengthLowerBound: 1
  FixedArrayLengthUpperBound: 5
}
