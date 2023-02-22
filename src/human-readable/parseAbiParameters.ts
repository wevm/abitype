import type { AbiParameter } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import {
  isStructSignature,
  parseAbiParameter as parseAbiParameter_,
  parseStructs,
  splitParameters,
} from './runtime'
import type {
  IsStructSignature,
  Modifier,
  ParseAbiParameters as ParseAbiParameters_,
  ParseStructs,
  SplitParams,
} from './types'
import { modifiers } from './types'

export type ParseAbiParameters<
  T extends string | readonly string[] | readonly unknown[],
> = T extends string
  ? ParseAbiParameters_<SplitParams<T>, { Modifier: Modifier }>
  : string[] extends T
  ? AbiParameter // Return generic AbiParameter item since type was no inferrable
  : T extends readonly string[]
  ? ParseStructs<T> extends infer Structs
    ? {
        [K in keyof T]: T[K] extends string
          ? IsStructSignature<T[K]> extends true
            ? never
            : ParseAbiParameters_<
                SplitParams<T[K]>,
                { Modifier: Modifier; Structs: Structs }
              >
          : never
      } extends infer Mapped extends readonly unknown[]
      ? Filter<Mapped, never>[0] extends infer Parameters
        ? Parameters extends undefined
          ? []
          : Parameters
        : never
      : never
    : never
  : never

/**
 * @description Parses human-readable ABI parameters into JSON format
 * @param signatures - Human-readable ABI parameters
 * @returns JSON ABI parameters
 * @example
 * const abiParameters = parseAbiParameters('address from, address to, uint256 amount')
 * //    ^? const abiParameters: [{ type: "address"; name: "from"; }, { type: "address";...
 * @example
 * const abiParameters = parseAbiParameters([
 *  //   ^? const abiParameters: [{ type: "tuple"; components: [{ type: "string"; name:...
 *  'Baz bar',
 *  'struct Baz { string name; }',
 * ])
 */
export function parseAbiParameters<
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
): ParseAbiParameters<T> {
  const abiParameters = []
  if (typeof signatures === 'string') {
    const parameters = splitParameters(signatures)
    for (const parameter of parameters) {
      abiParameters.push(parseAbiParameter_(parameter, { modifiers }))
    }
  } else {
    const structs = parseStructs(signatures as readonly string[])
    for (const signature of signatures as readonly string[]) {
      if (isStructSignature(signature)) continue
      const parameters = splitParameters(signature)
      for (const parameter of parameters) {
        abiParameters.push(
          parseAbiParameter_(parameter, { modifiers, structs }),
        )
      }
    }
  }

  if (abiParameters.length === 0)
    throw new Error('Failed to parse ABI parameter')
  return abiParameters as ParseAbiParameters<T>
}
