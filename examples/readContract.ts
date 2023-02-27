import type { Abi } from 'abitype'
import type { wagmiMintExampleAbi } from 'abitype/test'

import type { GetConfig, GetReturnType } from './types'

export declare function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  config: ReadContractConfig<TAbi, TFunctionName>,
): GetReturnType<TAbi, TFunctionName>

export declare function readWagmiMintExample<
  TAbi extends Abi | readonly unknown[] = typeof wagmiMintExampleAbi,
  TFunctionName extends string = string,
>(
  config: Omit<ReadContractConfig<TAbi, TFunctionName>, 'abi'>,
): GetReturnType<TAbi, TFunctionName>

export type ReadContractConfig<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
> = GetConfig<TAbi, TFunctionName, 'pure' | 'view'>
