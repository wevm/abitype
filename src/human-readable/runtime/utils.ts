import type { AbiType, SolidityArray } from '../../abi'
import { bytesRegex, execTyped, integerRegex, isTupleRegex } from '../../regex'
import { BaseError } from '../errors'
import type { Modifier, StructLookup } from '../types'
import { createParameterCache, getParameterCacheKey } from './cache'
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
    if (!match)
      throw new BaseError('Invalid function signature.', {
        details: signature,
      })
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
    if (!match)
      throw new BaseError('Invalid event signature.', {
        details: signature,
      })
    const params = splitParameters(match.parameters)
    const abiParameters = []
    const length = params.length
    for (let i = 0; i < length; i++) {
      abiParameters.push(
        parseAbiParameter(params[i]!, {
          structs,
          modifiers: ['indexed'],
          type: 'event',
        }),
      )
    }
    return { name: match.name, type: 'event', inputs: abiParameters }
  }

  if (isErrorSignature(signature)) {
    const match = execErrorSignature(signature)
    if (!match)
      throw new BaseError('Invalid error signature.', {
        details: signature,
      })
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
    if (!match)
      throw new BaseError('Invalid constructor signature.', {
        details: signature,
      })
    const params = splitParameters(match.parameters)
    const abiParameters = []
    const length = params.length
    for (let i = 0; i < length; i++) {
      abiParameters.push(parseAbiParameter(params[i]!, { structs }))
    }
    return {
      type: 'constructor',
      stateMutability: match.stateMutability ?? 'nonpayable',
      inputs: abiParameters,
    }
  }

  if (isFallbackSignature(signature)) return { type: 'fallback' }
  if (isReceiveSignature(signature))
    return {
      type: 'receive',
      stateMutability: 'payable',
    }

  throw new BaseError('Unknown signature.', {
    details: signature,
  })
}

const abiParameterCache = createParameterCache()
const abiParameterWithoutTupleRegex =
  /^(?<type>[a-zA-Z0-9_]+?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z0-9_]+))?$/
const abiParameterWithTupleRegex =
  /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z0-9_]+))?$/

type ParseOptions = {
  modifiers?: Modifier | readonly Modifier[]
  structs?: StructLookup
  type?: 'constructor' | 'error' | 'event' | 'function' | 'struct'
}

export function parseAbiParameter(param: string, options?: ParseOptions) {
  // optional namespace cache by `type`
  const paramKey = getParameterCacheKey(param, options?.type)
  if (abiParameterCache.has(paramKey)) return abiParameterCache.get(paramKey)!

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
  if (!match)
    throw new BaseError('Invalid ABI parameter.', {
      details: param,
    })

  // Check if `indexed` modifier exists, but is not allowed (e.g function parameters, struct properties)
  const hasIndexedModifier = options?.modifiers?.includes('indexed') ?? false
  const isIndexed = match.modifier === 'indexed'
  if (isIndexed && !hasIndexedModifier)
    throw new BaseError('`indexed` keyword not allowed in param.', {
      details: param,
    })

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
  } else {
    type = match.type
    if (!(options?.type === 'struct') && !isSolidityType(type)) {
      throw new BaseError('Unknown type.', {
        metaMessages: [`Type "${type}" is not a valid ABI type.`],
      })
    }
  }

  const abiParameter = {
    type: `${type}${match.array ?? ''}`,
    ...name,
    ...indexed,
    ...components,
  }
  abiParameterCache.set(paramKey, abiParameter)
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

export function isSolidityType(
  type: string,
): type is Exclude<AbiType, SolidityArray> {
  return (
    type === 'address' ||
    type === 'bool' ||
    type === 'function' ||
    type === 'string' ||
    type === 'tuple' ||
    bytesRegex.test(type) ||
    integerRegex.test(type)
  )
}
