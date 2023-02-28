import type { Narrow } from '../../narrow'
import type { HAbi, ParseHumanAbi } from '../habi'
import type { StructSignature } from '../utils'
import { parseHumanAbiConstructors } from './parseHumanAbiConstructor'
import { parseHumanAbiErrors } from './parseHumanAbiErrors'
import { parseHumanAbiEvents } from './parseHumanAbiEvents'
import { parseHumanAbiFallbacks } from './parseHumanAbiFallbacks'
import { parseHumanAbiFunctions } from './parseHumanAbiFunctions'
import { structRegex } from './regex'
import { createStructObject } from './utils'

export function parseHumanAbi<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHumanAbi<THAbi> {
  const filtered: string[] = signatures.filter((val: string) =>
    structRegex.test(val),
  )

  const structObject = createStructObject(filtered as StructSignature[])
  const result = [
    ...parseHumanAbiConstructors(signatures),
    ...parseHumanAbiErrors(signatures, {
      structs: structObject,
      structTypes: new WeakSet(),
      parseContext: 'error',
    }),
    ...parseHumanAbiEvents(signatures, {
      structs: structObject,
      structTypes: new WeakSet(),
      parseContext: 'event',
    }),
    ...parseHumanAbiFunctions(signatures, {
      structs: structObject,
      structTypes: new WeakSet(),
      parseContext: 'function',
    }),
    ...parseHumanAbiFallbacks(signatures),
  ]

  return result as unknown as ParseHumanAbi<THAbi>
}
