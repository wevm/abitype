import type { Abi } from '../abi'
import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import type { Signatures } from './signatures'
import type { ParseStructs } from './structs'
import type { ParseSignature } from './utils'

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

export declare function parseAbi<
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
): ParseAbi<TSignatures>
