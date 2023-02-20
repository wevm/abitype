import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiConstructor } from '../habi'

export function parseHumanAbiConstructor<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHAbiConstructor<THAbi> {
  return signatures as ParseHAbiConstructor<THAbi>
}
