import type { AbiParameter } from '../../abi'
import type { StructLookup } from '../types'
import { bytesRegex, integerRegex, isTupleRegex } from './regex'
import { parseAbiParameter } from './utils'

const structSignatureRegex =
  /^struct\s(?<name>[a-zA-Z0-9_]+)\s\{(?<properties>.*?)\}$/

export function parseStructs(signatures: string[]) {
  const shallowStructs: StructLookup = {}
  // Create "shallow" version of each struct (and filter out non-structs or invalid structs)
  for (const signature of signatures) {
    if (!structSignatureRegex.test(signature)) continue

    const match = structSignatureRegex.exec(signature)
    const groups = match?.groups as { name: string; properties: string }
    const properties = groups.properties.split(';')

    const components: AbiParameter[] = []
    for (const property of properties) {
      const trimmed = property.trim()
      if (!trimmed) continue
      const abiParameter = parseAbiParameter(trimmed)
      components.push(abiParameter)
    }

    if (!components.length)
      throw new Error(`Invalid struct: no properties exist for "${signature}"`)
    shallowStructs[groups.name] = components
  }

  const resolvedStructs: StructLookup = {}
  // Resolve nested structs inside each parameter
  for (const [name, parameters] of Object.entries(shallowStructs)) {
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs)
  }

  return resolvedStructs
}

const typeWithoutTupleRegex =
  /^(?<type>[a-zA-Z0-9_]+?)(?<array>(?:\[\d*?\])+?)?$/

function resolveStructs(
  abiParameters: readonly (AbiParameter & { indexed?: true })[],
  structs: StructLookup,
  ancestors = new Set<string>(),
) {
  const components: AbiParameter[] = []
  for (const abiParameter of abiParameters) {
    const isTuple = isTupleRegex.test(abiParameter.type)
    if (isTuple) components.push(abiParameter)
    else {
      const groups = typeWithoutTupleRegex.exec(abiParameter.type)?.groups
      const { array, type } = groups as { array?: string; type: string }
      if (!type) throw new Error(`Invalid ABI parameter type "${type}"`)

      if (type in structs) {
        if (ancestors.has(type))
          throw new Error(`Circular reference detected: "${type}"`)

        components.push({
          ...abiParameter,
          type: `tuple${array ?? ''}`,
          components: resolveStructs(
            structs[type] ?? [],
            structs,
            new Set([...ancestors, type]),
          ),
        })
      } else {
        if (
          type === 'address' ||
          type === 'bool' ||
          type === 'function' ||
          type === 'string' ||
          bytesRegex.test(type) ||
          integerRegex.test(type)
        )
          components.push(abiParameter)
        else throw new Error(`Invalid type "${abiParameter.type}"`)
      }
    }
  }

  return components
}
