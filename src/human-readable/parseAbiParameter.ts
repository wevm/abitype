import type { AbiParameter } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import { parseAbiParameter as parseAbiParameter_ } from './runtime'
import type {
  IsStructSignature,
  Modifier,
  ParseAbiParameter as ParseAbiParameter_,
  ParseStructs,
} from './types'
import { modifiers } from './types'

export type ParseAbiParameter<
  T extends string | readonly string[] | readonly unknown[],
> = T extends string
  ? T extends ''
    ? undefined
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
 * @description Parses human-readable ABI parameter into JSON format
 * @param signature - Human-readable ABI parameter
 * @returns JSON ABI parameter
 * @example
 * const abiParameter = parseAbiParameter('address from')
 * //    ^? const abiParameter: { type: "address"; name: "from"; }
 * @example
 * const abiParameter = parseAbiParameter([
 *  //   ^? const abiParameter: { type: "tuple"; components: [{ type: "string"; name:...
 *  'Baz bar',
 *  'struct Baz { string name; }',
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
  if (typeof signatures === 'string')
    return parseAbiParameter_(signatures, { modifiers }) as ParseAbiParameter<T>

  return signatures as ParseAbiParameter<T>
}
