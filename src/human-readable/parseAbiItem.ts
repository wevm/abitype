import type { Abi } from '../abi.js'
import type { Narrow } from '../narrow.js'
import type { Error, Filter } from '../types.js'
import { InvalidAbiItemError } from './errors/index.js'
import {
  isStructSignature,
  parseSignature,
  parseStructs,
} from './runtime/index.js'
import type {
  ParseSignature,
  ParseStructs,
  Signature,
  Signatures,
} from './types/index.js'

/**
 * Parses human-readable ABI item (e.g. error, event, function) into {@link Abi} item
 *
 * @param TSignature - Human-readable ABI item
 * @returns Parsed {@link Abi} item
 *
 * @example
 * type Result = ParseAbiItem<'function balanceOf(address owner) view returns (uint256)'>
 * //   ^? type Result = { name: "balanceOf"; type: "function"; stateMutability: "view";...
 *
 * @example
 * type Result = ParseAbiItem<
 *   // ^? type Result = { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
 *   ['function foo(Baz bar) view returns (string)', 'struct Baz { string name; }']
 * >
 */
export type ParseAbiItem<
  TSignature extends string | readonly string[] | readonly unknown[],
> =
  | (TSignature extends string
      ? string extends TSignature
        ? Abi[number]
        : TSignature extends Signature<TSignature> // Validate signature
        ? ParseSignature<TSignature>
        : never
      : never)
  | (TSignature extends readonly string[]
      ? string[] extends TSignature
        ? Abi[number] // Return generic Abi item since type was no inferrable
        : TSignature extends Signatures<TSignature> // Validate signature
        ? ParseStructs<TSignature> extends infer Structs
          ? {
              [K in keyof TSignature]: ParseSignature<
                TSignature[K] extends string ? TSignature[K] : never,
                Structs
              >
            } extends infer Mapped extends readonly unknown[]
            ? // Filter out `never` since those are structs
              Filter<Mapped, never>[0] extends infer Result
              ? Result extends undefined // convert `undefined` to `never` (e.g. `ParseAbiItem<['struct Foo { string name; }']>`)
                ? never
                : Result
              : never
            : never
          : never
        : never
      : never)

/**
 * Parses human-readable ABI item (e.g. error, event, function) into {@link Abi} item
 *
 * @param signature - Human-readable ABI item
 * @returns Parsed {@link Abi} item
 *
 * @example
 * const abiItem = parseAbiItem('function balanceOf(address owner) view returns (uint256)')
 * //    ^? const abiItem: { name: "balanceOf"; type: "function"; stateMutability: "view";...
 *
 * @example
 * const abiItem = parseAbiItem([
 *   //  ^? const abiItem: { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
 *   'function foo(Baz bar) view returns (string)',
 *   'struct Baz { string name; }',
 * ])
 */
export function parseAbiItem<
  TSignature extends string | readonly string[] | readonly unknown[],
>(
  signature: Narrow<TSignature> &
    (
      | (TSignature extends string
          ? string extends TSignature
            ? unknown
            : Signature<TSignature>
          : never)
      | (TSignature extends readonly string[]
          ? TSignature extends readonly [] // empty array
            ? Error<'At least one signature required.'>
            : string[] extends TSignature
            ? unknown
            : Signatures<TSignature>
          : never)
    ),
): ParseAbiItem<TSignature> {
  let abiItem
  if (typeof signature === 'string')
    abiItem = parseSignature(signature) as ParseAbiItem<TSignature>
  else {
    const structs = parseStructs(signature as readonly string[])
    const length = signature.length as number
    for (let i = 0; i < length; i++) {
      const signature_ = (signature as readonly string[])[i]!
      if (isStructSignature(signature_)) continue
      abiItem = parseSignature(signature_, structs)
      break
    }
  }

  if (!abiItem) throw new InvalidAbiItemError({ signature })
  return abiItem as ParseAbiItem<TSignature>
}
