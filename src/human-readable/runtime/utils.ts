import type {
  AbiType,
  SolidityArray,
  SolidityBytes,
  SolidityString,
} from '../../abi'
import {
  bytesRegex,
  bytesRegexNumbersOnly,
  execTyped,
  integerRegex,
  isTupleRegex,
  protectedKeywords,
} from '../../regex'
import { BaseError } from '../errors'
import type { Modifier, StructLookup } from '../types'

import type { FunctionModifiers, SolidityTypes } from '../types/signatures'
import { functionModifiers, indexedModifier } from '../types/signatures'
import { getParameterCacheKey, parameterCache } from './cache'

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
          modifiers: indexedModifier,
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
      abiParameters.push(
        parseAbiParameter(params[i]!, {
          structs,
          type: 'error',
        }),
      )
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
      abiParameters.push(
        parseAbiParameter(params[i]!, {
          structs,
        }),
      )
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

const abiParameterWithoutTupleRegex =
  /^(?<type>[a-zA-Z0-9_]+?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z0-9_]+))?$/
const abiParameterWithTupleRegex =
  /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z0-9_]+))?$/

type ParseOptions = {
  modifiers?: Set<Modifier>
  structs?: StructLookup
  type?: SolidityTypes
}

export function parseAbiParameter(param: string, options?: ParseOptions) {
  // optional namespace cache by `type`
  const parameterCacheKey = getParameterCacheKey(param, options?.type)
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey)!

  const isTuple = isTupleRegex.test(param)
  const match = execTyped<{
    array?: string
    modifier?: Modifier
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
  const hasIndexedModifier = options?.modifiers?.has?.('indexed') ?? false
  const isIndexed = match.modifier === 'indexed'
  // Check if any modifier exists on error, struct, or event types.
  // It is safe to not specify which `type` to check because we don't pass down the "function" or "constructor" types.
  // `parseSignature` only passes down "struct", "event", and "error" types.
  // And the exported `parseAbiParameter` only passes down the "struct" type if it has an "struct" signature as a argument.
  // Since it's assumed that it will be used to quickly get an abi spec of a given parameter
  const hasFunctionModifier =
    options?.type && functionModifiers.has(match.modifier as FunctionModifiers)
  // Check if the parameter has a valid function modifier with the correct type.
  // e.g. uint256[], string, bytes, etc.
  // Struct types are also valid
  const isValidModifier =
    functionModifiers.has(match.modifier as FunctionModifiers) &&
    isNotFunctionModifierType(match.type) &&
    !match.array

  const isInvalidName = match.name && isInvalidSolidiyName(match.name)

  if (isIndexed && !hasIndexedModifier)
    throw new BaseError('`indexed` keyword not allowed in param.', {
      details: param,
    })

  if (hasFunctionModifier) {
    throw new BaseError('Invalid ABI parameter.', {
      details: param,
      metaMessages: [
        `${match.modifier} modifier not allowed in '${options.type}' type.`,
      ],
    })
  }

  if (isValidModifier) {
    throw new BaseError('Invalid ABI parameter.', {
      details: param,
      metaMessages: [
        `${match.modifier} modifier not allowed in '${match.type}' type.`,
      ],
    })
  }

  if (isInvalidName) {
    throw new BaseError('Invalid ABI parameter.', {
      details: param,
      metaMessages: [`${match.name} is a protected Solidity keyword.`],
    })
  }

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
    if (!(options?.type === 'struct') && !isSolidityType(type))
      throw new BaseError('Unknown type.', {
        metaMessages: [`Type "${type}" is not a valid ABI type.`],
      })
  }

  const abiParameter = {
    type: `${type}${match.array ?? ''}`,
    ...name,
    ...indexed,
    ...components,
  }
  parameterCache.set(parameterCacheKey, abiParameter)
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
    if (depth !== 0)
      throw new BaseError('Unbalanced parenthesis.', {
        metaMessages: [
          `${current.trim()} has to many ${
            depth > 0 ? 'opening' : 'closing'
          } parenthesis.`,
        ],
        details: `Depth ${depth}`,
      })
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

export function isNotFunctionModifierType(
  type: string,
): type is Exclude<
  AbiType,
  SolidityString | Extract<SolidityBytes, 'bytes'> | SolidityArray
> {
  return (
    type === 'address' ||
    type === 'bool' ||
    type === 'function' ||
    bytesRegexNumbersOnly.test(type) ||
    integerRegex.test(type)
  )
}

export function isInvalidSolidiyName(name: string): name is string {
  return (
    name === 'address' ||
    name === 'bool' ||
    name === 'function' ||
    name === 'string' ||
    name === 'tuple' ||
    bytesRegex.test(name) ||
    integerRegex.test(name) ||
    protectedKeywords.test(name)
  )
}
