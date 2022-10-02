import { Abi } from '../abi'
import { GetConfig, GetReturnType } from './types'

export function readContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  _config: GetConfig<
    { abi: TAbi; functionName: TFunctionName },
    'pure' | 'view'
  >,
): GetReturnType<{ abi: TAbi; functionName: TFunctionName }> {
  return {} as any
}
