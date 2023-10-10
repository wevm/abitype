import type { AbiStateMutability } from '../../abi.js'
import type { Error } from '../../types.js'

export type ErrorSignature<
  TName extends string = string,
  TParameters extends string = string,
> = `error ${TName}(${TParameters})`
export type IsErrorSignature<T extends string> = T extends ErrorSignature<
  infer Name
>
  ? IsName<Name>
  : false
export type EventSignature<
  TName extends string = string,
  TParameters extends string = string,
> = `event ${TName}(${TParameters})`
export type IsEventSignature<T extends string> = T extends EventSignature<
  infer Name
>
  ? IsName<Name>
  : false

export type FunctionSignature<
  TName extends string = string,
  TTail extends string = string,
> = `function ${TName}(${TTail}`
export type IsFunctionSignature<T> = T extends FunctionSignature<infer Name>
  ? IsName<Name> extends true
    ? T extends ValidFunctionSignatures
      ? true
      : // Check that `Parameters` is not absorbing other types (e.g. `returns`)
      T extends `function ${string}(${infer Parameters})`
      ? Parameters extends InvalidFunctionParameters
        ? false
        : true
      : false
    : false
  : false
export type Scope = 'public' | 'external' // `internal` or `private` functions wouldn't make it to ABI so can ignore
type Returns = `returns (${string})` | `returns(${string})`
// Almost all valid function signatures, except `function ${string}(${infer Parameters})` since `Parameters` can absorb returns
type ValidFunctionSignatures =
  | `function ${string}()`
  // basic
  | `function ${string}() ${Returns}`
  | `function ${string}() ${AbiStateMutability}`
  | `function ${string}() ${Scope}`
  // combinations
  | `function ${string}() ${AbiStateMutability} ${Returns}`
  | `function ${string}() ${Scope} ${Returns}`
  | `function ${string}() ${Scope} ${AbiStateMutability}`
  | `function ${string}() ${Scope} ${AbiStateMutability} ${Returns}`
  // Parameters
  | `function ${string}(${string}) ${Returns}`
  | `function ${string}(${string}) ${AbiStateMutability}`
  | `function ${string}(${string}) ${Scope}`
  | `function ${string}(${string}) ${AbiStateMutability} ${Returns}`
  | `function ${string}(${string}) ${Scope} ${Returns}`
  | `function ${string}(${string}) ${Scope} ${AbiStateMutability}`
  | `function ${string}(${string}) ${Scope} ${AbiStateMutability} ${Returns}`

export type StructSignature<
  TName extends string = string,
  TProperties extends string = string,
> = `struct ${TName} {${TProperties}}`
export type IsStructSignature<T extends string> = T extends StructSignature<
  infer Name
>
  ? IsName<Name>
  : false

type ConstructorSignature<TTail extends string = string> =
  `constructor(${TTail}`
export type IsConstructorSignature<T> = T extends ConstructorSignature
  ? T extends ValidConstructorSignatures
    ? true
    : false
  : false
type ValidConstructorSignatures =
  | `constructor(${string})`
  | `constructor(${string}) payable`

export type FallbackSignature<
  TAbiStateMutability extends '' | ' payable' = '',
> = `fallback() external${TAbiStateMutability}`

export type ReceiveSignature = 'receive() external payable'

// TODO: Maybe use this for signature validation one day
// https://twitter.com/devanshj__/status/1610423724708343808
export type IsSignature<T extends string> =
  | (IsErrorSignature<T> extends true ? true : never)
  | (IsEventSignature<T> extends true ? true : never)
  | (IsFunctionSignature<T> extends true ? true : never)
  | (IsStructSignature<T> extends true ? true : never)
  | (IsConstructorSignature<T> extends true ? true : never)
  | (T extends FallbackSignature ? true : never)
  | (T extends ReceiveSignature ? true : never) extends infer Condition
  ? [Condition] extends [never]
    ? false
    : true
  : false

export type Signature<
  T extends string,
  K extends string | unknown = unknown,
> = IsSignature<T> extends true
  ? T
  : string extends T // if exactly `string` (not narrowed), then pass through as valid
  ? T
  : Error<`Signature "${T}" is invalid${K extends string
      ? ` at position ${K}`
      : ''}.`>

export type Signatures<T extends readonly string[]> = {
  [K in keyof T]: Signature<T[K], K>
}

export type Modifier = 'calldata' | 'indexed' | 'memory' | 'storage'
export type FunctionModifier = Extract<
  Modifier,
  'calldata' | 'memory' | 'storage'
>
export type EventModifier = Extract<Modifier, 'indexed'>

export type IsName<TName extends string> = TName extends ''
  ? false
  : ValidateName<TName> extends TName
  ? true
  : false

export type AssertName<TName extends string> =
  ValidateName<TName> extends infer InvalidName extends string[]
    ? `[${InvalidName[number]}]`
    : TName

export type ValidateName<
  TName extends string,
  CheckCharacters extends boolean = false,
