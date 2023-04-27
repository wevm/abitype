import type { Abi } from 'abitype'
import type { wagmiMintExampleAbi } from 'abitype/test'

import type { ReadContractConfig } from './readContract.js'
import type { GetReturnType, InferOptional } from './types.js'

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
