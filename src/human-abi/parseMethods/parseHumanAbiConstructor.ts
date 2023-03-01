import type { AbiFunction } from '../../abi'
import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiConstructor } from '../habi'
import type { AbiMutability, ConstructorSignature } from '../utils'
import { parseHumanAbiArguments } from './parseHumanAbiArguments'
import { constructorRegex } from './regex'
import { parseParameters } from './utils'

export function parseHumanAbiConstructors<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHAbiConstructor<THAbi> {
  const filtered = signatures.filter((val) => constructorRegex.test(val))

  const result = []

  if (filtered.length === 0) {
    return filtered as ParseHAbiConstructor<THAbi>
  }

  for (let i = 0; i < filtered.length; i++) {
    const extracted = constructorRegex.exec(filtered[i] as ConstructorSignature)

    if (!extracted)
      throw new Error(`Error: Invalid signature provided '${filtered[i]}'`)
    const { parameters, mutability } = extracted.groups

    result.push({
      type: 'constructor',
      stateMutability: mutability ?? 'nonpayable',
      inputs: parseHumanAbiArguments(parseParameters(parameters ?? ''), {
        parseContext: 'function',
        structTypes: new WeakSet(),
      }),
    })
  }

  return result as ParseHAbiConstructor<THAbi>
}

export function parseHumanAbiConstructor<THAbiSignature extends string>(
  signature: THAbiSignature,
): AbiFunction {
  const extracted = constructorRegex.exec(signature)

  if (!extracted)
    throw new Error(`Error: Invalid signature provided '${signature}'`)

  const { parameters, mutability } = extracted.groups

  return {
    type: 'constructor',
    stateMutability: (mutability as AbiMutability) ?? 'nonpayable',
    inputs: parseHumanAbiArguments(parseParameters(parameters ?? ''), {
      parseContext: 'function',
      structTypes: new WeakSet(),
    }),
  }
}
