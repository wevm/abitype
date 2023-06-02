import type { Abi } from 'abitype'

import type { ContractParameters, ContractReturnType } from './types.js'
import type { Pretty } from 'abitype/types.js'

export declare function reads<
  const abi extends Abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  functionName extends string,
  const args extends readonly unknown[] | undefined,
  contracts extends { abi: abi; functionName: functionName; args?: args }[],
>(config: ReadsParameters<contracts>): ContractsResult<contracts>

export type ReadsParameters<contracts extends Contract[]> = {
  contracts: readonly [...ContractsConfig<contracts>]
}

export type ReadsResult<contracts extends Contract[]> =
  ContractsResult<contracts>

type Contract<
  abi extends Abi | readonly unknown[] = Abi | readonly unknown[],
  functionName extends string = string,
  args extends readonly unknown[] | undefined = readonly unknown[] | undefined,
> = { abi: abi; functionName: functionName; args?: args }

// Avoid TS depth-limit error in case of large array literal
type MAXIMUM_DEPTH = 20

// recursively unwraps function arguments to infer/enforce type param
type ContractsConfig<
  contracts extends Contract[],
  result extends any[] = [],
  depth extends readonly number[] = [],
> = depth['length'] extends MAXIMUM_DEPTH
  ? (ContractParameters & { abi: Abi | readonly unknown[] })[]
  : contracts extends []
  ? []
  : contracts extends [infer head extends Contract]
  ? [
      ...result,
      Pretty<
        ContractParameters<
          head['abi'],
          head['functionName'],
          'pure' | 'view',
          head['args']
        > & {
          abi: head['abi']
        }
      >,
    ]
  : contracts extends [
      infer head extends Contract,
      ...infer tail extends Contract[],
    ]
  ? ContractsConfig<
      [...tail],
      [
        ...result,
        ContractParameters<
          head['abi'],
          head['functionName'],
          'pure' | 'view',
          head['args']
        > & { abi: head['abi'] },
      ],
      [...depth, 1]
    >
  : unknown[] extends contracts
  ? contracts
  : // If `TContracts` is *some* array but we couldn't assign `unknown[]` to it, then it must hold some known/homogenous type!
  // use this to infer the param types in the case of Array.map() argument
  contracts extends {
      abi: infer abi extends Abi | readonly unknown[]
      functionName: infer functionName extends string
      args?: infer args extends readonly unknown[] | undefined
    }[]
  ? (ContractParameters<abi, functionName, 'pure' | 'view', args> & {
      abi: abi
    })[]
  : (ContractParameters & { abi: Abi | readonly unknown[] })[]

// recursively maps type param to results
type ContractsResult<
  contracts extends Contract[],
  result extends any[] = [],
  depth extends readonly number[] = [],
> = depth['length'] extends MAXIMUM_DEPTH
  ? ContractReturnType[]
  : contracts extends []
  ? []
  : contracts extends [infer head extends Contract]
  ? [
      ...result,
      ContractReturnType<head['abi'], head['functionName'], head['args']>,
    ]
  : contracts extends [
      infer head extends Contract,
      ...infer tail extends Contract[],
    ]
  ? ContractsResult<
      [...tail],
      [
        ...result,
        ContractReturnType<head['abi'], head['functionName'], head['args']>,
      ],
      [...depth, 1]
    >
  : contracts extends {
      abi: infer abi extends Abi | readonly unknown[]
      functionName: infer functionName extends string
      args?: infer args extends readonly unknown[] | undefined
    }[]
  ? ContractReturnType<abi, functionName, args>[]
  : ContractReturnType[]
