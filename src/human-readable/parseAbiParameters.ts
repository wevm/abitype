import type { AbiParameter } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import { BaseError } from './errors'
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
  SplitParameters,
} from './types'
import { modifiers } from './types'

/**
 * Parses human-readable ABI parameters into {@link AbiParameter}s
 *
 * @param TParams - Human-readable ABI parameters
 * @returns Parsed {@link AbiParameter}s
 *
 * @example
 * type Result = ParseAbiParameters('address from, address to, uint256 amount')
 * //   ^? type Result: [{ type: "address"; name: "from"; }, { type: "address";...
 *
 * @example
 * type Result = ParseAbiParameters<
 *   // ^? type Result: [{ type: "tuple"; components: [{ type: "string"; name:...
 *   ['Baz bar', 'struct Baz { string name; }']
 * >
 */
export type ParseAbiParameters<
  TParams extends string | readonly string[] | readonly unknown[],
> =
  | (TParams extends string
      ? TParams extends ''
        ? never
        : ParseAbiParameters_<SplitParameters<TParams>, { Modifier: Modifier }>
      : never)
  // Return generic AbiParameter item since type was not inferrable
  | (string[] extends TParams ? AbiParameter : never)
  | (TParams extends readonly string[]
      ? ParseStructs<TParams> extends infer Structs
        ? {
            [K in keyof TParams]: TParams[K] extends string
              ? IsStructSignature<TParams[K]> extends true // filter out structs
                ? never
                : ParseAbiParameters_<
                    SplitParameters<TParams[K]>,
                    { Modifier: Modifier; Structs: Structs }
                  >
              : never
          } extends infer Mapped extends readonly unknown[]
          ? Filter<Mapped, never>[0] extends infer Result
            ? Result extends undefined
              ? never
              : Result
            : never
          : never
        : never
      : never)

/**
 * Parses human-readable ABI parameters into {@link AbiParameter}s
 *
 * @param params - Human-readable ABI parameters
 * @returns Parsed {@link AbiParameter}s
 *
 * @example
 * const abiParameters = parseAbiParameters('address from, address to, uint256 amount')
 * //    ^? const abiParameters: [{ type: "address"; name: "from"; }, { type: "address";...
 *
 * @example
 * const abiParameters = parseAbiParameters([
 *   //  ^? const abiParameters: [{ type: "tuple"; components: [{ type: "string"; name:...
 *   'Baz bar',
 *   'struct Baz { string name; }',
 * ])
 */
export function parseAbiParameters<
  TParams extends string | readonly string[] | readonly unknown[],
>(
  params: Narrow<TParams> &
    (TParams extends readonly []
      ? never
      : string[] extends TParams
      ? unknown
      : TParams extends string
      ? TParams extends ''
        ? never
        : unknown
      : TParams extends readonly string[]
      ? unknown
      : never),
): ParseAbiParameters<TParams> {
  const abiParameters: AbiParameter[] = []
  if (typeof params === 'string') {
    const parameters = splitParameters(params)
    const length = parameters.length
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter_(parameters[i]!, { modifiers }))
    }
  } else {
    const structs = parseStructs(params as readonly string[])
    const length = params.length
    for (let i = 0; i < length; i++) {
      const signature = (params as readonly string[])[i]!
      if (isStructSignature(signature)) continue
      const parameters = splitParameters(signature)
      const length = parameters.length
      for (let k = 0; k < length; k++) {
        abiParameters.push(
          parseAbiParameter_(parameters[k]!, { modifiers, structs }),
        )
      }
    }
  }

  if (abiParameters.length === 0)
    throw new BaseError('Failed to parse ABI Item.', {
      details: `parseAbiParameters(${JSON.stringify(params, null, 2)})`,
      docsPath: '/todo',
    })
  return abiParameters as ParseAbiParameters<TParams>
}
