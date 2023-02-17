import type { Abi } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import type { Signatures } from './signatures'
import type { ParseStructs } from './structs'
import type { ParseSignature } from './utils'

// * TSDoc and comments
// * https://www.craft.do/s/mARCBG8Y0TXqv0
// * `parseAbiParameters`/`ParseAbiParameters` https://wagmi-dev.slack.com/archives/C041LADTUJH/p1676325558652399
// * Allow whitespace in between keywords?
// * Review signatures from contracts in the wild (check modifiers - do we need `'payable'` for params, etc.) https://docs.soliditylang.org/en/latest/contracts.html#state-mutability

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
      : // Error with one or more signatures, let's display them as errors
      Signatures<TSignatures> extends infer Errors
      ? {
          [K in keyof Errors]: Errors[K] extends `Error: ${string}`
            ? Errors[K]
            : never
        } extends infer Mapped extends readonly unknown[]
        ? Filter<Mapped, never>
        : never
      : never
    : never

/**
 * @description Parses human-readable ABI into JSON ABI
 * @param signatures - Human-readable ABI
 * @returns JSON ABI
 * @example
 * const abi = parseAbi([
 *  //   ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability: "view"; inputs: [{...
 *  'function balanceOf(address owner) view returns (uint256)',
 *  'event Transfer(address indexed from, address indexed to, uint256 amount)',
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
  return signatures as ParseAbi<TSignatures>
}
