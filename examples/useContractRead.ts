import type { Abi } from '../src'
import type { wagmiMintExampleAbi } from '../test'
import type { ReadContractConfig } from './readContract'
import type { GetReturnType, InferOptional } from './types'

export declare function useContractRead<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  config: UseContractReadConfig<TAbi, TFunctionName>,
): { data: GetReturnType<TAbi, TFunctionName> }

type UseContractReadConfig<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
> = InferOptional<
  ReadContractConfig<TAbi, TFunctionName>,
  'abi' | 'address' | 'args' | 'functionName'
>

export declare function useWagmiMintExampleRead<
  TAbi extends Abi | readonly unknown[] = typeof wagmiMintExampleAbi,
  TFunctionName extends string = string,
>(
  config: Omit<UseContractReadConfig<TAbi, TFunctionName>, 'abi'>,
): { data: GetReturnType<TAbi, TFunctionName> }
