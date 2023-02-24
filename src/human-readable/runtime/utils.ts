import type { AbiParameter } from '../../abi'
import type { Modifier, StructLookup } from '../types'
import {
  abiParameterWithTupleRegex,
  abiParameterWithoutTupleRegex,
  execTyped,
  isTupleRegex,
} from './regex'
import {
  execConstructorSignature,
  execErrorSignature,
  execEventSignature,
  execFunctionSignature,
  isConstructorSignature,
  isErrorSignature,
  isEventSignature,
  isFallbackSignature,
  isFunctionSignature,
  isReceiveSignature,
} from './signatures'

export function parseSignature(signature: string, structs: StructLookup = {}) {
  if (isFunctionSignature(signature)) {
    const match = execFunctionSignature(signature)
    if (!match) throw new Error(`Invalid function signature "${signature}"`)
    const inputParams = splitParameters(match.parameters)
    const inputs = []
    const inputLength = inputParams.length
    for (let i = 0; i < inputLength; i++) {
      inputs.push(
        parseAbiParameter(inputParams[i]!, {
          structs,
          modifiers: ['calldata', 'memory', 'storage'],
        }),
      )
    }

    const outputs = []
    if (match.returns) {
      const outputParams = splitParameters(match.returns)
      const outputLength = outputParams.length
      for (let i = 0; i < outputLength; i++) {
        outputs.push(parseAbiParameter(outputParams[i]!, { structs }))
      }
    }

    return {
      name: match.name,
      type: 'function',
      stateMutability: match.stateMutability ?? 'nonpayable',
      inputs,
      outputs,
    }
  }

  if (isEventSignature(signature)) {
    const match = execEventSignature(signature)
    if (!match) throw new Error(`Invalid event signature "${signature}"`)
    const params = splitParameters(match.parameters)
    const abiParameters = []
    const length = params.length
    for (let i = 0; i < length; i++) {
      abiParameters.push(
        parseAbiParameter(params[i]!, { structs, modifiers: ['indexed'] }),
      )
    }
    return { name: match.name, type: 'event', inputs: abiParameters }
  }

  if (isErrorSignature(signature)) {
    const match = execErrorSignature(signature)
    if (!match) throw new Error(`Invalid error signature "${signature}"`)
    const params = splitParameters(match.parameters)
    const abiParameters = []
    const length = params.length
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i]!, { structs }))
    }
    return { name: match.name, type: 'error', inputs: abiParameters }
  }

  if (isConstructorSignature(signature)) {
    const match = execConstructorSignature(signature)
    if (!match) throw new Error(`Invalid constructor signature "${signature}"`)
    const params = splitParameters(match.parameters)
    const abiParameters = []
    const length = params.length
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i]!, { structs }))
    }
    return {
      type: 'constructor',
      stateMutability: 'nonpayable',
      inputs: abiParameters,
    }
  }

  if (isFallbackSignature(signature)) return { type: 'fallback' }
  if (isReceiveSignature(signature))
    return {
      type: 'receive',
      stateMutability: 'payable',
    }

  throw new Error(`Unknown signature "${signature}"`)
}

const abiParameterCache = new Map<string, AbiParameter>()

type ParseOptions = {
  modifiers?: Modifier | readonly Modifier[]
  structs?: StructLookup
}

export function parseAbiParameter(param: string, options?: ParseOptions) {
  if (abiParameterCache.has(param)) return abiParameterCache.get(param)!

  const isTuple = isTupleRegex.test(param)
  const match = execTyped<{
    array?: string
    modifier?: string
    name?: string
    type: string
  }>(
    isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex,
    param,
  )
  if (!match) throw new Error(`Invalid ABI parameter "${param}"`)

  // Check if `indexed` modifier exists, but is not allowed (e.g function parameters, struct properties)
  const hasIndexedModifier = options?.modifiers?.includes('indexed')
  const isIndexed = match.modifier === 'indexed'
  if (isIndexed && !hasIndexedModifier)
    throw new Error(`\`indexed\` not allowed in "${param}"`)

  const name = match.name ? { name: match.name } : {}
  const indexed = hasIndexedModifier && isIndexed ? { indexed: true } : {}
  const structs = options?.structs ?? {}
  let type: string
  let components = {}
  if (isTuple) {
    type = 'tuple'
    const params = splitParameters(match.type)
    const components_ = []
    const length = params.length
    for (let i = 0; i < length; i++) {
      // remove `modifiers` from `options` to prevent from being added to tuple components
      components_.push(
        parseAbiParameter(params[i]!, { structs: options?.structs }),
      )
    }
    components = { components: components_ }
  } else if (match.type in structs) {
    type = 'tuple'
    components = { components: structs[match.type] }
  } else type = match.type

  const abiParameter = {
    type: `${type}${match.array ?? ''}`,
    ...name,
    ...indexed,
    ...components,
  }
  abiParameterCache.set(param, abiParameter)
  return abiParameter
}

// s/o latika for this
export function splitParameters(
  params: string,
  result: string[] = [],
  current = '',
  depth = 0,
): readonly string[] {
  if (params === '') {
    if (current === '') return result
    return [...result, current.trim()]
  }

  const length = params.length
  for (let i = 0; i < length; i++) {
    const char = params[i]
    const tail = params.slice(i + 1)
    switch (char) {
      case ',':
        return depth === 0
          ? splitParameters(tail, [...result, current.trim()])
          : splitParameters(tail, result, `${current}${char}`, depth)
      case '(':
        return splitParameters(tail, result, `${current}${char}`, depth + 1)
      case ')':
        return splitParameters(tail, result, `${current}${char}`, depth - 1)
      default:
        return splitParameters(tail, result, `${current}${char}`, depth)
    }
  }

  return []
}
