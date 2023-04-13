import type { AbiError, AbiEvent, AbiFunction, Address } from '../../abi'
import { parseSignature } from '../../human-readable/runtime'

export function parseFunctionSelector<
  TSelector extends Address,
  TResolvedSelector extends string,
>(selector: TSelector, resolvedSelector?: TResolvedSelector): AbiFunction {
  if (resolvedSelector) {
    return parseSignature('function ' + resolvedSelector) as AbiFunction
  }

  return {
    type: 'function',
    name: selector,
    inputs: [],
    stateMutability: 'nonpayable',
    outputs: [],
  }
}

export function parseEventSelector<
  TSelector extends Address,
  TResolvedSelector extends string,
>(selector: TSelector, resolvedSelector?: TResolvedSelector): AbiEvent {
  if (resolvedSelector) {
    return parseSignature('event ' + resolvedSelector) as AbiEvent
  }

  return {
    type: 'event',
    name: selector,
    inputs: [],
  }
}

export function parseErrorSelector<
  TSelector extends Address,
  TResolvedSelector extends string,
>(selector: TSelector, resolvedSelector?: TResolvedSelector): AbiError {
  if (resolvedSelector) {
    return parseSignature('error ' + resolvedSelector) as AbiError
  }

  return {
    type: 'error',
    name: selector,
    inputs: [],
  }
}

export function parseConstructor<TBytecode extends string>(
  bytecode: TBytecode,
) {
  if (!(bytecode.match(/60033/gm) || bytecode.match(/634300/gm))) return

  return {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [],
  }
}
