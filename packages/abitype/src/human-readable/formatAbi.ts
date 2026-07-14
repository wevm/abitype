import type { Abi } from '../abi.js'
import { type FormatAbiItem, formatAbiItem } from './formatAbiItem.js'

/**
 * Parses JSON ABI into human-readable ABI
 *
 * @param abi - ABI
 * @returns Human-readable ABI
 *
 * @deprecated Human-readable ABI utilities are moving to Ox.
 * Install [`ox`](https://oxlib.sh) and use [`Abi.format.ReturnType`](https://oxlib.sh/api/Abi/format#return-type) instead:
 * `import { Abi } from 'ox'`.
 */
export type FormatAbi<abi extends Abi | readonly unknown[]> = Abi extends abi
  ? readonly string[]
  : abi extends readonly []
    ? never
    : abi extends Abi
      ? {
          [key in keyof abi]: FormatAbiItem<abi[key]>
        }
      : readonly string[]

/**
 * Parses JSON ABI into human-readable ABI
 *
 * @param abi - ABI
 * @returns Human-readable ABI
 *
 * @deprecated Human-readable ABI utilities are moving to Ox.
 * Install [`ox`](https://oxlib.sh) and use [`Abi.format`](https://oxlib.sh/api/Abi/format) instead:
 * `import { Abi } from 'ox'`.
 */
export function formatAbi<const abi extends Abi | readonly unknown[]>(
  abi: abi,
): FormatAbi<abi> {
  const signatures = []
  const length = abi.length
  for (let i = 0; i < length; i++) {
    const abiItem = abi[i]!
    const signature = formatAbiItem(abiItem as Abi[number])
    signatures.push(signature)
  }
  return signatures as unknown as FormatAbi<abi>
}
