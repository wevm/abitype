import type { TypedData } from '../abi.js'
import type { Error, IsNever, Pretty } from '../types.js'
import {
  parseTypedData as parseTypedData_,
  resolveTypedData as resolveTypedData_,
} from './runtime/structs.js'
import type {
  ParseTypedData as ParseTypedData_,
  ResolvedTypedData,
  StructSignatures,
} from './types/structs.js'

/**
 * Parses human-readable EIP-712 into JSON {@link TypedData}
 *
 * @param TSignatures - Human-readable EIP-712 signatures
 * @returns Parsed {@link TypedData}
 *
 * @example
 * type Result = ParseTypedData<
 *   // ^? type Result = { Name: [ { type: address, name: foo } ], Foo:...
 *   [
 *     'struct Name {address foo;}',
 *     'struct Foo {Name name;}',
 *   ]
 * >
 */
export type ParseTypedData<
  signatures extends readonly string[],
  resolveTypedData extends boolean = false,
> = string[] extends signatures
  ? TypedData // If `T` was not able to be inferred (e.g. just `string[]`), return `StructLookup`
  : signatures extends readonly string[]
  ? signatures extends StructSignatures<signatures>
    ? ParseTypedData_<signatures, resolveTypedData> extends infer Structs
      ? IsNever<keyof Structs> extends true
        ? never
        : Pretty<Structs>
      : never
    : never
  : never

/**
 * Parses human-readable EIP-712 into JSON {@link TypedData}
 *
 * @param TSignatures - Human-readable EIP-712 signatures
 * @returns Parsed {@link TypedData}
 *
 * @example
 * const Result = parseTypedData(
 *   // ^? type Result = { Name: [ { type: address, name: foo } ], Foo:...
 *   [
 *     'struct Name {address foo;}',
 *     'struct Foo {Name name;}',
 *   ]
 * )
 */
export function parseTypedData<
  const signatures extends readonly string[],
  resolve extends boolean = false,
>(
  signatures: signatures['length'] extends 0
    ? Error<'At least one signature required'>
    : StructSignatures<signatures> extends signatures
    ? signatures
    : StructSignatures<signatures>,
  resolveTypedData?: resolve,
): ParseTypedData<signatures, resolve> {
  const typedData = parseTypedData_(signatures)

  if (resolveTypedData) {
    //Resolve nested structs inside each parameter
    const resolvedStructs: ResolvedTypedData = {}
    const entries = Object.entries(typedData)
    const entriesLength = entries.length
    for (let i = 0; i < entriesLength; i++) {
      const [name, parameters] = entries[i]!
      resolvedStructs[name] = resolveTypedData_(parameters, typedData)
    }

    return resolvedStructs as ParseTypedData<signatures, resolve>
  }

  return typedData as ParseTypedData<signatures, resolve>
}
