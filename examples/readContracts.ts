import type { Abi } from 'abitype'

import type { Contract, GetConfig, GetReturnType } from './types'

export declare function readContracts<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends { abi: TAbi; functionName: TFunctionName }[],
>(config: ReadContractsConfig<TContracts>): ContractsResult<TContracts>

export type ReadContractsConfig<TContracts extends Contract[]> = {
  contracts: readonly [...ContractsConfig<TContracts>]
}

export type ReadContractsResult<TContracts extends Contract[]> =
  ContractsResult<TContracts>

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
  ? [...Result, GetConfig<Head['abi'], Head['functionName'], 'pure' | 'view'>]
  : TContracts extends [
      infer Head extends Contract,
      ...infer Tail extends Contract[],
    ]
  ? ContractsConfig<
      [...Tail],
      [
        ...Result,
        GetConfig<Head['abi'], Head['functionName'], 'pure' | 'view'>,
      ],
      [...Depth, 1]
    >
  : unknown[] extends TContracts
  ? TContracts
  : // If `TContracts` is *some* array but we couldn't assign `unknown[]` to it, then it must hold some known/homogenous type!
  // use this to infer the param types in the case of Array.map() argument
  TContracts extends GetConfig<infer TAbi, infer TFunctionName>[]
  ? GetConfig<TAbi, TFunctionName>[]
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
  ? [...Result, GetReturnType<Head['abi'], Head['functionName']>]
  : TContracts extends [
      infer Head extends Contract,
      ...infer Tail extends Contract[],
    ]
  ? ContractsResult<
      [...Tail],
      [...Result, GetReturnType<Head['abi'], Head['functionName']>],
      [...Depth, 1]
    >
  : TContracts extends GetConfig<infer TAbi, infer TFunctionName>[]
  ? GetReturnType<TAbi, TFunctionName>[]
  : GetReturnType[]
