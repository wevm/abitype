import type { Narrow } from '../../narrow'
import type { ParseHAbiSignature } from '../habi'

export function parseHumanAbiSignature<TSignature extends string>(
  signature: Narrow<TSignature>,
): ParseHAbiSignature<TSignature> {
  return signature as ParseHAbiSignature<TSignature>
}
