import type {
  AbiStateMutability,
  AbiType,
  SolidityAddress,
  SolidityBool,
  SolidityBytes,
  SolidityFunction,
  SolidityInt,
} from '../../abi'
import type { Error, Trim } from '../../types'

export type Lexer<T extends string> =
  T extends `${infer Char extends string}${infer Rest extends string}`
    ? Char extends SolidityLexer
      ? Rest extends ''
        ? true
        : Lexer<Rest>
      : false
    : never

// Could possibly make this stricter
export type ValidateContext<
  T extends string,
  TContext extends 'function' | 'event' | 'error',
> = TContext extends 'function'
  ? T extends
      | `${string} ${EventModifier} ${string}`
      | `${string} ${EventModifier}`
    ? false
    : T extends
        | `(${string}) ${EventModifier} ${string}`
        | `(${string}) ${EventModifier}`
    ? false
    : T extends
        | `${infer Head extends string} ${FunctionModifier} ${string}`
        | `${infer Head extends string} ${FunctionModifier}`
    ? Head extends `${string}[${string}]`
      ? true
      : Head extends
          | Exclude<SolidityBytes, 'bytes'>
          | SolidityAddress
          | SolidityBool
          | SolidityFunction
          | SolidityInt
      ? false
      : true
    : true
  : TContext extends 'event'
  ? T extends
      | `${string} ${FunctionModifier} ${string}`
      | `${string} ${FunctionModifier}`
    ? false
    : T extends
        | `(${string}) ${FunctionModifier} ${string}`
        | `(${string}) ${FunctionModifier}`
    ? false
    : true
  : T extends `${string} ${Modifier} ${string}` | `${string} ${Modifier}`
  ? false
  : T extends `(${string}) ${Modifier} ${string}` | `(${string}) ${Modifier}`
  ? false
  : true

type isValidSignatureProperty<
  TProperty extends string,
  TContext extends 'function' | 'event' | 'error' = 'function',
> = TProperty extends `${infer Head extends string},${infer Tail}`
  ? ValidateContext<Head, TContext> extends true
    ? Tail extends ''
      ? // TODO: throw types
        false // `Error: Property '${TProperty}' cannot end with a comma`
      : isValidSignatureProperty<Trim<Tail>, TContext>
    : false
  : TProperty extends `${infer Body extends string}`
  ? ValidateContext<Body, TContext> extends true
    ? true
    : false
  : false

export type IsName<T extends string> = T extends '' | `${string}${' '}${string}`
  ? false
  : Lexer<T> extends true
  ? isProtectedKeyword<T> extends true
    ? false
    : T extends AbiType
    ? false
    : true
  : false

export type ErrorSignature<
  TName extends string = string,
  TParameters extends string = string,
> = `error ${TName}(${TParameters})`
export type IsErrorSignature<T extends string> = T extends ErrorSignature<
  infer Name,
  infer Property
>
  ? IsName<Name> extends true
    ? isValidSignatureProperty<Trim<Property>, 'error'>
    : false
  : false

export type EventSignature<
  TName extends string = string,
  TParameters extends string = string,
> = `event ${TName}(${TParameters})`
export type IsEventSignature<T extends string> = T extends EventSignature<
  infer Name,
  infer Property
>
  ? IsName<Name> extends true
    ? isValidSignatureProperty<Trim<Property>, 'event'>
    : false
  : false

export type FunctionSignature<
  TName extends string = string,
  TTail extends string = string,
> = `function ${TName}(${TTail}`

export type IsFunctionSignature<T> =
  T extends `function ${infer Name}(${string}`
    ? IsName<Name> extends true
      ? T extends ValidFunctionSignatures
        ? T extends `${string}returns (${infer ReturnParams})`
          ? isValidSignatureProperty<Trim<ReturnParams>>
          : true
        : // Check that `Parameters` is not absorbing other types (e.g. `returns`)
        T extends `function ${string}(${infer Parameters})`
        ? Parameters extends InvalidFunctionParameters
          ? false
          : isValidSignatureProperty<Trim<Parameters>>
        : false
      : false
    : false

export type Scope = 'public' | 'external' // `internal` or `private` functions wouldn't make it to ABI so can ignore
type Returns = `returns (${string})`
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

export type ConstructorSignature<TParameters extends string = string> =
  `constructor(${TParameters})`
export type isConstructorSignature<T extends string> =
  T extends ConstructorSignature<infer Property>
    ? isValidSignatureProperty<Trim<Property>>
    : false

export type FallbackSignature = 'fallback()'
export type ReceiveSignature = 'receive() external payable'

// TODO: Maybe use this for signature validation one day
// https://twitter.com/devanshj__/status/1610423724708343808
export type IsSignature<T extends string> =
  | (IsErrorSignature<T> extends true ? true : never)
  | (IsEventSignature<T> extends true ? true : never)
  | (IsFunctionSignature<T> extends true ? true : never)
  | (IsStructSignature<T> extends true ? true : never)
  | (isConstructorSignature<T> extends true ? true : never)
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

// Template string inference can abosrb `returns`:
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

export type isProtectedKeyword<T extends string> =
  Trim<T> extends infer Trimmed_
    ? Trimmed_ extends ProtectedKeywords
      ? ProtectedKeywords extends Trimmed_
        ? // TODO: throw types
          false
        : true
      : false
    : // TODO: throw types
      false

export type ProtectedKeywords =
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
// No regex so we do it manually
type SolidityLexer =
  | `${'a' | 'A'}`
  | `${'b' | 'B'}`
  | `${'c' | 'C'}`
  | `${'d' | 'D'}`
  | `${'e' | 'E'}`
  | `${'f' | 'F'}`
  | `${'g' | 'G'}`
  | `${'h' | 'H'}`
  | `${'i' | 'I'}`
  | `${'j' | 'J'}`
  | `${'k' | 'K'}`
  | `${'l' | 'L'}`
  | `${'m' | 'M'}`
  | `${'n' | 'N'}`
  | `${'o' | 'O'}`
  | `${'p' | 'P'}`
  | `${'q' | 'Q'}`
  | `${'r' | 'R'}`
  | `${'s' | 'S'}`
  | `${'t' | 'T'}`
  | `${'u' | 'U'}`
  | `${'v' | 'V'}`
  | `${'w' | 'W'}`
  | `${'x' | 'X'}`
  | `${'y' | 'Y'}`
  | `${'z' | 'Z'}`
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '_'
