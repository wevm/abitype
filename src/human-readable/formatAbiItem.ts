import type {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiFallback,
  AbiFunction,
  AbiReceive,
  AbiStateMutability,
} from '../abi.js'
import {
  type FormatAbiParameters,
  formatAbiParameters,
} from './formatAbiParameters.js'

export type FormatAbiItem<TAbiItem extends Abi[number]> =
  | (TAbiItem extends AbiFunction
      ? `function ${TAbiItem['name']}(${FormatAbiParameters<
          TAbiItem['inputs']
        >})${TAbiItem['stateMutability'] extends Exclude<
          AbiStateMutability,
          'nonpayable'
        >
          ? ` ${TAbiItem['stateMutability']}`
          : ''}${TAbiItem['outputs']['length'] extends 0
          ? ''
          : ` returns (${FormatAbiParameters<TAbiItem['outputs']>})`}`
      : never)
  | (TAbiItem extends AbiEvent
      ? `event ${TAbiItem['name']}(${FormatAbiParameters<TAbiItem['inputs']>})`
      : never)
  | (TAbiItem extends AbiError
      ? `error ${TAbiItem['name']}(${FormatAbiParameters<TAbiItem['inputs']>})`
      : never)
  | (TAbiItem extends AbiConstructor
      ? `constructor(${FormatAbiParameters<
          TAbiItem['inputs']
        >})${TAbiItem['stateMutability'] extends 'payable' ? ' payable' : ''}`
      : never)
  | (TAbiItem extends AbiFallback ? 'fallback()' : never)
  | (TAbiItem extends AbiReceive ? 'receive() external payable' : never)

export function formatAbiItem<const TAbiItem extends Abi[number]>(
  abiItem: TAbiItem,
): FormatAbiItem<TAbiItem> {
  type Result = FormatAbiItem<TAbiItem>

  if (abiItem.type === 'function')
    return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${
      abiItem.stateMutability && abiItem.stateMutability !== 'nonpayable'
        ? ` ${abiItem.stateMutability}`
        : ''
    }${
      abiItem.outputs.length
        ? ` returns (${formatAbiParameters(abiItem.outputs)})`
        : ''
    }`
  else if (abiItem.type === 'event')
    return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`
  else if (abiItem.type === 'error')
    return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`
  else if (abiItem.type === 'constructor')
    return `constructor(${formatAbiParameters(abiItem.inputs)})${
      abiItem.stateMutability === 'payable' ? ' payable' : ''
    }`
  else if (abiItem.type === 'fallback') return 'fallback()' as Result
  return 'receive() external payable' as Result
}
