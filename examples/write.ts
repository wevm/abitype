import type { Abi } from 'abitype'

import type {
  ContractParameters,
  ContractReturnType,
  MaybePartialBy,
} from './types.js'

export declare function write<
  const abi extends Abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  functionName extends string,
  const args extends readonly unknown[] | undefined,
>(
  parameters: MaybePartialBy<
    WriteParameters<abi, functionName, args>,
    readonly [] extends args ? 'args' : string
  >,
): WriteReturnType<abi, functionName, args>

export type WriteParameters<
  abi extends Abi | readonly unknown[],
  functionName extends string,
  args extends readonly unknown[] | undefined = readonly unknown[] | undefined,
> = { abi: abi } & ContractParameters<
  abi,
  functionName,
  'nonpayable' | 'payable',
  args
>

export type WriteReturnType<
  abi extends Abi | readonly unknown[],
  functionName extends string,
  args extends readonly unknown[] | undefined,
> = ContractReturnType<abi, functionName, args>
