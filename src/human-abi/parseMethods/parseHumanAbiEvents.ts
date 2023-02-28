import type { AbiEvent } from '../../abi'
import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiEvents } from '../habi'
import type { EventSignature } from '../utils'
import { parseHumanAbiArguments } from './parseHumanAbiArguments'
import type { Context } from './parseHumanAbiArguments'
import { eventRegex } from './regex'
import { parseParameters } from './utils'

export function parseHumanAbiEvents<
  THAbi extends HAbi,
  TContext extends Context,
>(signatures: Narrow<THAbi>, context: TContext): ParseHAbiEvents<THAbi> {
  const filtered = signatures.filter((val) => eventRegex.test(val))

  const result = []

  if (filtered.length === 0) {
    return filtered as ParseHAbiEvents<THAbi>
  }

  for (let i = 0; i < filtered.length; i++) {
    const extracted = eventRegex.exec(filtered[i] as EventSignature)

    if (!extracted)
      throw new Error(`Error: Invalid signature provided '${filtered[i]}'`)
    const { name, parameters } = extracted.groups

    result.push({
      type: 'event',
      name: name ?? '',
      inputs: parseHumanAbiArguments(parseParameters(parameters), context),
    })
  }

  return result as ParseHAbiEvents<THAbi>
}

export function parseHumanAbiEvent<
  THAbiSignature extends string,
  TContext extends Context,
>(signature: THAbiSignature, context: TContext): AbiEvent {
  const extracted = eventRegex.exec(signature)

  if (!extracted)
    throw new Error(`Error: Invalid signature provided '${signature}'`)

  const { name, parameters } = extracted.groups

  return {
    type: 'event',
    name: name ?? 'nonpayable',
    inputs: parseHumanAbiArguments(parseParameters(parameters), context),
  }
}
