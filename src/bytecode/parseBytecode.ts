import type { Address } from '../abi'
import {
  parseConstructor,
  parseErrorSelector,
  parseEventSelector,
  parseFunctionSelector,
} from './runtime/selectors'
import type { ParseBytecode } from './types/bytecode'

export function parseBytecode<
  TBytecode extends string,
  TResolvedSelectors extends Map<Address, string>,
>(
  bytecode: TBytecode,
  resolvedSelectors?: TResolvedSelectors,
): ParseBytecode<TBytecode> {
  const result = []

  const errorMatch = bytecode.matchAll(
    /517f(?<errorSelector>[a-fA-F0-9]{64})815260040160405180910390fd/gm,
  )

  const yulErrorMatch = bytecode.matchAll(
    /(5b|5b50)63(?<errorPushFour>[a-fA-F0-9]{8})/gm,
  )

  const eventMatch = bytecode.matchAll(
    /(16|90|91)7f(?<eventSelector>[a-fA-F0-9]{32})/gm,
  )

  const functionMatch = bytecode.matchAll(
    /8063(?<functionSelector>[a-fA-F0-9]{8})1461[a-fA-F0-9]{4}57/gm,
  )

  result.push(parseConstructor(bytecode))

  if (errorMatch) {
    for (const match of errorMatch) {
      const groups = match.groups as { errorSelector: string | undefined }

      if (groups.errorSelector === undefined) continue

      const selector = `0x${groups.errorSelector.substring(0, 8)}` as Address

      if (resolvedSelectors?.has(selector))
        result.push(
          parseErrorSelector(selector, resolvedSelectors.get(selector)),
        )

      result.push(parseErrorSelector(selector))
    }
  }

  if (yulErrorMatch) {
    for (const match of yulErrorMatch) {
      const groups = match.groups as { errorPushFour: string | undefined }

      if (groups.errorPushFour === undefined) continue

      const selector = `0x${groups.errorPushFour}` as Address

      if (resolvedSelectors?.has(selector))
        result.push(
          parseErrorSelector(selector, resolvedSelectors.get(selector)),
        )

      result.push(parseErrorSelector(selector))
    }
  }

  if (eventMatch) {
    for (const match of eventMatch) {
      const groups = match.groups as { eventSelector: string | undefined }

      if (groups.eventSelector === undefined) continue

      if (
        groups.eventSelector.includes('0000000000') ||
        groups.eventSelector.includes('ffffffffff')
      )
        continue

      const selector = `0x${groups.eventSelector.substring(0, 8)}` as Address
      if (resolvedSelectors?.has(selector))
        result.push(
          parseEventSelector(selector, resolvedSelectors.get(selector)),
        )

      result.push(parseEventSelector(selector))
    }
  }

  if (functionMatch) {
    for (const match of functionMatch) {
      const groups = match.groups as { functionSelector: string | undefined }

      if (groups.functionSelector === undefined) continue

      const selector = `0x${groups.functionSelector}` as Address

      if (resolvedSelectors?.has(selector))
        result.push(
          parseFunctionSelector(selector, resolvedSelectors.get(selector)),
        )

      result.push(parseFunctionSelector(selector))
    }
  }

  return result as unknown as ParseBytecode<TBytecode>
}
