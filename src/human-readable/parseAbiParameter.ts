import type { AbiParameter } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import {
  isStructSignature,
  parseAbiParameter as parseAbiParameter_,
  parseStructs,
} from './runtime'
import type {
  IsStructSignature,
  Modifier,
  ParseAbiParameter as ParseAbiParameter_,
  ParseStructs,
} from './types'
import { modifiers } from './types'

/**
 * Parses human-readable ABI parameter into {@link AbiParameter}
 *
 * @param T - Human-readable ABI parameter
 * @returns Parsed {@link AbiParameter}
 *
 * @example
 * type Result = ParseAbiParameter<'address from'>
 * //   ^? type Result = { type: "address"; name: "from"; }
 *
 * @example
 * type Result = ParseAbiParameter<
 *   // ^? type Result = { type: "tuple"; components: [{ type: "string"; name:...
 *   ['Baz bar', 'struct Baz { string name; }']
 * >
 */
export type ParseAbiParameter<
  T extends string | readonly string[] | readonly unknown[],
> = T extends string
  ? T extends ''
    ? never
    : ParseAbiParameter_<T, { Modifier: Modifier }>
  : string[] extends T
  ? AbiParameter // Return generic AbiParameter item since type was no inferrable
  : T extends readonly string[]
  ? ParseStructs<T> extends infer Structs
    ? {
        [K in keyof T]: T[K] extends string
          ? IsStructSignature<T[K]> extends true
            ? never
            : ParseAbiParameter_<T[K], { Modifier: Modifier; Structs: Structs }>
          : never
      } extends infer Mapped extends readonly unknown[]
      ? Filter<Mapped, never>[0]
      : never
    : never
  : never

/**
 * Parses human-readable ABI parameter into {@link AbiParameter}
 *
 * @param signature - Human-readable ABI parameter
 * @returns Parsed {@link AbiParameter}
 *
 * @example
 * const abiParameter = parseAbiParameter('address from')
 * //    ^? const abiParameter: { type: "address"; name: "from"; }
 *
 * @example
 * const abiParameter = parseAbiParameter([
 *   //  ^? const abiParameter: { type: "tuple"; components: [{ type: "string"; name:...
 *   'Baz bar',
 *   'struct Baz { string name; }',
 * ])
 */
export function parseAbiParameter<
  T extends string | readonly string[] | readonly unknown[],
>(
  signatures: Narrow<T> &
    (T extends readonly []
      ? never
      : string[] extends T
      ? unknown
      : T extends string
      ? T extends ''
        ? never
        : unknown
      : T extends readonly string[]
      ? unknown
      : never),
): ParseAbiParameter<T> {
  let abiParameter
  if (typeof signatures === 'string')
    abiParameter = parseAbiParameter_(signatures, {
      modifiers,
    }) as ParseAbiParameter<T>
  else {
    const structs = parseStructs(signatures as readonly string[])
    const length = signatures.length
    for (let i = 0; i < length; i++) {
      const signature = (signatures as readonly string[])[i]!
      if (isStructSignature(signature)) continue
      abiParameter = parseAbiParameter_(signature, { modifiers, structs })
      break
    }
  }

  if (!abiParameter) throw new Error('Failed to parse ABI parameter')
  return abiParameter as ParseAbiParameter<T>
}
