import type { AbiFunction } from '../../abi'
import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiFallbacks } from '../habi'
import type { FallbacksSignature } from '../utils'
import { fallbackRegex, receiveRegex } from './regex'

export function parseHumanAbiFallbacks<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHAbiFallbacks<THAbi> {
  const fallbackSignatures = signatures.filter(
    (val) => fallbackRegex.test(val) || receiveRegex.test(val),
  )

  if (fallbackSignatures.length === 0) return [] as ParseHAbiFallbacks<THAbi>

  const abiObjects = []

  for (let i = 0; i < fallbackSignatures.length; i++) {
    abiObjects.push(
      parseHumanAbiFallback(fallbackSignatures[i] as FallbacksSignature),
    )
  }

  return abiObjects as ParseHAbiFallbacks<THAbi>
}

export function parseHumanAbiFallback(signature: string): AbiFunction {
  if (fallbackRegex.test(signature))
    return {
      type: 'fallback',
      stateMutability: 'nonpayable',
    }

  if (receiveRegex.test(signature)) {
    return {
      type: 'receive',
      stateMutability: 'payable',
    }
  }

  throw new Error(`Invalid signature: ${signature}`)
}
