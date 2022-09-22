import {
  Abi,
  AbiEvent,
  AbiFunction,
  AbiParameter,
  AbiStateMutability,
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

/**
 * Check if {@link T} is `never`
 *
 * @param T - Type to check
 * @returns `true` if {@link T} is `never`, otherwise `false`
 *
 * @example
 * type Result = IsNever<'foo'>
 */
type IsNever<T> = [T] extends [never] ? true : false
/**
 * Check if {@link T} and {@link U} are equal
 *
 * @param T
 * @param U
 * @returns `true` if {@link T} and {@link U} are not equal, otherwise `false`
 *
 * @example
 * type Result = NotEqual<'foo', 'bar'>
 */
type NotEqual<T, U> = [T] extends [U] ? false : true
/**
 * Boolean "or" operator
 *
 * @param T
 * @param U
 * @returns `true` if either {@link T} or {@link U} are `true`, otherwise `false`
 *
 * @example
 * type Result = Or<true, false>
 */
type Or<T, U> = T extends true ? true : U extends true ? true : false

////////////////////////////////////////////////////////////////////////////////////////////////////
// Utils

type GetArgs<
  TAbi extends Abi | readonly unknown[],
  // It's important that we use `TFunction` to parse args so overloads still return the correct types
  TFunction extends AbiFunction & { type: 'function' },
> = TFunction['inputs'] extends infer TInputs extends readonly AbiParameter[]
  ? // Check if valid ABI. If `TInputs` is `never` or `TAbi` does not have the same shape as `Abi`, then return optional `readonly any[]` args.
    Or<IsNever<TInputs>, NotEqual<TAbi, Abi>> extends true
    ? {
        /**
         * Arguments to pass contract method
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
         */
        args?: readonly any[]
      }
    : // If there are no inputs, do not include `args` in the return type.
    TInputs['length'] extends 0
    ? { args?: never }
    : // Convert `TInputs` to primitive TypeScript types
      {
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
  // If `TFunctionName` is `never`, then ABI was not parsable. Fall back to `string`.
  functionName: IsNever<TFunctionName> extends true ? string : TFunctionName
} & GetArgs<TAbi, TFunction>

type GetConfig<
  TContract = unknown,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = TContract extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? ContractConfig<
      TAbi,
      ExtractAbiFunctionNames<TAbi, TAbiStateMutibility>,
      ExtractAbiFunction<TAbi, TFunctionName>
    >
  : TContract extends {
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
> =
  // Save `TOutputs` to local variable
  TFunction['outputs'] extends infer TOutputs extends readonly AbiParameter[]
    ? // Check if valid ABI. If `TOutputs` is `never` or `TAbi` does not have the same shape as `Abi`, then return `any` as result.
      Or<IsNever<TOutputs>, NotEqual<TAbi, Abi>> extends true
      ? any
      : // Save `TLength` to local variable for comparisons
      TOutputs['length'] extends infer TLength
      ? TLength extends 0
        ? void // If there are no outputs, return `void`
        : TLength extends 1
        ? AbiParameterToPrimitiveType<TOutputs[0]> // If there is one output, return the primitive type
        : // If outputs are inferrable, must be a known type. Convert to TypeScript primitives.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        TOutputs extends readonly [...infer _]
        ? /**
           * Return output as array assigned to an object with named keys
           *
           * | Outputs                                                               | Result                                                     |
           * | --------------------------------------------------------------------- | ---------------------------------------------------------- |
           * | `[{ name: 'foo', type: 'uint256' }, { name: 'bar', type: 'string' }]` | `readonly [bigint, string] & { foo: bigint; bar: string }` |
           * | `[{ name: 'foo', type: 'uint256' }, { name: '', type: 'string' }]`    | `readonly [bigint, string] & { foo: bigint }`              |
           */
          {
            [Output in TOutputs[number] as Output['name'] extends ''
              ? never
              : Output['name']]: AbiParameterToPrimitiveType<Output>
          } & AbiParametersToPrimitiveTypes<TOutputs>
        : any
      : never
    : never

type GetReturnType<TContract = unknown> = TContract extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? GetResult<TAbi, TFunctionName, ExtractAbiFunction<TAbi, TFunctionName>>
  : TContract extends {
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
  _config: GetConfig<
    { abi: TAbi; functionName: TFunctionName },
    'pure' | 'view'
  >,
): GetReturnType<{ abi: TAbi; functionName: TFunctionName }> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// writeContract

export function writeContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  _config: GetConfig<
    { abi: TAbi; functionName: TFunctionName },
    'nonpayable' | 'payable'
  >,
): GetReturnType<{ abi: TAbi; functionName: TFunctionName }> {
  return {} as any
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// watchContractEvent

type GetListener<
  TEvent extends AbiEvent,
  TAbi = unknown,
> = AbiParametersToPrimitiveTypes<
  TEvent['inputs']
> extends infer TArgs extends readonly unknown[]
  ? // If `TArgs` is never or `TAbi` does not have the same shape as `Abi`, we were not able to infer args.
    Or<IsNever<TArgs>, NotEqual<TAbi, Abi>> extends true
    ? {
        /**
         * Callback when event is emitted
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
         */
        listener: (...args: any) => void
      }
    : // We are able to infer args, spread the types.
      {
        /** Callback when event is emitted */
        listener: (...args: TArgs) => void
      }
  : never

type WatchContractEventConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string = string,
  TEvent extends AbiEvent = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : never,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Event to listen for */
  eventName: TEventName
} & GetListener<TEvent, TAbi>

type GetEventConfig<T> = T extends {
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
>(_config: GetEventConfig<{ abi: TAbi; eventName: TEventName }>) {
  return
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// readContracts

// Avoid TS depth-limit error in case of large array literal
type MAXIMUM_DEPTH = 20

/**
 * ContractsConfig reducer recursively unwraps function arguments to infer/enforce type param
 */
type ContractsConfig<
  TContracts extends unknown[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? GetConfig[]
  : TContracts extends []
  ? []
  : TContracts extends [infer Head]
  ? [...Result, GetConfig<Head, 'pure' | 'view'>]
  : TContracts extends [infer Head, ...infer Tail]
  ? ContractsConfig<
      [...Tail],
      [...Result, GetConfig<Head, 'pure' | 'view'>],
      [...Depth, 1]
    >
  : unknown[] extends TContracts
  ? TContracts
  : // If `TContracts` is *some* array but we couldn't assign `unknown[]` to it, then it must hold some known/homogenous type!
  // use this to infer the param types in the case of Array.map() argument
  TContracts extends ContractConfig<infer TAbi, infer TFunctionName>[]
  ? ContractConfig<TAbi, TFunctionName>[]
  : GetConfig[]

/**
 * ContractsResult reducer recursively maps type param to results
 */
type ContractsResult<
  TContracts extends unknown[],
  Result extends any[] = [],
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MAXIMUM_DEPTH
  ? GetReturnType[]
  : TContracts extends []
  ? []
  : TContracts extends [infer Head]
  ? [...Result, GetReturnType<Head>]
  : TContracts extends [infer Head, ...infer Tail]
  ? ContractsResult<[...Tail], [...Result, GetReturnType<Head>], [...Depth, 1]>
  : TContracts extends ContractConfig<infer TAbi, infer TFunctionName>[]
  ? // Dynamic-size (homogenous) UseQueryOptions array: map directly to array of results
    GetReturnType<{ abi: TAbi; functionName: TFunctionName }>[]
  : GetReturnType[]

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

type GetValue<TSchema = unknown> = TSchema[keyof TSchema] extends infer TValue
  ? // Check if we were able to infer the shape of typed data
    { [key: string]: any } extends TValue
    ? {
        /**
         * Data to sign
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link types} for type inference.
         */
        value: Record<string, any>
      }
    : {
        /** Data to sign */
        value: TValue
      }
  : never

export function signTypedData<
  TTypedData extends TypedData,
  TSchema extends TypedDataToPrimitiveTypes<TTypedData>,
>(
  _config: {
    /** Domain info */
    domain: TypedDataDomain
    /** Named list of all type definitions */
    types: TTypedData
  } & GetValue<TSchema>,
) {
  return {} as Address
}
