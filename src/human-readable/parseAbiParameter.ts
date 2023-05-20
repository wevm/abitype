import type { AbiParameter } from '../abi.js'
import type { Narrow } from '../narrow.js'
import type { Error, Filter, Flatten, IsEmptyObject } from '../types.js'
import { InvalidAbiParameterError } from './errors/index.js'
import {
  isStructSignature,
  modifiers,
  parseAbiParameter as parseAbiParameter_,
  parseStructs,
} from './runtime/index.js'
import type {
  IsStructSignature,
  Modifier,
  ParseAbiParameter as ParseAbiParameter_,
  ParseStructs,
} from './types/index.js'
import type {
  CountStructSignatures,
  StructSignature,
  ValidateParameterString,
} from './types/signatures.js'

export type ValidateAbiParameter<TParams extends readonly string[]> =
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
            ? Error<`Invalid Parameter "${TParams[K]}". Please use parseAbiParameters for comma seperated strings.`>
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
    : unknown

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
            ? ValidatedParams extends never[]
              ? unknown
              : Flatten<ValidatedParams> extends infer Flattened
              ? Flattened extends string[]
                ? Flattened[number]
                : never
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
