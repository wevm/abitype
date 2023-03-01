import type { AbiError } from '../../abi'
import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiErrors } from '../habi'
import type { ErrorSignature } from '../utils'
import { parseHumanAbiArguments } from './parseHumanAbiArguments'
import type { Context } from './parseHumanAbiArguments'
import { errorRegex } from './regex'
import { parseParameters } from './utils'

export function parseHumanAbiErrors<
  THAbi extends HAbi,
  TContext extends Context,
>(signatures: Narrow<THAbi>, context: TContext): ParseHAbiErrors<THAbi> {
  const filtered = signatures.filter((val) => errorRegex.test(val))

  const result = []

  if (filtered.length === 0) {
    return filtered as ParseHAbiErrors<THAbi>
  }

  for (let i = 0; i < filtered.length; i++) {
    const extracted = errorRegex.exec(filtered[i] as ErrorSignature)

    if (!extracted)
      throw new Error(`Error: Invalid signature provided '${filtered[i]}'`)
    const { name, parameters } = extracted.groups

    result.push({
      type: 'error',
      name: name ?? '',
      inputs: parseHumanAbiArguments(
        parseParameters(parameters ?? ''),
        context,
      ),
    })
  }

  return result as ParseHAbiErrors<THAbi>
}

export function parseHumanAbiError<
  THAbiSignature extends string,
  TContext extends Context,
>(signature: THAbiSignature, context: TContext): AbiError {
  const extracted = errorRegex.exec(signature)

  if (!extracted)
    throw new Error(`Error: Invalid signature provided '${signature}'`)

  const { name, parameters } = extracted.groups

  return {
    type: 'error',
    name: name ?? 'nonpayable',
    inputs: parseHumanAbiArguments(parseParameters(parameters ?? ''), context),
  }
}
