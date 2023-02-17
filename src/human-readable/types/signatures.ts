import type { AbiStateMutability } from '../../abi'

type IsName<T extends string> = T extends '' | `${string}${' '}${string}`
  ? false
  : true

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
export type IsFunctionSignature<T> =
  T extends `function ${infer Name}(${string}`
    ? IsName<Name> extends true
      ? T extends ValidFunctionSignatures
        ? true
        : // Check that `Parameters` is not absorbing other types
        T extends `function ${string}(${infer Parameters})`
        ? Parameters extends InvalidFunctionParameters // `InvalidParameters` is not exhaustive - no regex in TypeScript :(
          ? false
          : true
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
  | `function ${string}(${string}) ${Scope} ${AbiStateMutability}`
  | `function ${string}(${string}) ${Scope} ${AbiStateMutability} ${Returns}`
type MangledReturns =
  | `r${string}eturns`
  | `re${string}turns`
  | `ret${string}urns`
  | `retu${string}rns`
  | `retur${string}ns`
  | `return${string}s`
type InvalidFunctionParameters =
  | `${string}${'returns' | MangledReturns} (${string}`
  | `${string}) ${'returns' | MangledReturns}${string}`
  | `${string})${string}${'returns' | MangledReturns}${string}(${string}`

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
export type FallbackSignature = 'fallback()'
export type ReceiveSignature = 'receive() external payable'

export type IsSignature<T extends string> =
  | (IsErrorSignature<T> extends true ? true : never)
  | (IsEventSignature<T> extends true ? true : never)
  | (IsFunctionSignature<T> extends true ? true : never)
  | (IsStructSignature<T> extends true ? true : never)
  | (T extends ConstructorSignature ? true : never)
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
  : `Error: Signature "${T}" is invalid${K extends string
      ? ` at position ${K}`
      : ''}`

export type Signatures<T extends readonly string[]> = {
  [K in keyof T]: Signature<T[K], K>
}

export type Modifier = 'calldata' | 'indexed' | 'memory' | 'storage'
export type FunctionModifiers = Exclude<Modifier, 'indexed'>
export type EventModifiers = Extract<Modifier, 'indexed'>
