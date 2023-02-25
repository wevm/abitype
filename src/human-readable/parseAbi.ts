import type { Abi } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import { isStructSignature, parseStructs } from './runtime'
import { parseSignature } from './runtime/utils'
import type { ParseSignature, ParseStructs, Signatures } from './types'

/**
 * Parses human-readable ABI into JSON {@link Abi}
 *
 * @param TSignatures - Human-readable ABI
 * @returns Parsed {@link Abi}
 *
 * @example
 * type Result = ParseAbi<
 *   // ^? type Result = readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
 *   [
 *     'function balanceOf(address owner) view returns (uint256)',
 *     'event Transfer(address indexed from, address indexed to, uint256 amount)',
 *   ]
 * >
 */
export type ParseAbi<
  TSignatures extends readonly string[] | readonly unknown[],
> =
  // If `T` was not able to be inferred (e.g. just `string[]`), return `Abi`
  string[] extends TSignatures
    ? Abi
    : TSignatures extends readonly string[]
    ? TSignatures extends Signatures<TSignatures> // Validate signatures
      ? ParseStructs<TSignatures> extends infer Structs
        ? {
            [K in keyof TSignatures]: TSignatures[K] extends string
              ? ParseSignature<TSignatures[K], Structs>
              : never
          } extends infer Mapped extends readonly unknown[]
          ? Filter<Mapped, never>
          : never
        : never
      : never
    : never

/**
 * Parses human-readable ABI into JSON {@link Abi}
 *
 * @param signatures - Human-readable ABI
 * @returns Parsed {@link Abi}
 *
 * @example
 * const abi = parseAbi([
 *   //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
 *   'function balanceOf(address owner) view returns (uint256)',
 *   'event Transfer(address indexed from, address indexed to, uint256 amount)',
 * ])
 */
export function parseAbi<
  TSignatures extends readonly string[] | readonly unknown[],
>(
  signatures: Narrow<TSignatures> &
    (string[] extends TSignatures
      ? unknown
      : TSignatures extends Signatures<
          TSignatures extends readonly string[] ? TSignatures : never
        >
      ? unknown
      : never),
): ParseAbi<TSignatures> {
  const structs = parseStructs(signatures as readonly string[])
  const abi = []
  const length = signatures.length
  for (let i = 0; i < length; i++) {
    const signature = (signatures as readonly string[])[i]!
    if (isStructSignature(signature)) continue
    abi.push(parseSignature(signature, structs))
  }
  return abi as unknown as ParseAbi<TSignatures>
}
