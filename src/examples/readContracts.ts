import type { Abi } from '../abi'
import type { Config, Contract, GetConfig, GetReturnType } from './types'

// Avoid TS depth-limit error in case of large array literal
type MAXIMUM_DEPTH = 20

/**
 * ContractsConfig reducer recursively unwraps function arguments to infer/enforce type param
 */
type ContractsConfig<
  TContracts extends Contract[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? GetConfig[]
  : TContracts extends []
  ? []
  : TContracts extends [infer Head extends Contract]
  ? [...Result, GetConfig<Head, 'pure' | 'view'>]
  : TContracts extends [
      infer Head extends Contract,
      ...infer Tail extends Contract[],
    ]
  ? ContractsConfig<
      [...Tail],
      [...Result, GetConfig<Head, 'pure' | 'view'>],
      [...Depth, 1]
    >
  : unknown[] extends TContracts
  ? TContracts
  : // If `TContracts` is *some* array but we couldn't assign `unknown[]` to it, then it must hold some known/homogenous type!
  // use this to infer the param types in the case of Array.map() argument
  TContracts extends Config<infer TAbi, infer TFunctionName>[]
  ? Config<TAbi, TFunctionName>[]
  : GetConfig[]

/**
 * ContractsResult reducer recursively maps type param to results
 */
type ContractsResult<
  TContracts extends Contract[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? GetReturnType[]
  : TContracts extends []
  ? []
  : TContracts extends [infer Head extends Contract]
  ? [...Result, GetReturnType<Head>]
  : TContracts extends [
      infer Head extends Contract,
      ...infer Tail extends Contract[],
    ]
  ? ContractsResult<[...Tail], [...Result, GetReturnType<Head>], [...Depth, 1]>
  : TContracts extends Config<infer TAbi, infer TFunctionName>[]
  ? GetReturnType<{ abi: TAbi; functionName: TFunctionName }>[]
  : GetReturnType[]

export declare function readContracts<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends { abi: TAbi; functionName: TFunctionName }[],
>(config: {
  contracts: readonly [...ContractsConfig<TContracts>]
}): ContractsResult<TContracts>
