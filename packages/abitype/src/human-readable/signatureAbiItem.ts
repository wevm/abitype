import type {
  AbiEvent,
  AbiEventParameter,
  AbiFunction,
  AbiParameter,
} from '../abi.js'
import type { AssertName } from '../human-readable/types/signatures.js'
import { execTyped } from '../regex.js'
import { tupleRegex } from './formatAbiParameter.js'

type ExtractArray<abiParameter extends AbiParameter | AbiEventParameter> =
  abiParameter extends {
    type: `tuple${infer array}`
  }
    ? array
    : ''

type TypesToCSV<T extends readonly (AbiParameter | AbiEventParameter)[]> =
  T extends readonly [
    infer First extends AbiParameter | AbiEventParameter,
    ...infer Rest extends readonly (AbiParameter | AbiEventParameter)[],
  ]
    ? `${First extends {
        components: infer Component extends readonly (
          | AbiParameter
          | AbiEventParameter
        )[]
      }
        ? `(${TypesToCSV<Component>})${ExtractArray<First>}`
        : First['type']}${Rest['length'] extends 0 ? '' : `,${TypesToCSV<Rest>}`}`
    : ''

/**
 * Formats an ABI item into a signature
 *
 * @param abiItem - ABI item
 * @returns A signature
 *
 * @example
 * type Result = SignatureAbiParameter({ name: 'foo', type: 'event', inputs: [{ type: 'uint256' }, { type: 'uint256' }] })
 * //   ^? type Result: foo(uint256,uint256)
 */
export type SignatureAbiItem<abiItem extends AbiFunction | AbiEvent> =
  | AbiFunction
  | AbiEvent extends abiItem
  ? string
  : `${AssertName<abiItem['name']>}(${TypesToCSV<abiItem['inputs']>})`

/**
 * Formats an ABI function into a signature
 * Function: https://docs.soliditylang.org/en/develop/abi-spec.html#function-selector
 * Event: https://docs.soliditylang.org/en/develop/abi-spec.html#events
 *
 * @param abiItem - ABI item
 * @returns A signature
 *
 * @example
 * const signatureAbi = signatureAbiItem({ name: 'foo', type: 'event', inputs: [{ type: 'uint256' }, { type: 'uint256' }] })
 * //    ^? const signatureAbiItem: foo(uint256,uint256)
 */
export function signatureAbiItem<const abiItem extends AbiFunction | AbiEvent>(
  abiItem: abiItem,
): SignatureAbiItem<abiItem> {
  return `${abiItem.name}(${abiItem.inputs.map((param) => signatureAbiParameter(param)).join(',')})` as SignatureAbiItem<abiItem>
}

/**
 * Formats an ABI parameter into a piece of a signature
 *
 * @param abiParameter - ABI parameter
 * @returns A piece of a signature
 *
 * @example
 * type Result = SignatureAbiParameter({ type: 'uint256' })
 * //   ^? type Result: uint256
 */
export type SignatureAbiParameter<
  abiParameter extends AbiParameter | AbiEventParameter,
> = TypesToCSV<[abiParameter]>[0]

/**
 * Formats an ABI parameter into a piece of a signature
 *
 * @param abiParameter - ABI parameter
 * @returns A piece of a signature
 *
 * @example
 * const signatureAbi = signatureAbiParameter({ type: 'uint256' })
 * //    ^? const signatureAbiItem: uint256
 */
export function signatureAbiParameter<
  const abiParameter extends AbiParameter | AbiEventParameter,
>(abiParameter: abiParameter): SignatureAbiParameter<abiParameter> {
  let type = abiParameter.type
  if (tupleRegex.test(abiParameter.type) && 'components' in abiParameter) {
    type = '('
    const length = abiParameter.components.length as number
    for (let i = 0; i < length; i++) {
      const component = abiParameter.components[i]!
      type += signatureAbiParameter(component)
      if (i < length - 1) type += ','
    }
    const result = execTyped<{ array?: string }>(tupleRegex, abiParameter.type)
    type += `)${result?.array ?? ''}`
    return signatureAbiParameter({
      ...abiParameter,
      type,
    }) as SignatureAbiParameter<abiParameter>
  }
  return abiParameter.type
}
