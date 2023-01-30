export type WS = ' '

/**
 * Trim all whitespaces on the right side of a string
 *
 * @param S - String to trim
 * @returns Trimmed string to the right side {@link S}
 *
 * @example
 * type Result = TrimLeft<"Hello     ">
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
 * type Result = TrimLeft<"    Hello">
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

export type AbiTypes = 'function' | 'event' | 'error'

export type AbiIndexed = ' indexed '

export type AbiMutability = 'view' | 'pure' | 'payable' | 'nonpayable'

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
type Pop<T extends any[]> = T extends [...infer R, any] ? R : []

/**
 * Splits a string for every `,` value in it in the expection it has nested values e.g `(${string})`
 *
 * @param T - string to split
 * @returns Array with the splited string {@link T}
 *
 * @example
 * type Result = SplitNesting<'address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId'>
 * //    ^? ["address owner","(bool loading, (string[][] names) cats)[] dog","uint tokenId"]
 */
// Adapted from "https://github.com/ethers-io/ethers.js/blob/bf0b468490cb293cd916e4fff06e0909273719e6/packages/abi/src.ts/fragments.ts#L1043"
export type SplitNesting<
  T extends string,
  TResult extends any[] = [],
  TStr extends string = '',
  Depth extends any[] = [],
> = T extends ''
  ? [...TResult, Trim<TStr>]
  : Depth['length'] extends 0
  ? T extends `${infer Char}${infer Rest}`
    ? Char extends ','
      ? SplitNesting<Rest, [...TResult, Trim<TStr>], ''>
      : Char extends '('
      ? SplitNesting<Rest, TResult, `${TStr}${Char}`, [...Depth, 1]>
      : SplitNesting<Rest, TResult, `${TStr}${Char}`>
    : []
  : T extends `${infer Char}${infer Rest}`
  ? Char extends '('
    ? SplitNesting<Rest, TResult, `${TStr}${Char}`, [...Depth, 1]>
    : Char extends ')'
    ? SplitNesting<Rest, TResult, `${TStr}${Char}`, Pop<Depth>>
    : SplitNesting<Rest, TResult, `${TStr}${Char}`, Depth>
  : []

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
