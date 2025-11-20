import type { AbiItemType, AbiParameter } from '../../abi.js'
import type { StructLookup } from '../types/structs.js'

/**
 * Gets {@link parameterCache} cache key namespaced by {@link type} and {@link structs}. This prevents parameters from being accessible to types that don't allow them (e.g. `string indexed foo` not allowed outside of `type: 'event'`) and ensures different struct definitions with the same name are cached separately.
 * @param param ABI parameter string
 * @param type ABI parameter type
 * @param structs Struct definitions to include in cache key
 * @returns Cache key for {@link parameterCache}
 */
export function getParameterCacheKey(
  param: string,
  type?: AbiItemType | 'struct',
  structs?: StructLookup,
) {
  let structKey = ''
  if (structs)
    for (const struct of Object.entries(structs)) {
      if (!struct) continue
      let propertyKey = ''
      for (const property of struct[1]) {
        propertyKey += `[${property.type}${property.name ? `:${property.name}` : ''}]`
      }
      structKey += `(${struct[0]}{${propertyKey}})`
    }
  if (type) return `${type}:${param}${structKey}`
  return `${param}${structKey}`
}

/**
 * Basic cache seeded with common ABI parameter strings.
 *
 * **Note: When seeding more parameters, make sure you benchmark performance. The current number is the ideal balance between performance and having an already existing cache.**
 */
export const parameterCache = new Map<
  string,
  AbiParameter & { indexed?: boolean }
>([
  // Unnamed
  ['address', { type: 'address' }],
  ['bool', { type: 'bool' }],
  ['bytes', { type: 'bytes' }],
  ['bytes32', { type: 'bytes32' }],
  ['int', { type: 'int256' }],
  ['int256', { type: 'int256' }],
  ['string', { type: 'string' }],
  ['uint', { type: 'uint256' }],
  ['uint8', { type: 'uint8' }],
  ['uint16', { type: 'uint16' }],
  ['uint24', { type: 'uint24' }],
  ['uint32', { type: 'uint32' }],
  ['uint64', { type: 'uint64' }],
  ['uint96', { type: 'uint96' }],
  ['uint112', { type: 'uint112' }],
  ['uint160', { type: 'uint160' }],
  ['uint192', { type: 'uint192' }],
  ['uint256', { type: 'uint256' }],

  // Named
  ['address owner', { type: 'address', name: 'owner' }],
  ['address to', { type: 'address', name: 'to' }],
  ['bool approved', { type: 'bool', name: 'approved' }],
  ['bytes _data', { type: 'bytes', name: '_data' }],
  ['bytes data', { type: 'bytes', name: 'data' }],
  ['bytes signature', { type: 'bytes', name: 'signature' }],
  ['bytes32 hash', { type: 'bytes32', name: 'hash' }],
  ['bytes32 r', { type: 'bytes32', name: 'r' }],
  ['bytes32 root', { type: 'bytes32', name: 'root' }],
  ['bytes32 s', { type: 'bytes32', name: 's' }],
  ['string name', { type: 'string', name: 'name' }],
  ['string symbol', { type: 'string', name: 'symbol' }],
  ['string tokenURI', { type: 'string', name: 'tokenURI' }],
  ['uint tokenId', { type: 'uint256', name: 'tokenId' }],
  ['uint8 v', { type: 'uint8', name: 'v' }],
  ['uint256 balance', { type: 'uint256', name: 'balance' }],
  ['uint256 tokenId', { type: 'uint256', name: 'tokenId' }],
  ['uint256 value', { type: 'uint256', name: 'value' }],

  // Indexed
  [
    'event:address indexed from',
    { type: 'address', name: 'from', indexed: true },
  ],
  ['event:address indexed to', { type: 'address', name: 'to', indexed: true }],
  [
    'event:uint indexed tokenId',
    { type: 'uint256', name: 'tokenId', indexed: true },
  ],
  [
    'event:uint256 indexed tokenId',
    { type: 'uint256', name: 'tokenId', indexed: true },
  ],
])
