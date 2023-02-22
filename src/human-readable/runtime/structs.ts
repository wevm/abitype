import type { AbiParameter } from '../../abi'
import type { StructLookup } from '../types'
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

// TODO: Make so this includes real Solidity types (e.g. `(u)?int(\d+)?`) instead of allowing all types (e.g. `[a-zA-Z0-9_]+?`)
export const structTypeRegex =
  /^(?<type>[a-zA-Z0-9_]+?)(?<array>(\[\d*?\])+?)?$/

function resolveStructs(
  abiParameters: readonly (AbiParameter & { indexed?: true })[],
  structs: StructLookup,
) {
  const components: AbiParameter[] = []
  for (const abiParameter of abiParameters) {
    if (!structTypeRegex.test(abiParameter.type)) components.push(abiParameter)
    else {
      const match = structTypeRegex.exec(abiParameter.type)
      const groups = match?.groups as { type: string; array?: string }
      if (groups && groups.type in structs) {
        components.push({
          type: `tuple${groups.array ?? ''}`,
          components: resolveStructs(structs[groups.type] ?? [], structs),
          ...(abiParameter.name ? { name: abiParameter.name } : {}),
          ...(abiParameter.indexed ? { indexed: true } : {}),
        })
      } else {
        // TODO: Throw if `abiParameter.type` is not a Solidity type at this point.
        components.push(abiParameter)
      }
    }
  }

  return components
}
