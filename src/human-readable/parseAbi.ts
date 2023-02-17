import type { Narrow } from '../narrow'
import type { Filter } from '../types'
import type { Signature, Signatures } from './signatures'
import type { ParseStructs } from './structs'
import type { ParseSignature } from './utils'

export type ParseAbi<T extends string | readonly string[]> = (
  T extends string ? readonly [T] : T extends readonly string[] ? T : never
) extends infer TSignatures extends Signatures<
  TSignatures extends readonly string[] ? TSignatures : never
>
  ? ParseStructs<TSignatures> extends infer Structs
    ? {
        [K in keyof TSignatures]: TSignatures[K] extends infer Signature extends string
          ? ParseSignature<Signature, Structs>
          : never
      } extends infer Mapped extends readonly unknown[]
      ? Filter<Mapped, never>
      : never
    : never
  : T extends string
  ? Signature<T>
  : T extends readonly string[]
  ? Signatures<T> extends infer TSignatures
    ? {
        [K in keyof TSignatures]: TSignatures[K] extends `Error: ${string}`
          ? TSignatures[K]
          : never
      } extends infer Mapped extends readonly unknown[]
      ? Filter<Mapped, never>
      : never
    : never
  : never

export declare function parseAbi<T extends string | readonly string[]>(
  signatures: Narrow<T>,
  // TODO: Get `Narrow<T>` to work with validation below
  // & (T extends string
  //     ? Signature<T>
  //     : T extends readonly string[]
  //     ? Signatures<T>
  //     : T),
): ParseAbi<T>
