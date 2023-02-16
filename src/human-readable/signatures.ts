import type { AbiStateMutability } from '../abi'

type IsName<T extends string> = T extends '' | `${string}${' '}${string}`
  ? false
  : true

export type ErrorSignature<
  TName extends string = string,
  TParams extends string = string,
> = `error ${TName}(${TParams})`
export type IsErrorSignature<T extends string> = T extends ErrorSignature<
  infer Name
>
  ? IsName<Name>
  : false
export type EventSignature<
  TName extends string = string,
  TParams extends string = string,
> = `event ${TName}(${TParams})`
export type IsEventSignature<T extends string> = T extends EventSignature<
  infer Name
>
  ? IsName<Name>
  : false

export type IsFunctionSignature<T> =
  T extends `function ${infer Name}(${string}`
    ? IsName<Name> extends true
      ? T extends ValidFunctionSignatures
        ? true
        : // Check that `Params` is not absorbing other types
        T extends `function ${string}(${infer Params})`
        ? Params extends InvalidFunctionParams // `InvalidParams` is not exhaustive - no regex in TypeScript :(
          ? false
          : true
        : false
      : false
    : false
type Scope = 'public' | 'external'
type Returns = `returns (${string})`
// Almost all valid function signatures, except `function ${string}(${infer Params})` since `Params` can absorb returns
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
  // params
  | `function ${string}(${string}) ${Returns}`
  | `function ${string}(${string}) ${AbiStateMutability}`
  | `function ${string}(${string}) ${Scope}`
  | `function ${string}(${string}) ${AbiStateMutability} ${Returns}`
  | `function ${string}(${string}) ${Scope} ${AbiStateMutability}`
  | `function ${string}(${string}) ${Scope} ${AbiStateMutability} ${Returns}`
type MangledReturns =
  // TODO: Make more exhaustive
  | `r${string}eturns`
  | `re${string}turns`
  | `ret${string}urns`
  | `retu${string}rns`
  | `retur${string}ns`
  | `return${string}s`
type InvalidFunctionParams =
  | `${string}${'returns' | MangledReturns} (${string}`
  | `${string}) ${'returns' | MangledReturns}${string}`
  | `${string})${string}${'returns' | MangledReturns}${string}(${string}`

export type IsStructSignature<T extends string> =
  T extends `struct ${infer Name} {${string}}` ? IsName<Name> : false

export type ConstructorSignature<TParams extends string = string> =
  `constructor(${TParams})`
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

export type Signature<T extends string> = IsSignature<T> extends true
  ? T
  : never

export type Signatures<T extends readonly string[]> = {
  [K in keyof T]: Signature<T[K]>
}