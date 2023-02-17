import type { Abi } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import type {
  IsSignature,
  ParseSignature,
  ParseStructs,
  Signature,
  Signatures,
} from './types'

export type ParseAbiItem<
  T extends string | readonly string[] | readonly unknown[],
> = T extends string
  ? T extends Signature<T> // Validate signature
    ? ParseSignature<T>
    : Signature<T> // Return error for invalid signature
  : string[] extends T
  ? Abi[number] // Return generic Abi item since type was no inferrable
  : T extends readonly string[]
  ? T extends Signatures<T> // Validate signatures
    ? ParseStructs<T> extends infer Structs
      ? {
          [K in keyof T]: T[K] extends string
            ? ParseSignature<T[K], Structs>
            : never
        } extends infer Mapped extends readonly unknown[]
        ? Filter<Mapped, never>[0]
        : never
      : never
    : // Error with one or more signatures, let's display them as errors
    Signatures<T> extends infer Errors
    ? {
        [K in keyof Errors]: Errors[K] extends `Error: ${string}`
          ? Errors[K]
          : never
      } extends infer Mapped extends readonly unknown[]
      ? Filter<Mapped, never>[0]
      : never
    : never
  : never

/**
 * @description Parses human-readable ABI item into JSON format
 * @param signatures - Human-readable ABI item
 * @returns JSON ABI item
 * @example
 * const abiItem = parseAbiItem('function balanceOf(address owner) view returns (uint256)')
 * //    ^? const abiItem: { name: "balanceOf"; type: "function"; stateMutability: "view";...
 * @example
 * const abiItem = parseAbiItem([
 *  //   ^? const abiItem: { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
 *  'function foo(Baz bar) view returns (string)',
 *  'struct Baz { string name; }',
 * ])
 */
export function parseAbiItem<
  T extends string | readonly string[] | readonly unknown[],
>(
  signatures: Narrow<T> &
    (string[] extends T
      ? unknown
      : T extends string
      ? IsSignature<T> extends true
        ? unknown
        : never
      : T extends Signatures<T extends readonly string[] ? T : never>
      ? unknown
      : never),
): ParseAbiItem<T> {
  return signatures as ParseAbiItem<T>
}
