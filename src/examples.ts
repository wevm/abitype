import { Abi, Address } from './abi'
import {
  AbiParametersToPrimitiveTypes,
  ExtractAbiEventNames,
  ExtractAbiEventParameters,
  ExtractAbiFunctionNames,
  ExtractAbiFunctionParameters,
} from './utils'

export function readContract<
  TAbi,
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
    : string,
  TArgs extends TAbi extends Abi
    ? AbiParametersToPrimitiveTypes<
        ExtractAbiFunctionParameters<TAbi, TFunctionName, 'inputs'>
      >
    : any[],
  TResponse extends TAbi extends Abi
    ? AbiParametersToPrimitiveTypes<
        ExtractAbiFunctionParameters<TAbi, TFunctionName, 'outputs'>
      >
    : any,
>(
  _config: {
    address: Address
    contractInterface: TAbi
    functionName: TFunctionName
  } & (TArgs extends any[]
    ? { args?: any }
    : TArgs['length'] extends 0
    ? { args?: never }
    : TArgs['length'] extends 1
    ? { args: TArgs[0] }
    : { args: TArgs }),
): TResponse['length'] extends 0
  ? void
  : TResponse['length'] extends 1
  ? TResponse[0]
  : TResponse {
  return {} as TResponse['length'] extends 0
    ? void
    : TResponse['length'] extends 1
    ? TResponse[0]
    : TResponse
}

export function writeContract<
  TAbi,
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
    : string,
  TArgs extends TAbi extends Abi
    ? AbiParametersToPrimitiveTypes<
        ExtractAbiFunctionParameters<TAbi, TFunctionName, 'inputs'>
      >
    : any[],
  TResponse extends TAbi extends Abi
    ? AbiParametersToPrimitiveTypes<
        ExtractAbiFunctionParameters<TAbi, TFunctionName, 'outputs'>
      >
    : any,
>(
  _config: {
    address: Address
    contractInterface: TAbi
    functionName: TFunctionName
  } & (TArgs extends any[]
    ? { args?: any }
    : TArgs['length'] extends 0
    ? { args?: never }
    : TArgs['length'] extends 1
    ? { args: TArgs[0] }
    : { args: TArgs }),
): TResponse['length'] extends 0
  ? void
  : TResponse['length'] extends 1
  ? TResponse[0]
  : TResponse {
  return {} as TResponse['length'] extends 0
    ? void
    : TResponse['length'] extends 1
    ? TResponse[0]
    : TResponse
}

export function watchContractEvent<
  TAbi,
  TEventName extends TAbi extends Abi ? ExtractAbiEventNames<TAbi> : string,
  TInputs extends TAbi extends Abi
    ? AbiParametersToPrimitiveTypes<ExtractAbiEventParameters<TAbi, TEventName>>
    : any[],
  TArgs extends TInputs extends readonly any[] ? TInputs : [TInputs],
>(_config: {
  address: Address
  contractInterface: TAbi
  eventName: TEventName
  listener(...args: TArgs): void
}) {
  return
}
