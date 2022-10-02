import { Abi } from '../abi'
import { GetConfig, GetReturnType } from './types'

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
