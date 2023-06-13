import type { AbiEventParameter, AbiParameter } from '../abi.js'
import { execTyped } from '../regex.js'
import type { Join } from '../types.js'

/**
 * Formats {@link AbiParameter} to human-readable ABI parameter.
 *
 * @param TAbiParameter - ABI parameter
 * @returns Human-readable ABI parameter
 *
 * @example
 * type Result = FormatAbiParameter<{ type: 'address'; name: 'from'; }>
 * //   ^? type Result = 'address from'
 */
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
const tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/

/**
 * Formats {@link AbiParameter} to human-readable ABI parameter.
 *
 * @param abiParameter - ABI parameter
 * @returns Human-readable ABI parameter
 *
 * @example
 * const result = formatAbiParameter({ type: 'address', name: 'from' })
 * //    ^? const result: 'address from'
 */
export function formatAbiParameter<
  const TAbiParameter extends AbiParameter | AbiEventParameter,
>(abiParameter: TAbiParameter): FormatAbiParameter<TAbiParameter> {
  type Result = FormatAbiParameter<TAbiParameter>

  let type = abiParameter.type
  if (tupleRegex.test(abiParameter.type) && 'components' in abiParameter) {
    type = '('
    const length = abiParameter.components.length as number
    for (let i = 0; i < length; i++) {
      const component = abiParameter.components[i]!
      type += formatAbiParameter(component)
      if (i < length - 1) type += ', '
    }
    const result = execTyped<{ array?: string }>(tupleRegex, abiParameter.type)
    type += `)${result?.array ?? ''}`
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
