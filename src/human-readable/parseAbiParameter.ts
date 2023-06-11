import type { AbiParameter } from '../abi.js'
import { InvalidAbiParameterError } from '../index.js'
import type { Narrow } from '../narrow.js'
import type { Error, Filter, Flatten, IsEmptyObject } from '../types.js'
import { isStructSignature, modifiers } from './runtime/signatures.js'
import { parseStructs } from './runtime/structs.js'
import { parseAbiParameter as parseAbiParameter_ } from './runtime/utils.js'
import type {
  CountStructSignatures,
  IsStructSignature,
  Modifier,
  StructSignature,
  ValidateParameterString,
} from './types/signatures.js'
import type { ParseStructs } from './types/structs.js'
import type { ParseAbiParameter as ParseAbiParameter_ } from './types/utils.js'

/**
 * Validates human-readable ABI parameter string that contains struct signatures.
 * If strict mode is set to true this will also perform type checks on the provided strings.
 * @param TParams - Human-readable ABI parameter with struct signatures
 * @returns[] if all params are valid. Otherwise returns an error message.
 *
 * @example
 * type Result = ValidateAbiParameter<
 *   // ^? type Result = []
 *   ['Baz bar', 'struct Baz { string name; }']
 * >
 */
export type ValidateAbiParameter<TParams extends readonly string[]> = Flatten<
  ParseStructs<TParams> extends infer ParsedStructs extends object
    ? IsEmptyObject<ParsedStructs> extends true
      ? Error<'No Struct signature found. Please provide valid struct signatures.'>
      : CountStructSignatures<TParams> extends Filter<
          TParams,
          StructSignature
        >['length']
      ? {
          [K in keyof TParams]: IsStructSignature<TParams[K]> extends true
            ? never
            : TParams[K] extends `(${string})${string}`
            ? never
            : TParams[K] extends `${string},${string}`
            ? Error<`Invalid Parameter "${TParams[K]}". Please use "parseAbiParameters" for comma seperated strings.`>
            : ValidateParameterString<
                TParams[K],
                keyof ParsedStructs
              > extends infer ValidatedParam
            ? ValidatedParam extends true
              ? never
              : ValidatedParam
            : unknown
        }
      : Error<'Missmatch between struct signatures and arguments. Not all parameter strings will be parsed.'>
    : [unknown]
>
/**
 * Parses human-readable ABI parameter into {@link AbiParameter}
 *
 * @param TParam - Human-readable ABI parameter
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
  TParam extends string | readonly string[] | readonly unknown[],
> =
  | (TParam extends string
      ? TParam extends ''
        ? never
        : string extends TParam
        ? AbiParameter
        : ParseAbiParameter_<TParam, { Modifier: Modifier }>
      : never)
  | (TParam extends readonly string[]
      ? string[] extends TParam
        ? AbiParameter // Return generic AbiParameter item since type was no inferrable
        : ValidateAbiParameter<TParam> extends infer Validated
        ? Validated extends never[]
          ? ParseStructs<TParam> extends infer Structs
            ? {
                [K in keyof TParam]: TParam[K] extends string
                  ? IsStructSignature<TParam[K]> extends true
                    ? never
                    : ParseAbiParameter_<
                        TParam[K],
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
          : never
        : never
      : never)

/**
 * Parses human-readable ABI parameter into {@link AbiParameter}
 *
 * @param param - Human-readable ABI parameter
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
  TParam extends string | readonly string[] | readonly unknown[],
>(
  param: Narrow<TParam> &
    (
      | (TParam extends string
          ? TParam extends ''
            ? Error<'Empty string is not allowed.'>
            : unknown
          : never)
      | (TParam extends readonly string[]
          ? TParam extends readonly [] // empty array
            ? 'Error: At least one parameter required.'
            : string[] extends TParam
            ? unknown
            : ValidateAbiParameter<TParam> extends infer ValidatedParams extends readonly unknown[]
            ? ValidatedParams extends readonly []
              ? unknown
              : ValidatedParams extends string[]
              ? ValidatedParams[number]
              : never
            : never
          : never)
    ),
): ParseAbiParameter<TParam> {
  let abiParameter
  if (typeof param === 'string')
    abiParameter = parseAbiParameter_(param, {
      modifiers,
    }) as ParseAbiParameter<TParam>
  else {
    const structs = parseStructs(param as readonly string[])
    const length = param.length as number
    for (let i = 0; i < length; i++) {
      const signature = (param as readonly string[])[i]!
      if (isStructSignature(signature)) continue
      abiParameter = parseAbiParameter_(signature, { modifiers, structs })
      break
    }
  }

  if (!abiParameter) throw new InvalidAbiParameterError({ param })

  return abiParameter as ParseAbiParameter<TParam>
}
