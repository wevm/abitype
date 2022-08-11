import { Abi, Address } from './abi'
import {
  AbiParametersToPrimitiveTypes,
  ExtractAbiEventNames,
  ExtractAbiEventParameters,
  ExtractAbiFunctionNames,
  ExtractAbiFunctionParameters,
} from './utils'

export function readContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
  TArgs extends AbiParametersToPrimitiveTypes<
    ExtractAbiFunctionParameters<TAbi, TFunctionName, 'inputs'>
  >,
  TResponse extends AbiParametersToPrimitiveTypes<
    ExtractAbiFunctionParameters<TAbi, TFunctionName, 'outputs'>
  >,
>(
  _config: {
    /** Contract address */
    address: Address
    /** Contract ABI */
    contractInterface: TAbi
    /** Function to invoke on the contract */
    functionName: TFunctionName
  } & (TArgs['length'] extends 0
    ? {
        // Add optional `args` param if not able to infer `TArgs`
        // e.g. not using const assertion for `contractInterface`
        // Otherwise remove from config object
        args?: [TArgs] extends [never] ? any | undefined : never
      }
    : {
        /** Arguments to pass contract method */
        args: TArgs['length'] extends 1 ? TArgs[0] : TArgs
      }),
): TResponse['length'] extends 0
  ? [TResponse] extends [never]
    ? any
    : void
  : TResponse['length'] extends 1
  ? TResponse[0]
  : TResponse {
  return {} as any
}

export function writeContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>,
  TArgs extends AbiParametersToPrimitiveTypes<
    ExtractAbiFunctionParameters<TAbi, TFunctionName, 'inputs'>
  >,
  TResponse extends AbiParametersToPrimitiveTypes<
    ExtractAbiFunctionParameters<TAbi, TFunctionName, 'outputs'>
  >,
>(
  _config: {
    /** Contract address */
    address: Address
    /** Contract ABI */
    contractInterface: TAbi
    /** Function to invoke on the contract */
    functionName: TFunctionName
  } & (TArgs['length'] extends 0
    ? {
        // Add optional `args` param if not able to infer `TArgs`
        // e.g. not using const assertion for `contractInterface`
        // Otherwise remove from config object
        args?: [TArgs] extends [never] ? any | undefined : never
      }
    : {
        /** Arguments to pass contract method */
        args: TArgs['length'] extends 1 ? TArgs[0] : TArgs
      }),
): TResponse['length'] extends 0
  ? [TResponse] extends [never]
    ? any
    : void
  : TResponse['length'] extends 1
  ? TResponse[0]
  : TResponse {
  return {} as any
}

export function watchContractEvent<
  TAbi extends Abi,
  TEventName extends ExtractAbiEventNames<TAbi>,
  TArgs extends AbiParametersToPrimitiveTypes<
    ExtractAbiEventParameters<TAbi, TEventName>
  >,
>(_config: {
  address: Address
  contractInterface: TAbi
  eventName: TEventName
  listener(
    ...args: [TArgs] extends [never]
      ? any[]
      : TArgs extends readonly any[]
      ? TArgs
      : never
  ): void
}) {
  return
}
