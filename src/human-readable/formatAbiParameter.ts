import type { AbiEventParameter, AbiParameter } from '../abi.js'
import { execTyped } from '../regex.js'
import type { Join } from '../types.js'

export type FormatAbiParameter<
  TAbiParameter extends AbiParameter | AbiEventParameter,
> = TAbiParameter extends {
  name?: infer Name extends string
  type: `tuple${infer Array}`
  components: infer Components extends readonly AbiParameter[]
  indexed?: infer Indexed extends boolean
}
  ? FormatAbiParameter<
      {
        type: `(${Join<
          {
            [K in keyof Components]: FormatAbiParameter<Components[K]>
          },
          ', '
        >})${Array}`
        indexed?: Indexed
      } & (string extends Name ? unknown : { name: Name })
    >
  : `${TAbiParameter['type']}${TAbiParameter extends { indexed: true }
      ? ' indexed'
      : ''}${TAbiParameter['name'] extends infer Name extends string
      ? ` ${Name}`
      : ''}`

// https://regexr.com/7f7rv
export const tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/

export function formatAbiParameter<
  const TAbiParameter extends AbiParameter | AbiEventParameter,
>(abiParameter: TAbiParameter): FormatAbiParameter<TAbiParameter> {
  type Result = FormatAbiParameter<TAbiParameter>

  let type = abiParameter.type
  if (tupleRegex.test(abiParameter.type) && 'components' in abiParameter) {
    const result = execTyped<{ array?: string }>(tupleRegex, abiParameter.type)
    const array = result?.array ?? ''
    type = `(${abiParameter.components
      .map(formatAbiParameter)
      .join(', ')})${array}`
    return formatAbiParameter({
      ...abiParameter,
      type,
    }) as Result
  }
  // Add `indexed` to type if in `abiParameter`
  if ('indexed' in abiParameter && abiParameter.indexed)
    type = `${type} indexed`
  // Return human-readable ABI parameter
  if (abiParameter.name) return `${type} ${abiParameter.name}` as Result
  return type as Result
}
