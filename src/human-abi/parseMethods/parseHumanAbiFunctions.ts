import type { AbiFunction } from '../../abi'
import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiFunctions } from '../habi'
import type { AbiMutability, FunctionSignature } from '../utils'
import { parseHumanAbiArguments } from './parseHumanAbiArguments'
import type { Context } from './parseHumanAbiArguments'
import { functionRegex } from './regex'
import { parseParameters } from './utils'

export function parseHumanAbiFunctions<
  THAbi extends HAbi,
  TContext extends Context,
>(signatures: Narrow<THAbi>, context: TContext): ParseHAbiFunctions<THAbi> {
  const filtered = signatures.filter((val) => functionRegex.test(val))

  const result = []

  if (filtered.length === 0) {
    return filtered as ParseHAbiFunctions<THAbi>
  }

  for (let i = 0; i < filtered.length; i++) {
    const extracted = functionRegex.exec(filtered[i] as FunctionSignature)

    if (!extracted)
      throw new Error(`Error: Invalid signature provided '${filtered[i]}'`)
    const { name, parameters, mutability, returnParameters } = extracted.groups

    result.push({
      type: 'function',
      name: name ?? '',
      stateMutability: (mutability as AbiMutability) ?? 'nonpayable',
      inputs: parseHumanAbiArguments(
        parseParameters(parameters ?? ''),
        context,
      ),
      outputs: parseHumanAbiArguments(
        parseParameters(returnParameters ?? ''),
        context,
      ),
    })
  }

  return result as ParseHAbiFunctions<THAbi>
}

export function parseHumanAbiFunction<
  THAbiSignature extends string,
  TContext extends Context,
>(signature: THAbiSignature, context: TContext): AbiFunction {
  const extracted = functionRegex.exec(signature)

  if (!extracted)
    throw new Error(`Error: Invalid signature provided '${signature}'`)

  const { name, parameters, mutability, returnParameters } = extracted.groups

  return {
    type: 'function',
    name: name ?? '',
    stateMutability: (mutability as AbiMutability) ?? 'nonpayable',
    inputs: parseHumanAbiArguments(parseParameters(parameters ?? ''), context),
    outputs: parseHumanAbiArguments(
      parseParameters(returnParameters ?? ''),
      context,
    ),
  }
}
