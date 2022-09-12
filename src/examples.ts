import { Abi, AbiEvent, AbiFunction, Address, TypedData } from './abi'
import {
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  TypedDataToPrimitiveTypes,
} from './utils'

type IsNever<T> = [T] extends [never] ? true : false
type NotEqual<T, U> = [T] extends [U] ? false : true
type Or<T, U> = T extends true ? true : U extends true ? true : false
type UnwrapArray<T> = T extends infer _T extends readonly any[]
  ? _T['length'] extends 0
    ? void
    : _T['length'] extends 1
    ? _T[0]
    : // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _T extends readonly [...infer _]
    ? _T
    : any
  : never

////////////////////////////////////////////////////////////////////////////////////////////////////
// readContract

type ReadContractConfig<
  TAbi = unknown,
  TFunctionName = string,
  TFunction extends AbiFunction & { type: 'function' } = ExtractAbiFunction<
    TAbi extends Abi ? TAbi : never,
    TFunctionName extends string ? TFunctionName : never
  >,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Function to invoke on the contract */
  functionName: [TFunctionName] extends [never] ? string : TFunctionName
} & (AbiParametersToPrimitiveTypes<
  TFunction['inputs']
> extends infer TArgs extends readonly any[]
  ? Or<IsNever<TArgs>, NotEqual<TAbi, Abi>> extends true
    ? {
        /**
         * Arguments to pass contract method
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for better type inference.
         */
        args?: any[]
      }
    : TArgs['length'] extends 0
    ? { args?: never }
    : {
        /** Arguments to pass contract method */
        args: TArgs
      }
  : never)

type ReadContractResult<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
> = TAbi extends Abi
  ? UnwrapArray<
      AbiParametersToPrimitiveTypes<
        ExtractAbiFunction<TAbi, TFunctionName>['outputs']
      >
    >
  : any

export function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'view' | 'pure'>
    : string,
>(
  _config: ReadContractConfig<TAbi, TFunctionName>,
): ReadContractResult<TAbi, TFunctionName> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// writeContract

type WriteContractConfig<
  TAbi = unknown,
  TFunctionName = string,
  TFunction extends AbiFunction & { type: 'function' } = ExtractAbiFunction<
    TAbi extends Abi ? TAbi : never,
    TFunctionName extends string ? TFunctionName : never
  >,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Function to invoke on the contract */
  functionName: [TFunctionName] extends [never] ? string : TFunctionName
} & (AbiParametersToPrimitiveTypes<
  TFunction['inputs']
> extends infer TArgs extends readonly any[]
  ? Or<IsNever<TArgs>, NotEqual<TAbi, Abi>> extends true
    ? {
        /**
         * Arguments to pass contract method
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for better type inference.
         */
        args?: any[]
      }
    : TArgs['length'] extends 0
    ? { args?: never }
    : {
        /** Arguments to pass contract method */
        args: TArgs
      }
  : never)

type WriteContractResult<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
> = TAbi extends Abi
  ? UnwrapArray<
      AbiParametersToPrimitiveTypes<
        ExtractAbiFunction<TAbi, TFunctionName>['outputs']
      >
    >
  : any

export function writeContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
    : string,
>(
  _config: WriteContractConfig<TAbi, TFunctionName>,
): WriteContractResult<TAbi, TFunctionName> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// watchContractEvent

type WatchContractEventConfig<
  TAbi = unknown,
  TEventName = string,
  TEvent extends AbiEvent = ExtractAbiEvent<
    TAbi extends Abi ? TAbi : Abi,
    TEventName extends string ? TEventName : never
  >,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Event to listen for */
  eventName: TEventName
  /** Callback when event is emitted */
  listener: AbiParametersToPrimitiveTypes<
    TEvent['inputs']
  > extends infer TArgs extends readonly any[]
    ? Or<IsNever<TArgs>, NotEqual<TAbi, Abi>> extends true
      ? (...args: any) => void
      : (...args: TArgs) => void
    : never
}

export function watchContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends TAbi extends Abi ? ExtractAbiEventNames<TAbi> : string,
>(_config: WatchContractEventConfig<TAbi, TEventName>) {
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
      ExtractAbiFunction<TAbi, TFunctionName>
    >
  : ReadContractConfig

type GetResult<T> = T extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? ReadContractResult<TAbi, TFunctionName>
  : ReadContractConfig

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

export function signTypedData<
  TTypedData extends TypedData,
  TSchema extends TypedDataToPrimitiveTypes<TTypedData>,
>(_config: {
  /** Named list of all type definitions */
  types: TTypedData
  /** Data to sign */
  value: TSchema[keyof TSchema]
}) {
  return {} as Address
}
