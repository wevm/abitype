import type { Modifier, StructLookup } from '../types'
import { structTypeRegex } from './structs'

const abiParameterRegex =
  /^(?<type>[a-zA-Z0-9_(),[\]]+?)(\s(?<modifier>calldata|indexed|memory|storage{1}))?(\s(?<name>[a-zA-Z0-9_]+))?$/
const isTupleRegex = /^\(.+?\).*?$/

export function parseAbiParameter(
  param: string,
  options?: {
    modifier?: Modifier
    structs?: StructLookup
  },
) {
  if (isTupleRegex.test(param)) {
    return {
      type: 'tuple',
      components: [],
    }
  }

  const match = abiParameterRegex.exec(param)
  const groups = match?.groups as
    | { name?: string; type: string; modifier?: string }
    | undefined
  if (!groups) throw new Error(`Invalid ABI parameter "${param}"`)

  // Check if `indexed` modifier exists, but is not allowed (e.g function parameters, struct properties)
  const hasIndexedModifier = options?.modifier?.includes('indexed')
  const isIndexed = groups.modifier === 'indexed'
  if (isIndexed && !hasIndexedModifier)
    throw new Error(`\`indexed\` not allowed in "${param}"`)

  const name = groups.name ? { name: groups.name } : {}
  const indexed = hasIndexedModifier && isIndexed ? { indexed: true } : {}

  const structs = options?.structs ?? {}
  if (structTypeRegex.test(groups.type)) {
    const match = structTypeRegex.exec(groups.type)
    const structGroups = match?.groups as
      | { type: string; array?: string }
      | undefined
    if (structGroups && structGroups.type in structs) {
      return {
        type: `tuple${structGroups.array ?? ''}`,
        components: structs[structGroups.type],
        ...name,
        ...indexed,
      }
    }
  }

  return {
    type: groups.type,
    ...name,
    ...indexed,
  }
}
