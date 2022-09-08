import {
  Abi,
  AbiType,
  Address,
  SolidityArray,
  SolidityArrayWithoutTuple,
  SolidityTuple,
} from './abi'
import {
  AbiEventSignature,
  AbiFunctionSignature,
  AbiParameterToPrimitiveType,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from './utils'

type IsNever<T> = [T] extends [never] ? true : false
type NotEqual<T, U> = [T] extends [U] ? false : true
type Or<T, U> = T extends true ? true : U extends true ? true : false

////////////////////////////////////////////////////////////////////////////////////////////////////
// readContract

type ReadContractConfig<
  TAbi = unknown,
  TFunctionName = string,
  TSignature extends (...args: any) => any = (...args: any) => any,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Function to invoke on the contract */
  functionName: [TFunctionName] extends [never] ? string : TFunctionName
} & (Or<IsNever<Parameters<TSignature>>, NotEqual<TAbi, Abi>> extends true
  ? {
      /**
       * Arguments to pass contract method
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for better type inference.
       */
      args?: any[]
    }
  : Parameters<TSignature>['length'] extends 0
  ? { args?: never }
  : {
      /** Arguments to pass contract method */
      args: Parameters<TSignature>
    })

export function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'view' | 'pure'>
    : string,
  TSignature extends TAbi extends Abi
    ? AbiFunctionSignature<ExtractAbiFunction<TAbi, TFunctionName>>
    : (...args: any) => any,
>(
  _config: ReadContractConfig<TAbi, TFunctionName, TSignature>,
): ReturnType<TSignature> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// writeContract

type WriteContractConfig<
  TAbi = unknown,
  TFunctionName = string,
  TSignature extends (...args: any) => any = (...args: any) => any,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Function to invoke on the contract */
  functionName: [TFunctionName] extends [never] ? string : TFunctionName
} & (Or<IsNever<Parameters<TSignature>>, NotEqual<TAbi, Abi>> extends true
  ? {
      /**
       * Arguments to pass contract method
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for better type inference.
       */
      args?: any[]
    }
  : Parameters<TSignature>['length'] extends 0
  ? { args?: never }
  : {
      /** Arguments to pass contract method */
      args: Parameters<TSignature>
    })

export function writeContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
    : string,
  TSignature extends TAbi extends Abi
    ? AbiFunctionSignature<ExtractAbiFunction<TAbi, TFunctionName>>
    : (...args: any) => any,
>(
  _config: WriteContractConfig<TAbi, TFunctionName, TSignature>,
): ReturnType<TSignature> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// watchContractEvent

type WatchContractEventConfig<
  TAbi = unknown,
  TEventName = string,
  TSignature extends (...args: any) => any = (...args: any) => any,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Event to listen for */
  eventName: TEventName
  /** Callback when event is emitted */
  listener: IsNever<Parameters<TSignature>> extends true
    ? (...args: any) => void
    : TSignature
}

export function watchContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends TAbi extends Abi ? ExtractAbiEventNames<TAbi> : string,
  TSignature extends TAbi extends Abi
    ? AbiEventSignature<ExtractAbiEvent<TAbi, TEventName>>
    : (...args: any) => void,
>(_config: WatchContractEventConfig<TAbi, TEventName, TSignature>) {
  return
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// readContracts

type MAXIMUM_DEPTH = 20
type ContractsConfig<
  T extends unknown[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? ReadContractConfig[]
  : T extends []
  ? []
  : T extends [infer Head]
  ? [...Result, GetConfig<Head>]
  : T extends [infer Head, ...infer Tail]
  ? ContractsConfig<[...Tail], [...Result, GetConfig<Head>], [...Depth, 1]>
  : unknown[] extends T
  ? T
  : T extends ReadContractConfig<infer TAbi, infer TFunctionName>[]
  ? ReadContractConfig<TAbi, TFunctionName>[]
  : ReadContractConfig[]

type ContractsResult<
  T extends unknown[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? any[]
  : T extends []
  ? []
  : T extends [infer Head]
  ? [...Result, GetResult<Head>]
  : T extends [infer Head, ...infer Tail]
  ? ContractsResult<[...Tail], [...Result, GetResult<Head>], [...Depth, 1]>
  : T extends ReadContractConfig<infer TAbi, infer TFunctionName>[]
  ? GetResult<{ abi: TAbi; functionName: TFunctionName }>[]
  : any[]

type GetConfig<T> = T extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? ReadContractConfig<
      TAbi,
      ExtractAbiFunctionNames<TAbi, 'view' | 'pure'>,
      AbiFunctionSignature<ExtractAbiFunction<TAbi, TFunctionName>>
    >
  : ReadContractConfig

type GetResult<T> = T extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? ReturnType<AbiFunctionSignature<ExtractAbiFunction<TAbi, TFunctionName>>>
  : any

/**
 * TODO: Not able to infer `args` based on `functionName` without const assertion
 * Should figure out way to get inference working without needing const assertion.
 *
 * @example
 * const result = readContracts([{
 *   address,
 *   abi: wagmiMintExampleAbi,
 *   functionName: 'balanceOf', // <-- no const assertion
 *   args: [address], // <-- not inferred 😭
 * }])
 *
 * const result = readContracts([{
 *   address,
 *   abi: wagmiMintExampleAbi,
 *   functionName: 'balanceOf' as const, // <-- const assertion
 *   args: [address], // <-- inferred 😍
 * }])
 */
export function readContracts<T extends unknown[]>(
  _contracts: readonly [...ContractsConfig<T>],
): ContractsResult<T> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// signTypedData

type Schema<
  TTypes extends Record<
    string,
    readonly {
      name: string
      type:
        | keyof TTypes
        | Exclude<AbiType, SolidityTuple | SolidityArray>
        | SolidityArrayWithoutTuple
    }[]
  >,
> = {
  [K in keyof TTypes]: {
    [K2 in TTypes[K][number] as K2['name']]: K2['type'] extends keyof TTypes
      ? Schema<Exclude<TTypes, K>>[K2['type']]
      : AbiParameterToPrimitiveType<K2>
  }
}

export function signTypedData<
  TTypes extends Record<
    string,
    readonly {
      name: string
      type:
        | keyof TTypes
        | Exclude<AbiType, SolidityTuple | SolidityArray>
        | SolidityArrayWithoutTuple
    }[]
  >,
  TValues extends Schema<TTypes>,
>(_config: {
  /** Named list of all type definitions */
  types: TTypes
  /** Data to sign */
  value: TValues[keyof TValues]
}) {
  return {} as Address
}
