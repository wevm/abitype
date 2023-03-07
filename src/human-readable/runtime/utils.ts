import type {
  AbiItemType,
  AbiType,
  SolidityArray,
  SolidityBytes,
  SolidityString,
  SolidityTuple,
} from '../../abi'
import { BaseError } from '../../errors'
import { bytesRegex, execTyped, integerRegex, isTupleRegex } from '../../regex'
import type { FunctionModifier, Modifier, StructLookup } from '../types'
import { getParameterCacheKey, parameterCache } from './cache'
import {
  eventModifiers,
  execConstructorSignature,
  execErrorSignature,
  execEventSignature,
  execFunctionSignature,
  functionModifiers,
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
          modifiers: functionModifiers,
          structs,
          type: 'function',
        }),
      )
    }

    const outputs = []
    if (match.returns) {
      const outputParams = splitParameters(match.returns)
      const outputLength = outputParams.length
      for (let i = 0; i < outputLength; i++) {
        outputs.push(
          parseAbiParameter(outputParams[i]!, {
            modifiers: functionModifiers,
            structs,
            type: 'function',
          }),
        )
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
          modifiers: eventModifiers,
          structs,
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
        parseAbiParameter(params[i]!, { structs, type: 'error' }),
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
        parseAbiParameter(params[i]!, { structs, type: 'constructor' }),
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
  type?: AbiItemType
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

  if (match.name && isProtectedSolidityKeyword(match.name))
    throw new BaseError('Invalid ABI parameter.', {
      details: param,
      metaMessages: [
        `"${match.name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`,
      ],
    })

  const name = match.name ? { name: match.name } : {}
  const indexed = match.modifier === 'indexed' ? { indexed: true } : {}
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
      components_.push(parseAbiParameter(params[i]!, { structs }))
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

  if (match.modifier) {
    // Check if modifier exists, but is not allowed (e.g. `indexed` in `functionModifiers`)
    if (!options?.modifiers?.has?.(match.modifier))
      throw new BaseError('Invalid ABI parameter.', {
        details: param,
        metaMessages: [
          `Modifier "${match.modifier}" not allowed${
            options?.type ? ` in "${options.type}" type` : ''
          }.`,
        ],
      })

    // Check if resolved `type` is valid if there is a function modifier
    if (
      functionModifiers.has(match.modifier as FunctionModifier) &&
      !isValidDataLocation(type, !!match.array)
    )
      throw new BaseError('Invalid ABI parameter.', {
        details: param,
        metaMessages: [
          `Modifier "${match.modifier}" not allowed${
            options?.type ? ` in "${options.type}" type` : ''
          }.`,
          `Data location can only be specified for array, struct, or mapping types, but "${match.modifier}" was given.`,
        ],
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
      throw new BaseError('Unbalanced parentheses.', {
        metaMessages: [
          `"${current}" has too many ${
            depth > 0 ? 'opening' : 'closing'
          } parentheses.`,
        ],
        details: `Depth "${depth}"`,
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
): type is Exclude<AbiType, SolidityTuple | SolidityArray> {
  return (
    type === 'address' ||
    type === 'bool' ||
    type === 'function' ||
    type === 'string' ||
    bytesRegex.test(type) ||
    integerRegex.test(type)
  )
}

const protectedKeywordsRegex =
  /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/

export function isProtectedSolidityKeyword(name: string) {
  return (
    name === 'address' ||
    name === 'bool' ||
    name === 'function' ||
    name === 'string' ||
    name === 'tuple' ||
    bytesRegex.test(name) ||
    integerRegex.test(name) ||
    protectedKeywordsRegex.test(name)
  )
}

export function isValidDataLocation(
  type: string,
  isArray: boolean,
): type is Exclude<
  AbiType,
  SolidityString | Extract<SolidityBytes, 'bytes'> | SolidityArray
> {
  return isArray || type === 'bytes' || type === 'string' || type === 'tuple'
}
