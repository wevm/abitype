import { type Abi } from 'abitype'

import { type ContractParameters, type ContractReturnType } from './types.js'

export declare function write<
  const abi extends Abi | readonly unknown[], // `readonly unknown[]` allows for non-const asserted types
  functionName extends string,
  const args extends readonly unknown[] | undefined,
>(
  parameters: WriteParameters<abi, functionName, args>,
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
