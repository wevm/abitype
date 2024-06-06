import type { Abi } from 'abitype'
import type { wagmiMintExampleAbi } from 'abitype/abis'

import type {
  ContractParameters,
  ContractReturnType,
  DeepPartial,
} from './types.js'

export declare function read<
  const abi extends Abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  functionName extends string,
  const args extends readonly unknown[] | undefined,
>(
  parameters: ReadParameters<abi, functionName, args>,
): ReadReturnType<abi, functionName, args>

export declare function readWagmiMintExample<
  functionName extends string,
  const args extends readonly unknown[] | undefined,
>(
  parameters: Omit<
    ReadParameters<typeof wagmiMintExampleAbi, functionName, args>,
    'abi'
  >,
): ReadReturnType<typeof wagmiMintExampleAbi, functionName, args>

export declare function useRead<
  const abi extends Abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  const functionName extends string,
  const args extends readonly unknown[] | undefined,
>(
  parameters: DeepPartial<ReadParameters<abi, functionName, args>, 1>,
): ReadReturnType<abi, functionName, args>

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ReadParameters<
  abi extends Abi | readonly unknown[],
  functionName extends string,
  args extends readonly unknown[] | undefined = readonly unknown[] | undefined,
> = { abi: abi } & ContractParameters<abi, functionName, 'pure' | 'view', args>

export type ReadReturnType<
  abi extends Abi | readonly unknown[],
  functionName extends string,
  args extends readonly unknown[] | undefined,
> = ContractReturnType<abi, functionName, args>
