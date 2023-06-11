import type { Abi } from '../abi.js'
import { type FormatAbiItem, formatAbiItem } from './formatAbiItem.js'

export type FormatAbi<TAbi extends Abi | readonly unknown[]> = Abi extends TAbi
  ? readonly string[]
  : TAbi extends Abi
  ? {
      [K in keyof TAbi]: FormatAbiItem<TAbi[K]>
    }
  : readonly string[]

export function formatAbi<const TAbi extends Abi | readonly unknown[]>(
  abi: TAbi,
): FormatAbi<TAbi> {
  const signatures = []
  const length = abi.length
  for (let i = 0; i < length; i++) {
    const abiItem = abi[i]!
    const signature = formatAbiItem(abiItem as Abi[number])
    signatures.push(signature)
  }
  return signatures as unknown as FormatAbi<TAbi>
}
