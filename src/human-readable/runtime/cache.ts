import type { AbiParameter } from '../../abi'

export function getParameterCacheKey(param: string, type?: string) {
  if (type) return `${type}:${param}`
  return param
}
export function createAbiParameterCache() {
  return new Map<string, AbiParameter & { indexed?: boolean }>([
    ['address', { type: 'address' }],
    ['bool', { type: 'bool' }],
    ['bytes', { type: 'bytes' }],
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
    ['int', { type: 'int256' }],
    ['int256', { type: 'int256' }],
    ['bytes32', { type: 'bytes32' }],
    ['address owner', { type: 'address', name: 'owner' }],
    [
      'eventaddress indexed from',
      { type: 'address', name: 'from', indexed: true },
    ],
    ['address to', { type: 'address', name: 'to' }],
    ['eventaddress indexed to', { type: 'address', name: 'to', indexed: true }],
    ['uint tokenId', { type: 'uint256', name: 'tokenId' }],
    [
      'eventuint indexed tokenId',
      { type: 'uint256', name: 'tokenId', indexed: true },
    ],
    ['uint256 tokenId', { type: 'uint256', name: 'tokenId' }],
    [
      'eventuint256 indexed tokenId',
      { type: 'uint256', name: 'tokenId', indexed: true },
    ],
    ['uint256 balance', { type: 'uint256', name: 'balance' }],
    ['uint256 value', { type: 'uint256', name: 'value' }],
    ['bytes _data', { type: 'bytes', name: '_data' }],
    ['bytes data', { type: 'bytes', name: 'data' }],
    ['bytes signature', { type: 'bytes', name: 'signature' }],
    ['bool approved', { type: 'bool', name: 'approved' }],
    ['string name', { type: 'string', name: 'name' }],
    ['string symbol', { type: 'string', name: 'symbol' }],
    ['bytes32 hash', { type: 'bytes32', name: 'hash' }],
    ['bytes32 root', { type: 'bytes32', name: 'root' }],
    ['bytes32 r', { type: 'bytes32', name: 'r' }],
    ['bytes32 s', { type: 'bytes32', name: 's' }],
    ['uint8 v', { type: 'uint8', name: 'v' }],
    ['string tokenURI', { type: 'string', name: 'tokenURI' }],
  ])
}
