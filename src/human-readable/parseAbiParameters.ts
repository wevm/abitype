import type { AbiParameter } from '../abi.js'
import type { Narrow } from '../narrow.js'
import type { Error, Filter, Flatten, IsEmptyObject } from '../types.js'
import { InvalidAbiParametersError } from './errors/index.js'
import {
  isStructSignature,
  modifiers,
  parseAbiParameter as parseAbiParameter_,
  parseStructs,
  splitParameters,
} from './runtime/index.js'
import type {
  IsStructSignature,
  Modifier,
  ParseAbiParameters as ParseAbiParameters_,
  ParseStructs,
  SplitParameters,
} from './types/index.js'
import type {
  CountStructSignatures,
  StructSignature,
  ValidateParameterString,
} from './types/signatures.js'

export type ValidateAbiParameters<TParams extends readonly string[]> =
  ParseStructs<TParams> extends infer ParsedStructs extends object
    ? IsEmptyObject<ParsedStructs> extends true
      ? Error<'No Struct signature found. Please provide valid struct signatures.'>
      : CountStructSignatures<TParams> extends Filter<
          TParams,
          StructSignature
        >['length']
      ? {
          [K in keyof TParams]: SplitParameters<
            TParams[K]
          > extends infer Splited extends string[]
            ? {
                [K2 in keyof Splited]: IsStructSignature<
                  Splited[K2]
                > extends true
                  ? never
                  : Splited[K2] extends `(${string})${string}`
                  ? never
                  : ValidateParameterString<
                      Splited[K2],
                      keyof ParsedStructs
                    > extends infer ValidatedParam
                  ? ValidatedParam extends true
                    ? never
                    : ValidatedParam
                  : unknown
              }
            : unknown
        }
      : Error<'Missmatch between struct signatures and arguments. Not all parameter strings will be parsed.'>
    : unknown
// export type ValidateAbiParameters<T extends readonly string[]> =
//   ParseStructs<T> extends infer Structs extends object
//     ? IsEmptyObject<Structs> extends true
//       ? Error<'No Struct signature found. Please provide valid struct signatures.'>
//       : ParseAbiParameters<T> extends infer ParsedParams extends readonly unknown[]
//       ? Flatten<ExtractAbiParseErrors<ParsedParams>>
//       : never
//     : never
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
        : string extends TParams
        ? readonly AbiParameter[]
        : ParseAbiParameters_<SplitParameters<TParams>, { Modifier: Modifier }>
      : never)
  | (TParams extends readonly string[]
      ? string[] extends TParams
        ? AbiParameter // Return generic AbiParameter item since type was no inferrable
        : ParseStructs<TParams> extends infer Structs
        ? {
            [K in keyof TParams]: TParams[K] extends string
              ? IsStructSignature<TParams[K]> extends true
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
    (
      | (TParams extends string
          ? TParams extends ''
            ? Error<'Empty string is not allowed.'>
            : unknown
          : never)
      | (TParams extends readonly string[]
          ? TParams extends readonly [] // empty array
            ? Error<'At least one parameter required.'>
            : string[] extends TParams
            ? unknown
            : ValidateAbiParameters<TParams> extends infer Parsed extends readonly unknown[]
            ? Flatten<Parsed> extends infer Flattened
              ? Flattened extends readonly []
                ? unknown
                : Flattened extends readonly string[]
                ? Flattened[number]
                : never
              : never
            : never
          : never)
    ),
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

  return abiParameters as ParseAbiParameters<TParams>
}
