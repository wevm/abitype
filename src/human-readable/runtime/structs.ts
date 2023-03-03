import type { AbiParameter } from '../../abi'
import { execTyped, isTupleRegex, typeWithoutTupleRegex } from '../../regex'
import { BaseError } from '../errors'
import type { StructLookup } from '../types'
import { execStructSignature, isStructSignature } from './signatures'
import { parseAbiParameter, validateSolidityType } from './utils'

export function parseStructs(signatures: readonly string[]) {
  // Create "shallow" version of each struct (and filter out non-structs or invalid structs)
  const shallowStructs: StructLookup = {}
  const signaturesLength = signatures.length
  for (let i = 0; i < signaturesLength; i++) {
    const signature = signatures[i]!
    if (!isStructSignature(signature)) continue

    const match = execStructSignature(signature)
    if (!match)
      throw new BaseError('Invalid struct signature.', {
        details: signature,
      })
    const properties = match.properties.split(';')

    const components: AbiParameter[] = []
    const propertiesLength = properties.length
    for (let k = 0; k < propertiesLength; k++) {
      const property = properties[k]!
      const trimmed = property.trim()
      if (!trimmed) continue
      const abiParameter = parseAbiParameter(trimmed, {
        parseContext: 'structs',
      })
      components.push(abiParameter)
    }

    if (!components.length)
      throw new BaseError('Invalid struct signature.', {
        details: signature,
        metaMessages: ['No properties exist.'],
      })
    shallowStructs[match.name] = components
  }

  // Resolve nested structs inside each parameter
  const resolvedStructs: StructLookup = {}
  const entries = Object.entries(shallowStructs)
  const entriesLength = entries.length
  for (let i = 0; i < entriesLength; i++) {
    const [name, parameters] = entries[i]!
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs)
  }

  return resolvedStructs
}

function resolveStructs(
  abiParameters: readonly (AbiParameter & { indexed?: true })[],
  structs: StructLookup,
  ancestors = new Set<string>(),
) {
  const components: AbiParameter[] = []
  const length = abiParameters.length
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i]!
    const isTuple = isTupleRegex.test(abiParameter.type)
    if (isTuple) components.push(abiParameter)
    else {
      const match = execTyped<{ array?: string; type: string }>(
        typeWithoutTupleRegex,
        abiParameter.type,
      )
      if (!match?.type)
        throw new BaseError('Invalid ABI parameter.', {
          details: JSON.stringify(abiParameter, null, 2),
          metaMessages: ['ABI parameter type is invalid.'],
        })

      const { array, type } = match
      if (type in structs) {
        if (ancestors.has(type))
          throw new BaseError('Circular reference detected.', {
            metaMessages: [`Struct "${type}" is a circular reference.`],
          })

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
        if (validateSolidityType(type)) components.push(abiParameter)
        else
          throw new BaseError('Unknown type.', {
            metaMessages: [
              `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`,
            ],
          })
      }
    }
  }

  return components
}
