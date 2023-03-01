import type { AbiArgsWithTuple, StructSignature } from '../utils'
import { structRegex } from './regex'

export function parseParameters(
  parameters: string,
  separator = ',',
): AbiArgsWithTuple[] {
  parameters = parameters.trim()

  let buildString = ''
  let depth = 0

  const result = []

  for (let i = 0; i < parameters.length; i++) {
    if (depth === 0 && parameters[i] === separator) {
      result.push(buildString.trim())
      buildString = ''
    } else {
      buildString = buildString + parameters[i]
      if (parameters[i] === '(') {
        depth++
      } else if (parameters[i] === ')') {
        depth--
        if (depth === -1)
          throw new Error(
            `Error: Unbalanced closing parenthesis on string '${parameters}'`,
          )
      }
    }
  }

  if (depth)
    throw new Error(
      `Error: Unbalanced opening parenthesis by ${depth} on string '${parameters}'`,
    )

  if (buildString !== '') result.push(buildString.trim())

  return result as AbiArgsWithTuple[]
}

export function createStructObject(
  structSignatures: readonly StructSignature[],
): Record<string, AbiArgsWithTuple[]> | undefined {
  if (structSignatures.length === 0) {
    return undefined
  }

  const result: Record<string, AbiArgsWithTuple[]> = {}

  for (let i = 0; i < structSignatures.length; i++) {
    const extracted = structRegex.exec(structSignatures[i] as StructSignature)

    if (!extracted) {
      throw new Error(`Error: Invalid signature '${structSignatures[i]}'`)
    }

    const { name, parameters } = extracted.groups

    const splitedParameters = parseParameters(parameters, ';')

    if (splitedParameters[splitedParameters.length - 1] === '')
      splitedParameters.pop()

    result[name] = splitedParameters as AbiArgsWithTuple[]
  }

  return result
}
