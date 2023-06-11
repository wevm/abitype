import type { AbiError, AbiEvent, AbiFunction, Address } from '../../abi.js'
import { parseSignature } from '../../human-readable/runtime/utils.js'
import type { ParseBytecodeConstructor } from '../types/index.js'

export function parseFunctionSelector<
  TSelector extends Address,
  TResolvedSelector extends string,
>(selector: TSelector, resolvedSelector?: TResolvedSelector): AbiFunction {
  if (resolvedSelector) {
    return parseSignature(`function ${resolvedSelector}`) as AbiFunction
  }

  return {
    type: 'function',
    name: selector,
    inputs: [],
    stateMutability: 'nonpayable',
    outputs: [],
  }
}

export function parseFunctionSelectors<
  TBytecode extends string,
  TResolvedSelectors extends Map<Address, string>,
>(bytecode: TBytecode, resolvedSelectors?: TResolvedSelectors) {
  const result: AbiFunction[] = []

  const functionMatch = bytecode.matchAll(
    /8063(?<functionSelector>[a-fA-F0-9]{8})1461[a-fA-F0-9]{4}57/gm,
  )

  if (functionMatch) {
    for (const match of functionMatch) {
      const groups = match.groups as { functionSelector: string | undefined }

      if (groups.functionSelector === undefined) continue

      const selector = `0x${groups.functionSelector}` as Address

      if (resolvedSelectors?.has?.(selector)) {
        result.push(
          parseFunctionSelector(selector, resolvedSelectors.get(selector)),
        )
        continue
      }

      result.push(parseFunctionSelector(selector))
    }
  }

  return result
}

export function parseEventSelector<
  TSelector extends Address,
  TResolvedSelector extends string,
>(selector: TSelector, resolvedSelector?: TResolvedSelector): AbiEvent {
  if (resolvedSelector) {
    return parseSignature(`event ${resolvedSelector}`) as AbiEvent
  }

  return {
    type: 'event',
    name: selector,
    inputs: [],
  }
}
export function parseEventSelectors<
  TBytecode extends string,
  TResolvedSelectors extends Map<Address, string>,
>(bytecode: TBytecode, resolvedSelectors?: TResolvedSelectors) {
  const result: AbiEvent[] = []

  const eventMatch = bytecode.matchAll(
    /(16|90|91)7f(?<eventSelector>[a-fA-F0-9]{32})/gm,
  )

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
      if (resolvedSelectors?.has?.(selector)) {
        result.push(
          parseEventSelector(selector, resolvedSelectors.get(selector)),
        )
        continue
      }

      result.push(parseEventSelector(selector))
    }
  }

  return result
}

export function parseErrorSelector<
  TSelector extends Address,
  TResolvedSelector extends string,
>(selector: TSelector, resolvedSelector?: TResolvedSelector): AbiError {
  if (resolvedSelector) {
    return parseSignature(`error ${resolvedSelector}`) as AbiError
  }

  return {
    type: 'error',
    name: selector,
    inputs: [],
  }
}

export function parseErrorSelectors<
  TBytecode extends string,
  TResolvedSelectors extends Map<Address, string>,
>(bytecode: TBytecode, resolvedSelectors?: TResolvedSelectors) {
  const result: AbiError[] = []

  const errorMatch = bytecode.matchAll(
    /517f(?<errorSelector>[a-fA-F0-9]{64})815260040160405180910390fd/gm,
  )

  const yulErrorMatch = bytecode.matchAll(
    /(5b|5b50)63(?<errorPushFour>[a-fA-F0-9]{8})/gm,
  )

  if (errorMatch) {
    for (const match of errorMatch) {
      const groups = match.groups as { errorSelector: string | undefined }

      if (groups.errorSelector === undefined) continue

      const selector = `0x${groups.errorSelector.substring(0, 8)}` as Address

      if (resolvedSelectors?.has?.(selector)) {
        result.push(
          parseErrorSelector(selector, resolvedSelectors.get(selector)),
        )
        continue
      }
      result.push(parseErrorSelector(selector))
    }
  }

  if (yulErrorMatch) {
    for (const match of yulErrorMatch) {
      const groups = match.groups as { errorPushFour: string | undefined }

      if (groups.errorPushFour === undefined) continue

      const selector = `0x${groups.errorPushFour}` as Address

      if (resolvedSelectors?.has(selector)) {
        result.push(
          parseErrorSelector(selector, resolvedSelectors.get(selector)),
        )
        continue
      }

      result.push(parseErrorSelector(selector))
    }
  }

  return result
}

export function parseConstructor<TBytecode extends string>(
  bytecode: TBytecode,
) {
  if (!(bytecode.match(/60033/gm) || bytecode.match(/634300/gm))) return

  return {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [],
  } as unknown as ParseBytecodeConstructor<TBytecode>
}
