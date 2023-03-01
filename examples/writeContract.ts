import type { Abi } from 'abitype'

import type { GetConfig, GetReturnType } from './types'

export declare function writeContract<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
>(
  config: GetConfig<TAbi, TFunctionName, 'nonpayable' | 'payable'>,
): GetReturnType<TAbi, TFunctionName>
