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

type GetResult<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
> = TAbi extends Abi
  ? ExtractAbiFunction<
      TAbi,
      TFunctionName
    >['outputs'] extends infer TOutputs extends readonly AbiParameter[]
    ? TOutputs['length'] extends infer TLength
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
  : any

////////////////////////////////////////////////////////////////////////////////////////////////////
// readContract

type ReadContractConfig<
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
  functionName: [TFunctionName] extends [never] ? string : TFunctionName
} & GetArgs<TAbi, TFunction>

export function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'view' | 'pure'>
    : string,
>(
  _config: ReadContractConfig<TAbi, TFunctionName>,
): GetResult<TAbi, TFunctionName> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// writeContract

type WriteContractConfig<
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
  functionName: [TFunctionName] extends [never] ? string : TFunctionName
} & GetArgs<TAbi, TFunction>

export function writeContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
    : string,
>(
  _config: WriteContractConfig<TAbi, TFunctionName>,
): GetResult<TAbi, TFunctionName> {
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
  TContracts extends unknown[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? ReadContractConfig[]
  : TContracts extends []
  ? []
  : TContracts extends [infer Head]
  ? [...Result, _GetConfig<Head>]
  : TContracts extends [infer Head, ...infer Tail]
  ? ContractsConfig<[...Tail], [...Result, _GetConfig<Head>], [...Depth, 1]>
  : unknown[] extends TContracts
  ? TContracts
  : TContracts extends ReadContractConfig<infer TAbi, infer TFunctionName>[]
  ? ReadContractConfig<TAbi, TFunctionName>[]
  : ReadContractConfig[]

type ContractsResult<
  TContracts extends unknown[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? any[]
  : TContracts extends []
  ? []
  : TContracts extends [infer Head]
  ? [...Result, _GetResult<Head>]
  : TContracts extends [infer Head, ...infer Tail]
  ? ContractsResult<[...Tail], [...Result, _GetResult<Head>], [...Depth, 1]>
  : TContracts extends ReadContractConfig<infer TAbi, infer TFunctionName>[]
  ? _GetResult<{ abi: TAbi; functionName: TFunctionName }>[]
  : any[]

type _GetConfig<T> = T extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? ReadContractConfig<
      TAbi,
      ExtractAbiFunctionNames<TAbi, 'view' | 'pure'>,
      ExtractAbiFunction<TAbi, TFunctionName>
    >
  : ReadContractConfig

type _GetResult<T> = T extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? GetResult<TAbi, TFunctionName>
  : GetResult

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
export function readContracts<TContracts extends unknown[]>(_config: {
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
