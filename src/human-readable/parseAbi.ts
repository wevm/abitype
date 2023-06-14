import type { Abi } from '../abi.js'
import type { Error, Filter } from '../types.js'
import { isStructSignature } from './runtime/signatures.js'
import { parseStructs } from './runtime/structs.js'
import { parseSignature } from './runtime/utils.js'
import type { Signatures } from './types/signatures.js'
import type { ParseStructs } from './types/structs.js'
import type { ParseSignature } from './types/utils.js'

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
export type ParseAbi<TSignatures extends readonly string[]> =
  string[] extends TSignatures
    ? Abi // If `T` was not able to be inferred (e.g. just `string[]`), return `Abi`
    : TSignatures extends readonly string[]
    ? TSignatures extends Signatures<TSignatures> // Validate signatures
      ? ParseStructs<TSignatures> extends infer Structs
        ? {
            [K in keyof TSignatures]: TSignatures[K] extends string
              ? ParseSignature<TSignatures[K], Structs>
              : never
          } extends infer Mapped extends readonly unknown[]
          ? Filter<Mapped, never> extends infer Result
            ? Result extends readonly []
              ? never
              : Result
            : never
          : never
        : never
      : never
    : never

/**
 * Parses human-readable ABI into JSON {@link Abi}
 *
 * @param signatures - Human-Readable ABI
 * @returns Parsed {@link Abi}
 *
 * @example
 * const abi = parseAbi([
 *   //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
 *   'function balanceOf(address owner) view returns (uint256)',
 *   'event Transfer(address indexed from, address indexed to, uint256 amount)',
 * ])
 */
export function parseAbi<const TSignatures extends readonly string[]>(
  signatures: TSignatures['length'] extends 0
    ? Error<'At least one signature required'>
    : Signatures<TSignatures> extends TSignatures
    ? TSignatures
    : Signatures<TSignatures>,
): ParseAbi<TSignatures> {
  const structs = parseStructs(signatures as readonly string[])
  const abi = []
  const length = signatures.length as number
  for (let i = 0; i < length; i++) {
    const signature = (signatures as readonly string[])[i]!
    if (isStructSignature(signature)) continue
    abi.push(parseSignature(signature, structs))
  }
  return abi as unknown as ParseAbi<TSignatures>
}
