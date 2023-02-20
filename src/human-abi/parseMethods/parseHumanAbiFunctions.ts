import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiFunctions } from '../habi'

export function parseHumanAbiFunctions<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHAbiFunctions<THAbi> {
  return signatures as ParseHAbiFunctions<THAbi>
}
