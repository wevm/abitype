import type { Abi } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import { BaseError } from './errors'
import { isStructSignature, parseStructs } from './runtime'
import { parseSignature } from './runtime/utils'
import type {
  IsSignature,
  ParseSignature,
  ParseStructs,
  Signature,
  Signatures,
} from './types'

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
> = TSignature extends string
  ? TSignature extends Signature<TSignature> // Validate signature
    ? ParseSignature<TSignature>
    : never
  : string[] extends TSignature
  ? Abi[number] // Return generic Abi item since type was no inferrable
  : TSignature extends readonly string[]
  ? TSignature extends Signatures<TSignature> // Validate signatures
    ? ParseStructs<TSignature> extends infer Structs
      ? {
          [K in keyof TSignature]: TSignature[K] extends string
            ? ParseSignature<TSignature[K], Structs>
            : never
        } extends infer Mapped extends readonly unknown[]
        ? Filter<Mapped, never>[0] extends infer Result
          ? Result extends undefined
            ? never
            : Result
          : never
        : never
      : never
    : never
  : never

/**
 * Parses human-readable ABI item (e.g. error, event, function) into {@link Abi} item
 *
 * @param signatures - Human-readable ABI item
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
  signatures: Narrow<TSignature> &
    (TSignature extends readonly []
      ? never
      : string[] extends TSignature
      ? unknown
      : TSignature extends string
      ? IsSignature<TSignature> extends true
        ? unknown
        : never
      : TSignature extends Signatures<
          TSignature extends readonly string[] ? TSignature : never
        >
      ? unknown
      : never),
): ParseAbiItem<TSignature> {
  let abiItem
  if (typeof signatures === 'string')
    abiItem = parseSignature(signatures) as ParseAbiItem<TSignature>
  else {
    const structs = parseStructs(signatures as readonly string[])
    const length = signatures.length
    for (let i = 0; i < length; i++) {
      const signature = (signatures as readonly string[])[i]!
      if (isStructSignature(signature)) continue
      abiItem = parseSignature(signature, structs)
      break
    }
  }

  if (!abiItem)
    throw new BaseError('Failed to parse ABI Item.', {
      details: `parseAbiItem(${JSON.stringify(signatures, null, 2)})`,
      docsPath: '/todo',
    })
  return abiItem as ParseAbiItem<TSignature>
}
