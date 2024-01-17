import { type Abi } from 'abitype'

import { type ReadParameters } from './read.js'
import {
  type ContractParameters,
  type ContractReturnType,
  type DeepPartial,
} from './types.js'

export declare function reads<
  const abi extends Abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  functionName extends string,
  const args extends readonly unknown[] | undefined,
  contracts extends Contract<abi, functionName, args>[],
>(parameters: ReadsParameters<contracts>): ReadsResult<contracts>

export declare function useReads<
  const abi extends Abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  functionName extends string,
  const args extends readonly unknown[] | undefined,
  contracts extends Contract<abi, functionName, args>[],
>(
  // TODO(@tmm): Broke for `typescript@5.1.3` https://github.com/wevm/abitype/issues/153
  // parameters: DeepPartial<ReadsParameters<contracts>, 3>,
  parameters: DeepPartial<
    { contracts: readonly [...DeepPartial<ContractsParameters<contracts>, 2>] },
    1
  >,
): ReadsResult<contracts>

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ReadsParameters<contracts extends Contract[]> = {
  contracts: readonly [...ContractsParameters<contracts>]
}

export type ReadsResult<contracts extends Contract[]> =
  ContractsReturnType<contracts>

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type Contract<
  abi extends Abi | readonly unknown[] = Abi | readonly unknown[],
  functionName extends string = string,
  args extends readonly unknown[] | undefined = readonly unknown[] | undefined,
> = { abi: abi; functionName: functionName; args?: args }

// Avoid TS depth-limit error in case of large array literal
type MAXIMUM_DEPTH = 20

type ReadsStateMutability = 'pure' | 'view'

type UninferrableContracts = (ContractParameters & {
  abi: Abi | readonly unknown[]
})[]

// recursively unwraps function arguments to infer/enforce type param
type ContractsParameters<
  contracts extends Contract[],
  result extends any[] = [],
  depth extends readonly number[] = [],
> = depth['length'] extends MAXIMUM_DEPTH
  ? UninferrableContracts
  : contracts extends []
  ? []
  : contracts extends [infer head extends Contract]
  ? [...result, ReadParameters<head['abi'], head['functionName'], head['args']>]
  : contracts extends [
      infer head extends Contract,
      ...infer tail extends Contract[],
    ]
  ? ContractsParameters<
      [...tail],
      [
        ...result,
        ReadParameters<head['abi'], head['functionName'], head['args']>,
      ],
      [...depth, 1]
    >
  : unknown[] extends contracts
  ? contracts
  : // If `contracts` is *some* array but we couldn't assign `unknown[]` to it, then it must hold some known/homogenous type!
  // use this to infer the param types in the case of Array.map() argument
  contracts extends {
      abi: infer abi extends Abi | readonly unknown[]
      functionName: infer functionName extends string
      args?: infer args extends readonly unknown[] | undefined
    }[]
  ? string extends functionName // if `functionName` is exactly `string`, then we can't infer the type param
    ? UninferrableContracts
    : (ContractParameters<abi, functionName, ReadsStateMutability, args> & {
        abi: abi
      })[]
  : UninferrableContracts

// recursively maps type param to results
type ContractsReturnType<
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
  ? ContractsReturnType<
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
