import type { Abi } from 'abitype'

import type {
  ReadContractsConfig,
  ReadContractsResult,
} from './readContracts.js'
import type { Contract, DeepPartial } from './types.js'

export declare function useContractReads<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends { abi: TAbi; functionName: TFunctionName }[],
>(
  config: UseContractReadsConfig<TContracts>,
): { data: ReadContractsResult<TContracts> }

type UseContractReadsConfig<
  TContracts extends Contract[],
  Config extends ReadContractsConfig<TContracts> = ReadContractsConfig<TContracts>,
> = {
  [K in keyof Config]?: K extends 'contracts'
    ? DeepPartial<Config[K], 2>
    : Config[K]
}
