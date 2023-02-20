import type { Narrow } from '../../narrow'
import type { HAbi, ParseHumanAbi } from '../habi'

export function parseHumanAbi<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHumanAbi<THAbi> {
  return signatures as ParseHumanAbi<THAbi>
}
