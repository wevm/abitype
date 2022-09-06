import { Abi, Address } from './abi'
import {
  AbiEventSignature,
  AbiFunctionSignature,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from './utils'

type IsNever<T> = [T] extends [never] ? true : false
type NotEqual<T, U> = [T] extends [U] ? false : true
type Or<T, U> = T extends true ? true : U extends true ? true : false

export function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'view' | 'pure'>
    : string,
  TSignature extends TAbi extends Abi
    ? AbiFunctionSignature<ExtractAbiFunction<TAbi, TFunctionName>>
    : (...args: any) => any,
>(
  _config: {
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
      }),
): ReturnType<TSignature> {
  return {} as any
}

export function writeContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends TAbi extends Abi
    ? ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>
    : string,
  TSignature extends TAbi extends Abi
    ? AbiFunctionSignature<ExtractAbiFunction<TAbi, TFunctionName>>
    : (...args: any) => any,
>(
  _config: {
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
      }),
): ReturnType<TSignature> {
  return {} as any
}

export function watchContractEvent<
  TAbi extends Abi | readonly unknown[],
  TEventName extends TAbi extends Abi ? ExtractAbiEventNames<TAbi> : string,
  TSignature extends TAbi extends Abi
    ? AbiEventSignature<ExtractAbiEvent<TAbi, TEventName>>
    : (...args: any) => void,
>(_config: {
  address: Address
  abi: TAbi
  eventName: TEventName
  listener: IsNever<Parameters<TSignature>> extends true
    ? (...args: any) => void
    : TSignature
}) {
  return
}
