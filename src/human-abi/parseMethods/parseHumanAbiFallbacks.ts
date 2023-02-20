import type { Narrow } from '../../narrow'
import type { HAbi, ParseHAbiFallbacks } from '../habi'

export function parseHumanAbiFallbacks<THAbi extends HAbi>(
  signatures: Narrow<THAbi>,
): ParseHAbiFallbacks<THAbi> {
  return signatures as ParseHAbiFallbacks<THAbi>
}
