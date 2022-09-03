import { Abi, Address } from './abi'
import {
  Contract,
  ExtractAbiEventNames,
  ExtractAbiFunctionNames,
} from './utils'

export function readContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'view' | 'pure'>,
  TContract extends {
    functions: { [k: string]: (...args: any) => any }
  } = Contract<TAbi>,
  TFunction extends (
    ...args: any
  ) => any = TContract['functions'][TFunctionName],
>(
  _config: {
    /** Contract address */
    address: Address
    /** Contract ABI */
    contractInterface: TAbi
    /** Function to invoke on the contract */
    functionName: [TFunctionName] extends [never] ? string : TFunctionName
  } & (Parameters<TFunction>['length'] extends 0
    ? {
        args?: [Parameters<TFunction>] extends [never] ? any | undefined : never
      }
    : Parameters<TFunction> extends unknown[][]
    ? { args?: never }
    : Parameters<TFunction>['length'] extends 1
    ? { args: Parameters<TFunction>[0] }
    : { args: Parameters<TFunction> }),
): ReturnType<TFunction> {
  return {} as any
}

export function writeContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>,
  TContract extends {
    functions: { [k: string]: (...args: any) => any }
  } = Contract<TAbi>,
  TFunction extends (
    ...args: any
  ) => any = TContract['functions'][TFunctionName],
>(
  _config: {
    /** Contract address */
    address: Address
    /** Contract ABI */
    contractInterface: TAbi
    /** Function to invoke on the contract */
    functionName: [TFunctionName] extends [never] ? string : TFunctionName
  } & (Parameters<TFunction>['length'] extends 0
    ? {
        args?: [Parameters<TFunction>] extends [never] ? any | undefined : never
      }
    : Parameters<TFunction> extends unknown[][]
    ? { args?: never }
    : Parameters<TFunction>['length'] extends 1
    ? { args: Parameters<TFunction>[0] }
    : {
        args: Parameters<TFunction>
      }),
): ReturnType<TFunction> {
  return {} as any
}

export function watchContractEvent<
  TAbi extends Abi,
  TEventName extends ExtractAbiEventNames<TAbi>,
  TContract extends {
    events: { [k: string]: (...args: any) => any }
  } = Contract<TAbi>,
>(_config: {
  address: Address
  contractInterface: TAbi
  eventName: TEventName
  listener: TContract['events'][TEventName]
}) {
  return
}

type GetOptions<T> = T extends {
  contractInterface: Abi
  functionName: infer TFunctionName
}
  ? UseQueryOptionsForUseQueries<T['contractInterface'], TFunctionName>
  : never

type UseQueryOptionsForUseQueries<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<
    TAbi,
    'pure' | 'view'
  > = ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
> = {
  contractInterface: TAbi
  functionName: TFunctionName
}

type QueriesOptions<
  T extends readonly any[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = T extends []
  ? []
  : T extends readonly [infer Head]
  ? [...Result, GetOptions<Head>]
  : T extends readonly [infer Head, ...infer Tail]
  ? QueriesOptions<
      readonly [...Tail],
      [...Result, GetOptions<Head>],
      [...Depth, 1]
    >
  : readonly unknown[] extends T
  ? T
  : // If T is *some* array but we couldn't assign unknown[] to it, then it must hold some known/homogenous type!
  // use this to infer the param types in the case of Array.map() argument
  T extends UseQueryOptionsForUseQueries<infer TAbi, infer TFunctionName>[]
  ? UseQueryOptionsForUseQueries<TAbi, TFunctionName>[]
  : // Fallback
    'fallback'[]

export function readContracts<TContracts extends readonly any[]>(_config: {
  contracts: readonly [...QueriesOptions<TContracts>]
}) {
  return {} as any
}
