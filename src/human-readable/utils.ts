import type { Trim } from '../types'
import type {
  ConstructorSignature,
  FallbackSignature,
  IsErrorSignature,
  IsEventSignature,
  IsFunctionSignature,
  ReceiveSignature,
  Signatures,
} from './signatures'
import type { ParseStructs } from './structs'

export type ParseAbi<
  TSignatures extends Signatures<
    TSignatures extends readonly string[] ? TSignatures : never
  >,
> = TSignatures extends infer Validated extends Signatures<
  Validated extends readonly string[] ? Validated : never
>
  ? ParseStructs<Validated> extends infer Structs
    ? {
        [K in keyof Validated]: Validated[K] extends infer Signature extends string
          ? ParseSignature<Signature, Structs>
          : never
      }
    : never
  : never

export declare function parseAbi<
  TSignatures extends Signatures<
    TSignatures extends readonly string[] ? TSignatures : never
  >,
  // TODO: Add `Narrow<TSignatures>` support
>(signatures: TSignatures): ParseAbi<TSignatures>

// 1. Get params from signature (e.g. `function foo(uint256, uint256)` -> `uint256, uint256`)
// 2. Parse params into array (e.g. `uint256, uint256` -> `['uint256', 'uint256']`)
// 3. Convert each param string to basic abi parameter (e.g. `uint256` -> `{ type: 'uint256' }`)
// 3a. If inline tuple repeat steps 1-3
// Other: Handle `void` param (review other PR), remove unused utility types

export type ParseSignature<
  TSignature extends string,
  TStructs extends StructLookup | unknown = unknown,
> =
  | (IsErrorSignature<TSignature> extends true
      ? {
          type: 'error'
        }
      : never)
  | (IsEventSignature<TSignature> extends true
      ? {
          type: 'event'
        }
      : never)
  | (IsFunctionSignature<TSignature> extends true
      ? {
          type: 'function'
        }
      : never)
  | (TSignature extends ConstructorSignature
      ? {
          type: 'constructor'
        }
      : never)
  | (TSignature extends FallbackSignature
      ? {
          type: 'fallback'
        }
      : never)
  | (TSignature extends ReceiveSignature
      ? {
          type: 'receive'
          stateMutability: 'payable'
        }
      : never)

export type ParseParams<
  T extends string,
  Result extends unknown[] = [],
  Current extends string = '',
  Depth extends ReadonlyArray<number> = [],
> = T extends ''
  ? [...Result, Trim<Current>]
  : Depth['length'] extends 0
  ? T extends `${infer Head}${infer Tail}`
    ? Head extends ','
      ? ParseParams<Tail, [...Result, Trim<Current>], ''>
      : Head extends '('
      ? ParseParams<Tail, Result, `${Current}${Head}`, [...Depth, 1]>
      : ParseParams<Tail, Result, `${Current}${Head}`>
    : []
  : T extends `${infer Char}${infer Rest}`
  ? Char extends '('
    ? ParseParams<Rest, Result, `${Current}${Char}`, [...Depth, 1]>
    : Char extends ')'
    ? ParseParams<Rest, Result, `${Current}${Char}`, Pop<Depth>>
    : ParseParams<Rest, Result, `${Current}${Char}`, Depth>
  : []
type Pop<T extends ReadonlyArray<number>> = T extends [...infer R, any] ? R : []

export type ParseAbiParameter<
  T extends string,
  TStructs extends StructLookup | unknown = unknown, // TODO: Resolve structs
> = T extends `(${string})${string}`
  ? { type: 'TODO: tuple' }
  : T extends `${infer Type} indexed ${infer Name}`
  ? { type: Trim<Type>; name: Trim<Name>; indexed: true }
  : T extends `${infer Type} ${infer Name}`
  ? { type: Trim<Type>; name: Trim<Name> }
  : T extends `${infer Type}`
  ? { type: Type }
  : never
