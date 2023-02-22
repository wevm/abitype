import type { AbiParameter } from '../../abi'
import type { Modifier, StructLookup } from '../types'
import { isTupleRegex } from './regex'

type ParseOptions = {
  modifiers?: Modifier | readonly Modifier[]
  structs?: StructLookup
}

const abiParameterCache = new Map<string, AbiParameter>()

export function parseAbiParameter(param: string, options?: ParseOptions) {
  if (abiParameterCache.has(param)) return abiParameterCache.get(param)!

  const isTuple = isTupleRegex.test(param)
  const groups = extractGroups(param, isTuple)
  if (!groups) throw new Error(`Invalid ABI parameter "${param}"`)

  // Check if `indexed` modifier exists, but is not allowed (e.g function parameters, struct properties)
  const hasIndexedModifier = options?.modifiers?.includes('indexed')
  const isIndexed = groups.modifier === 'indexed'
  if (isIndexed && !hasIndexedModifier)
    throw new Error(`\`indexed\` not allowed in "${param}"`)

  const name = groups.name ? { name: groups.name } : {}
  const indexed = hasIndexedModifier && isIndexed ? { indexed: true } : {}
  const structs = options?.structs ?? {}
  let type: string
  let components = {}
  if (isTuple) {
    type = 'tuple'
    const params = splitParameters(groups.type)
    const components_ = []
    for (const param of params) {
      // remove `modifiers` from `options` to prevent from being added to tuple components
      components_.push(parseAbiParameter(param, { structs: options?.structs }))
    }
    components = { components: components_ }
  } else if (groups.type in structs) {
    type = 'tuple'
    components = { components: structs[groups.type] }
  } else type = groups.type

  const abiParameter = {
    type: `${type}${groups.array ?? ''}`,
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

const abiParameterWithoutTupleRegex =
  /^(?<type>[a-zA-Z0-9_]+?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z0-9_]+))?$/
const abiParameterWithTupleRegex =
  /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z0-9_]+))?$/
function extractGroups(param: string, isTuple: boolean) {
  const regex = isTuple
    ? abiParameterWithTupleRegex
    : abiParameterWithoutTupleRegex
  const match = regex.exec(param)
  return match?.groups as {
    array?: string
    modifier?: string
    name?: string
    type: string
  }
}
