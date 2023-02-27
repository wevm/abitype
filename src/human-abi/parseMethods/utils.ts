import type { AbiArgs, AbiArgsWithTuple } from '../utils'

export function parseParameters(parameters: string): AbiArgsWithTuple[] {
  parameters = parameters.trim()

  let buildString = ''
  let depth = 0

  const result = []

  for (let i = 0; i < parameters.length; i++) {
    if (depth === 0 && parameters[i] === ',') {
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

  return result as AbiArgs[]
}
