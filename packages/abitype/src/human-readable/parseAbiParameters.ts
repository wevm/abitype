import { type AbiParameter } from '../abi.js'
import { type Narrow } from '../narrow.js'
import { type Error, type Filter } from '../types.js'
import { InvalidAbiParametersError } from './errors/abiParameter.js'
import { isStructSignature, modifiers } from './runtime/signatures.js'
import { parseStructs } from './runtime/structs.js'
import { splitParameters } from './runtime/utils.js'
import { parseAbiParameter as parseAbiParameter_ } from './runtime/utils.js'
import { type IsStructSignature, type Modifier } from './types/signatures.js'
import { type ParseStructs } from './types/structs.js'
import { type SplitParameters } from './types/utils.js'
import { type ParseAbiParameters as ParseAbiParameters_ } from './types/utils.js'

/**
 * Parses human-readable ABI parameters into {@link AbiParameter}s
 *
 * @param params - Human-readable ABI parameters
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
  params extends string | readonly string[] | readonly unknown[],
> =
  | (params extends string
      ? params extends ''
        ? never
        : string extends params
        ? readonly AbiParameter[]
        : ParseAbiParameters_<SplitParameters<params>, { Modifier: Modifier }>
      : never)
  | (params extends readonly string[]
      ? string[] extends params
        ? AbiParameter // Return generic AbiParameter item since type was no inferrable
        : ParseStructs<params> extends infer structs
        ? {
            [K in keyof params]: params[K] extends string
              ? IsStructSignature<params[K]> extends true
                ? never
                : ParseAbiParameters_<
                    SplitParameters<params[K]>,
                    { Modifier: Modifier; Structs: structs }
                  >
              : never
          } extends infer mapped extends readonly unknown[]
          ? Filter<mapped, never>[0] extends infer result
            ? result extends undefined
              ? never
              : result
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
  params extends string | readonly string[] | readonly unknown[],
>(
  params: Narrow<params> &
    (
      | (params extends string
          ? params extends ''
            ? Error<'Empty string is not allowed.'>
            : unknown
          : never)
      | (params extends readonly string[]
          ? params extends readonly [] // empty array
            ? Error<'At least one parameter required.'>
            : string[] extends params
            ? unknown
            : unknown // TODO: Validate param string
          : never)
    ),
): ParseAbiParameters<params> {
  const abiParameters: AbiParameter[] = []
  if (typeof params === 'string') {
    const parameters = splitParameters(params)
    const length = parameters.length
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter_(parameters[i]!, { modifiers }))
    }
  } else {
    const structs = parseStructs(params as readonly string[])
    const length = params.length as number
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
    throw new InvalidAbiParametersError({ params })

  return abiParameters as ParseAbiParameters<params>
}
