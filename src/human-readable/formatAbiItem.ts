import type {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiEventParameter,
  AbiFallback,
  AbiFunction,
  AbiParameter,
  AbiReceive,
  AbiStateMutability,
} from '../abi.js'
import {
  type FormatAbiParameters as FormatAbiParameters_,
  formatAbiParameters,
} from './formatAbiParameters.js'

/**
 * Formats ABI item (e.g. error, event, function) into human-readable ABI item
 *
 * @param TAbiItem - ABI item
 * @returns Human-readable ABI item
 */
export type FormatAbiItem<TAbiItem extends Abi[number]> =
  Abi[number] extends TAbiItem
    ? string
    :
        | (TAbiItem extends AbiFunction
            ? AbiFunction extends TAbiItem
              ? string
              : `function ${TAbiItem['name']}(${FormatAbiParameters<
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
            ? AbiEvent extends TAbiItem
              ? string
              : `event ${TAbiItem['name']}(${FormatAbiParameters<
                  TAbiItem['inputs']
                >})`
            : never)
        | (TAbiItem extends AbiError
            ? AbiError extends TAbiItem
              ? string
              : `error ${TAbiItem['name']}(${FormatAbiParameters<
                  TAbiItem['inputs']
                >})`
            : never)
        | (TAbiItem extends AbiConstructor
            ? AbiConstructor extends TAbiItem
              ? string
              : `constructor(${FormatAbiParameters<
                  TAbiItem['inputs']
                >})${TAbiItem['stateMutability'] extends 'payable'
                  ? ' payable'
                  : ''}`
            : never)
        | (TAbiItem extends AbiFallback
            ? AbiFallback extends TAbiItem
              ? string
              : 'fallback()'
            : never)
        | (TAbiItem extends AbiReceive
            ? AbiReceive extends TAbiItem
              ? string
              : 'receive() external payable'
            : never)

type FormatAbiParameters<
  TAbiParameters extends readonly (AbiParameter | AbiEventParameter)[],
> = TAbiParameters['length'] extends 0
  ? ''
  : FormatAbiParameters_<
      TAbiParameters extends readonly [
        AbiParameter | AbiEventParameter,
        ...(readonly (AbiParameter | AbiEventParameter)[]),
      ]
        ? TAbiParameters
        : never
    >

/**
 * Formats ABI item (e.g. error, event, function) into human-readable ABI item
 *
 * @param abiItem - ABI item
 * @returns Human-readable ABI item
 */
export function formatAbiItem<const TAbiItem extends Abi[number]>(
  abiItem: TAbiItem,
): FormatAbiItem<TAbiItem> {
  type Result = FormatAbiItem<TAbiItem>
  type Params = readonly [
    AbiParameter | AbiEventParameter,
    ...(readonly (AbiParameter | AbiEventParameter)[]),
  ]

  if (abiItem.type === 'function')
    return `function ${abiItem.name}(${formatAbiParameters(
      abiItem.inputs as Params,
    )})${
      abiItem.stateMutability && abiItem.stateMutability !== 'nonpayable'
        ? ` ${abiItem.stateMutability}`
        : ''
    }${
      abiItem.outputs.length
        ? ` returns (${formatAbiParameters(abiItem.outputs as Params)})`
        : ''
    }`
  else if (abiItem.type === 'event')
    return `event ${abiItem.name}(${formatAbiParameters(
      abiItem.inputs as Params,
    )})`
  else if (abiItem.type === 'error')
    return `error ${abiItem.name}(${formatAbiParameters(
      abiItem.inputs as Params,
    )})`
  else if (abiItem.type === 'constructor')
    return `constructor(${formatAbiParameters(abiItem.inputs as Params)})${
      abiItem.stateMutability === 'payable' ? ' payable' : ''
    }`
  else if (abiItem.type === 'fallback') return 'fallback()' as Result
  return 'receive() external payable' as Result
}
