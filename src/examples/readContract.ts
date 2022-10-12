import { Abi } from '../abi'
import { GetConfig, GetReturnType } from './types'

export declare function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  config: GetConfig<
    { abi: TAbi; functionName: TFunctionName },
    'pure' | 'view'
  >,
): GetReturnType<{ abi: TAbi; functionName: TFunctionName }>
