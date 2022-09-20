import {
  Abi,
  AbiEvent,
  AbiFunction,
  AbiParameter,
  Address,
  TypedData,
  TypedDataDomain,
} from '../abi'
import {
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  TypedDataToPrimitiveTypes,
} from '../utils'

type IsNever<T> = [T] extends [never] ? true : false
type NotEqual<T, U> = [T] extends [U] ? false : true
type Or<T, U> = T extends true ? true : U extends true ? true : false

type GetArgs<
  TAbi extends Abi | readonly unknown[],
  TFunction extends AbiFunction & { type: 'function' },
> = TFunction['inputs'] extends infer TInputs extends readonly AbiParameter[]
  ? Or<IsNever<TInputs>, NotEqual<TAbi, Abi>> extends true
    ? {
        /**
         * Arguments to pass contract method
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
         */
        args?: readonly any[]
      }
    : TInputs['length'] extends 0
    ? { args?: never }
    : {
        /** Arguments to pass contract method */
        args: AbiParametersToPrimitiveTypes<TInputs>
      }
  : never

type ContractConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TFunction extends AbiFunction & { type: 'function' } = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : never,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Function to invoke on the contract */
  functionName: IsNever<TFunctionName> extends true ? string : TFunctionName
} & GetArgs<TAbi, TFunction>

type GetReadParameters<T> = T extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? ContractConfig<
      TAbi,
      ExtractAbiFunctionNames<TAbi, 'view' | 'pure'>,
      ExtractAbiFunction<TAbi, TFunctionName>
    >
  : T extends {
      abi: infer TAbi extends readonly unknown[]
      functionName: infer TFunctionName extends string
    }
  ? ContractConfig<TAbi, TFunctionName>
  : ContractConfig

type GetWriteParameters<T> = T extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? ContractConfig<
      TAbi,
      ExtractAbiFunctionNames<TAbi, 'nonpayable' | 'payable'>,
      ExtractAbiFunction<TAbi, TFunctionName>
    >
  : T extends {
      abi: infer TAbi extends readonly unknown[]
      functionName: infer TFunctionName extends string
    }
  ? ContractConfig<TAbi, TFunctionName>
  : ContractConfig

type GetResult<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TFunction extends AbiFunction & { type: 'function' } = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : never,
> = TFunction['outputs'] extends infer TOutputs extends readonly AbiParameter[]
  ? Or<IsNever<TOutputs>, NotEqual<TAbi, Abi>> extends true
    ? any
    : TOutputs['length'] extends infer TLength
    ? TLength extends 0
      ? void
      : TLength extends 1
      ? AbiParameterToPrimitiveType<TOutputs[0]>
      : // eslint-disable-next-line @typescript-eslint/no-unused-vars
      TOutputs extends readonly [...infer _]
      ? {
          [Output in TOutputs[number] as Output['name'] extends ''
            ? never
            : Output['name']]: AbiParameterToPrimitiveType<Output>
        } & AbiParametersToPrimitiveTypes<TOutputs>
      : any
    : never
  : never

type GetReturnType<T> = T extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? GetResult<TAbi, TFunctionName, ExtractAbiFunction<TAbi, TFunctionName>>
  : T extends {
      abi: infer TAbi extends readonly unknown[]
      functionName: infer TFunctionName extends string
    }
  ? GetResult<TAbi, TFunctionName>
  : GetResult

////////////////////////////////////////////////////////////////////////////////////////////////////
// readContract

export function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  _config: GetReadParameters<{ abi: TAbi; functionName: TFunctionName }>,
): GetReturnType<{ abi: TAbi; functionName: TFunctionName }> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// writeContract

export function writeContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  _config: GetWriteParameters<{ abi: TAbi; functionName: TFunctionName }>,
): GetReturnType<{ abi: TAbi; functionName: TFunctionName }> {
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

type GetEventParameters<T> = T extends {
  abi: infer TAbi extends Abi
  eventName: infer TEventName extends string
}
  ? WatchContractEventConfig<
      TAbi,
      ExtractAbiEventNames<TAbi>,
      ExtractAbiEvent<TAbi, TEventName>
    >
  : T extends {
      abi: infer TAbi extends readonly unknown[]
      eventName: infer TEventName extends string
    }
  ? WatchContractEventConfig<TAbi, TEventName>
  : WatchContractEventConfig

export function watchContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
>(_config: GetEventParameters<{ abi: TAbi; eventName: TEventName }>) {
  return
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// readContracts

type MAXIMUM_DEPTH = 20
type ContractsConfig<
  TContracts extends unknown[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? ContractConfig[]
  : TContracts extends []
  ? []
  : TContracts extends [infer Head]
  ? [...Result, GetReadParameters<Head>]
  : TContracts extends [infer Head, ...infer Tail]
  ? ContractsConfig<
      [...Tail],
      [...Result, GetReadParameters<Head>],
      [...Depth, 1]
    >
  : unknown[] extends TContracts
  ? TContracts
  : TContracts extends ContractConfig<infer TAbi, infer TFunctionName>[]
  ? ContractConfig<TAbi, TFunctionName>[]
  : ContractConfig[]

type ContractsResult<
  TContracts extends unknown[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? any[]
  : TContracts extends []
  ? []
  : TContracts extends [infer Head]
  ? [...Result, GetReturnType<Head>]
  : TContracts extends [infer Head, ...infer Tail]
  ? ContractsResult<[...Tail], [...Result, GetReturnType<Head>], [...Depth, 1]>
  : TContracts extends ContractConfig<infer TAbi, infer TFunctionName>[]
  ? GetReturnType<{ abi: TAbi; functionName: TFunctionName }>[]
  : any[]

export function readContracts<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends { abi: TAbi; functionName: TFunctionName }[],
>(_config: {
  contracts: readonly [...ContractsConfig<TContracts>]
}): ContractsResult<TContracts> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// signTypedData

export function signTypedData<
  TTypedData extends TypedData,
  TSchema extends TypedDataToPrimitiveTypes<TTypedData>,
>(_config: {
  /** Domain info */
  domain: TypedDataDomain
  /** Named list of all type definitions */
  types: TTypedData
  /** Data to sign */
  value: TSchema[keyof TSchema] extends infer TValue
    ? { [key: string]: any } extends TValue
      ? Record<string, any>
      : TValue
    : never
}) {
  return {} as Address
}
