import { Abi } from '../abi'
import { GetConfig, GetReturnType } from './types'

export declare function writeContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  config: GetConfig<
    { abi: TAbi; functionName: TFunctionName },
    'nonpayable' | 'payable'
  >,
): GetReturnType<{ abi: TAbi; functionName: TFunctionName }>
