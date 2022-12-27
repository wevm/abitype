import type { Abi } from '../abi'
import type { GetConfig, GetReturnType } from './types'

export declare function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  config: GetConfig<TAbi, TFunctionName, 'pure' | 'view'>,
): GetReturnType<TAbi, TFunctionName>
