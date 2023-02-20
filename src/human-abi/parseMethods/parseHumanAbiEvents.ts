import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiEvents } from '../habi'

export function parseHumanAbiEvents<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHAbiEvents<THAbi> {
  return signatures as ParseHAbiEvents<THAbi>
}
