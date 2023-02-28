import type { Narrow } from '../../narrow'
import type { HAbi } from '../habi'
import type { AbiArgsWithTuple, StructSignature } from '../utils'
import { parseHumanAbiConstructor } from './parseHumanAbiConstructor'
import { parseHumanAbiError } from './parseHumanAbiErrors'
import { parseHumanAbiEvent } from './parseHumanAbiEvents'
import { parseHumanAbiFallback } from './parseHumanAbiFallbacks'
import { parseHumanAbiFunction } from './parseHumanAbiFunctions'
import {
  constructorRegex,
  errorRegex,
  eventRegex,
  fallbackRegex,
  functionRegex,
  receiveRegex,
  structRegex,
} from './regex'
import { createStructObject } from './utils'

export function parseHumanAbiSignature<
  TSignature extends string,
  TStruct extends Record<string, AbiArgsWithTuple[]>,
>(signature: TSignature, structs?: TStruct) {
  if (functionRegex.test(signature)) {
    return parseHumanAbiFunction(signature, {
      structs: structs,
      parseContext: 'function',
      structTypes: new WeakSet(),
    })
  }

  if (eventRegex.test(signature)) {
    return parseHumanAbiEvent(signature, {
      structs: structs,
      parseContext: 'event',
      structTypes: new WeakSet(),
    })
  }

  if (errorRegex.test(signature)) {
    return parseHumanAbiError(signature, {
      structs: structs,
      parseContext: 'error',
      structTypes: new WeakSet(),
    })
  }

  if (constructorRegex.test(signature)) {
    return parseHumanAbiConstructor(signature)
  }

  if (fallbackRegex.test(signature) || receiveRegex.test(signature)) {
    return parseHumanAbiFallback(signature)
  }

  throw new Error(`Error: Invalid signature '${signature}'`)
}

export type NonStructHAbi = Exclude<HAbi[number], StructSignature>[]
export function parseHumanAbiSignatures<TSignatures extends HAbi>(
  signatures: Narrow<TSignatures>,
) {
  const filtered: string[] = signatures.filter((val: string) =>
    structRegex.test(val),
  )
  const signaturesWithoutStructs = signatures.filter(
    (val: string) => !filtered.includes(val),
  ) as NonStructHAbi
  const structObject = createStructObject(filtered as StructSignature[])

  const result = []

  for (let i = 0; i < signaturesWithoutStructs.length; i++) {
    result.push(
      parseHumanAbiSignature(
        signaturesWithoutStructs[i] as NonStructHAbi[number],
        structObject,
      ),
    )
  }

  return result
}
