import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiErrors } from '../habi'

export function parseHumanAbiErrors<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHAbiErrors<THAbi> {
  return signatures as ParseHAbiErrors<THAbi>
}