> = TName extends `${string}${' '}${string}`
  ? Error<`Identifier "${TName}" cannot contain whitespace.`>
  : IsSolidityKeyword<TName> extends true
  ? Error<`"${TName}" is a protected Solidity keyword.`>
  : TName extends `${number}`
  ? Error<`Identifier "${TName}" cannot be a number string.`>
  : TName extends `${number}${string}`
  ? Error<`Identifier "${TName}" cannot start with a number.`>
  : CheckCharacters extends true
  ? IsValidCharacter<TName> extends true
    ? TName
    : Error<`"${TName}" contains invalid character.`>
  : TName

export type IsSolidityKeyword<T extends string> = T extends SolidityKeywords
  ? true
  : false

export type SolidityKeywords =
  | 'after'
  | 'alias'
  | 'anonymous'
  | 'apply'
  | 'auto'
  | 'byte'
  | 'calldata'
  | 'case'
  | 'catch'
  | 'constant'
  | 'copyof'
  | 'default'
  | 'defined'
  | 'error'
  | 'event'
  | 'external'
  | 'false'
  | 'final'
  | 'function'
  | 'immutable'
  | 'implements'
  | 'in'
  | 'indexed'
  | 'inline'
  | 'internal'
  | 'let'
  | 'mapping'
  | 'match'
  | 'memory'
  | 'mutable'
  | 'null'
  | 'of'
  | 'override'
  | 'partial'
  | 'private'
  | 'promise'
  | 'public'
  | 'pure'
  | 'reference'
  | 'relocatable'
  | 'return'
  | 'returns'
  | 'sizeof'
  | 'static'
  | 'storage'
  | 'struct'
  | 'super'
  | 'supports'
  | 'switch'
  | 'this'
  | 'true'
  | 'try'
  | 'typedef'
  | 'typeof'
  | 'var'
  | 'view'
  | 'virtual'
  | `address${`[${string}]` | ''}`
  | `bool${`[${string}]` | ''}`
  | `string${`[${string}]` | ''}`
  | `tuple${`[${string}]` | ''}`
  | `bytes${number | ''}${`[${string}]` | ''}`
  | `${'u' | ''}int${number | ''}${`[${string}]` | ''}`

export type IsValidCharacter<T extends string> =
  T extends `${ValidCharacters}${infer Tail}`
    ? Tail extends ''
      ? true
      : IsValidCharacter<Tail>
    : false

// biome-ignore format: no formatting
type ValidCharacters =
  // uppercase letters
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
  // lowercase letters
  | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
  // numbers
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  // special characters
  | '_' | '$'

// Template string inference can absorb `returns`:
// type Result = `function foo(string) return s (uint256)` extends `function ${string}(${infer Parameters})` ? Parameters : never
// //   ^? type Result = "string ) return s (uint256"
// So we need to validate against `returns` keyword with all combinations of whitespace
type InvalidFunctionParameters =
  | `${string}${MangledReturns} (${string}`
  | `${string}) ${MangledReturns}${string}`
  | `${string})${string}${MangledReturns}${string}(${string}`
// r_e_t_u_r_n_s
type MangledReturns =
  // Single
  | `r${string}eturns`
  | `re${string}turns`
  | `ret${string}urns`
  | `retu${string}rns`
  | `retur${string}ns`
  | `return${string}s`
  // Double
  // `r_e*`
  | `r${string}e${string}turns`
  | `r${string}et${string}urns`
  | `r${string}etu${string}rns`
  | `r${string}etur${string}ns`
  | `r${string}eturn${string}s`
  // `re_t*`
  | `re${string}t${string}urns`
  | `re${string}tu${string}rns`
  | `re${string}tur${string}ns`
  | `re${string}turn${string}s`
  // `ret_u*`
  | `ret${string}u${string}rns`
  | `ret${string}ur${string}ns`
  | `ret${string}urn${string}s`
  // `retu_r*`
  | `retu${string}r${string}ns`
  | `retu${string}rn${string}s`
  // `retur_n*`
  | `retur${string}n${string}s`
  // Triple
  // `r_e_t*`
  | `r${string}e${string}t${string}urns`
  | `r${string}e${string}tu${string}rns`
  | `r${string}e${string}tur${string}ns`
  | `r${string}e${string}turn${string}s`
  // `re_t_u*`
  | `re${string}t${string}u${string}rns`
  | `re${string}t${string}ur${string}ns`
  | `re${string}t${string}urn${string}s`
  // `ret_u_r*`
  | `ret${string}u${string}r${string}ns`
  | `ret${string}u${string}rn${string}s`
  // `retu_r_n*`
  | `retu${string}r${string}n${string}s`
  // Quadruple
  // `r_e_t_u*`
  | `r${string}e${string}t${string}u${string}rns`
  | `r${string}e${string}t${string}ur${string}ns`
  | `r${string}e${string}t${string}urn${string}s`
  // `re_t_u_r*`
  | `re${string}t${string}u${string}r${string}ns`
  | `re${string}t${string}u${string}rn${string}s`
  // `ret_u_r_n*`
  | `ret${string}u${string}r${string}n${string}s`
  // Quintuple
  // `r_e_t_u_r*`
  | `r${string}e${string}t${string}u${string}r${string}ns`
  | `r${string}e${string}t${string}u${string}rn${string}s`
  // `re_t_u_r_n*`
  | `re${string}t${string}u${string}r${string}n${string}s`
  // Sextuple
  // `r_e_t_u_r_n_s`
  | `r${string}e${string}t${string}u${string}r${string}n${string}s`
