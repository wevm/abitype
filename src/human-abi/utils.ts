import type { AbiType, SolidityArrayWithTuple, SolidityTuple } from '../abi'

export type WS = ' '

/**
 * Trim all whitespaces on the right side of a string
 *
 * @param S - String to trim
 * @returns Trimmed string to the right side {@link S}
 *
 * @example
 * type Result = TrimLeft<"    Hello">
 * //    ^? "Hello"
 */
export type TrimLeft<S extends string> = S extends `${WS}${infer L}`
  ? TrimLeft<L>
  : S

/**
 * Trim all whitespaces on the left side of a string
 *
 * @param S - String to trim
 * @returns Trimmed string to the left side {@link S}
 *
 * @example
 * type Result = TrimRight<"Hello   ">
 * //    ^? "Hello"
 */

export type TrimRight<S extends string> = S extends `${infer R}${WS}`
  ? TrimRight<R>
  : S

/**
 * Trim all whitespaces on the right and left side of a string
 *
 * @param S - String to trim
 * @returns Trimmed string from both right and left sides {@link S}
 *
 * @example
 * type Result = Trim<"     Hello     ">
 * //    ^? "Hello"
 */
export type Trim<S extends string> = TrimLeft<TrimRight<S>>

// Convert uint string to proper representation of uint256
export type SolidityType<T extends string> = T extends 'uint' ? 'uint256' : T

/**
 * All types of methods in the abi spec
 */
export type AbiTypes = 'function' | 'event' | 'error'

/**
 * Indexed argument helper
 */
//export type AbiIndexed = ' indexed '
export type Modifier = 'calldata' | 'indexed' | 'memory' | 'storage'

/**
 * All types of mutability on function types
 */
export type AbiMutability = 'view' | 'pure' | 'payable' | 'nonpayable'

/**
 * All of the Solidity types excluding tuple types
 */
export type UnnamedArgs = Exclude<
  AbiType,
  SolidityTuple | SolidityArrayWithTuple
>

/**
 * Tuple type values
 */
export type TupleValue = `(${string})${string}`

/**
 * All possible abi argument values. Excluding tuples
 */
export type AbiArgs =
  | UnnamedArgs
  | ''
  | 'void'
  | `${string}${Modifier}${string}`
  | `${string}${WS}${string}`
/**
 * Array of all possible abi argument values. Excluding tuples
 */
export type AbiArgsType = readonly AbiArgs[]

/**
 * All possible abi argument values.
 */
export type AbiArgsWithTuple = AbiArgs | TupleValue

/**
 * Array of all possible abi argument values.
 */
export type AbiArgsTypeWithTuple = readonly AbiArgsWithTuple[]

/**
 * Check if the a string has any "()". This is used after {@link ExtractArgs}
 *
 * @param T - String to check
 * @returns True if it matches {@link T}
 *
 * @example
 * type Result = hasTupleValue<"address owner, (uint tokenId)[] id">
 * //    ^? "true"
 */
export type hasTupleValue<T extends string> =
  T extends `${string}(${string})${string}` ? true : false

/**
 * Check if the a string has any "()" at the start of the string. This is used after {@link ExtractArgs}
 *
 * @param T - String to check
 * @returns True if it matches {@link T}
 *
 * @example
 * type Result = isTupleValue<"(uint tokenId)[] id">
 * //    ^? "true"
 */
export type isTupleValue<T extends string> = T extends `(${string})${string}`
  ? true
  : false

/**
 * Removes instance of a word from a given string
 *
 * @param T - Target string
 * @param K - Value to remove
 * @returns String without the {@link K} value in it {@link T}
 *
 * @example
 * type Result = Remove<"HelloWorld", "World">
 * //    ^? "Hello"
 */
export type Remove<
  T,
  K extends string,
> = T extends `${infer Head}${K}${infer Tail}` ? `${Head}${Tail}` : T

/**
 * Replaces all instances of a word on a given string with the new values
 *
 * @param S - String to trim
 * @param From - Word to remove
 * @param To - Word to replace with
 * @returns new string with all the replaced values {@link S}
 *
 * @example
 * type Result = <"foobarbar", "bar", "foo">
 * //    ^? "foofoofoo"
 */
export type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = From extends ''
  ? S
  : S extends `${infer Prefix}${From}${infer Suffix}`
  ? `${ReplaceAll<Prefix, From, To>}${To}${ReplaceAll<Suffix, From, To>}`
  : S

/**
 * Removes the last element of an array
 *
 * @param T - Any array value
 * @returns Array without the last element of it {@link T}
 *
 * @example
 * type Result = Pop<[1,2,3]>
 * //    ^? "[1,2]"
 */
export type Pop<T extends any[]> = T extends [...infer R, any] ? R : []

/**
 * Re-order an array to ensure that strings that match `(${string})${string}` are the last element
 *
 * @param T - Array of strings
 * @returns Order array according to the specs above {@link T}
 *
 * @example
 * type Result = ReOrderArray<["address owner", "(bool loading, (string[][] names) cats)[] dog", "uint tokenId"]>
 * //    ^? ["address owner","uint tokenId","(bool loading, (string[][] names) cats)[] dog"]
 */
export type ReOrderArray<
  T extends string[],
  TRemain extends any[] = [],
> = T extends ['']
  ? []
  : T extends [infer Head extends string, ...infer Rest extends string[]]
  ? Head extends `(${string})${string}`
    ? [...TRemain, ...Rest, Head]
    : ReOrderArray<Rest, [...TRemain, Head]>
  : TRemain

/**
 * Splits a string by a given seperator.
 *
 * @param S - String to split
 * @param SEP - String seperator
 * @returns Array of splited string {@link S}
 *
 * @example
 * type Result = Split<"Hello", "e">
 * //    ^? "["H", "ello"]"
 */
export type Split<S extends string, SEP extends string> = string extends S
  ? string[]
  : S extends `${infer R}${SEP}${infer L}`
  ? [Trim<R>, ...Split<L, SEP>]
  : S extends `${SEP}`
  ? []
  : [Trim<S>]

/**
 * Removes the last element of an array of it is empty.
 *
 * @param T - Any array value
 * @returns Array without the last element of it {@link T}
 *
 * @example
 * type Result = PopLastIfEmpty<[1,2,3]>
 * //    ^? "[1,2,3]"
 * type Result = PopLastIfEmpty<["1", "2", ""]>
 * //    ^? "[1,2]"
 */
export type PopLastIfEmpty<T extends any[]> = T extends [
  ...infer Head extends any[],
  infer L,
]
  ? L extends ''
    ? Head
    : T
  : never

/**
 * Checks where a given value is of type unknown
 *
 * @param T - Any value
 * @returns true if unknown or false if not {@link T}
 *
 * @example
 * type Result = isUnknown<"Hello">
 * //    ^? false
 */
export type isUnknown<T> = unknown extends T ? true : false

export type DeepReadonly<T> = {
  readonly [P in keyof T]: keyof T[P] extends never ? T[P] : DeepReadonly<T[P]>
}
