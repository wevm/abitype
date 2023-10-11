import { assertType, test } from 'vitest'

import type {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiFallback,
  AbiFunction,
  AbiInternalType,
  AbiParameter,
  AbiReceive,
  AbiStateMutability,
  AbiType,
  Address,
  SolidityAddress,
  SolidityArray,
  SolidityBool,
  SolidityBytes,
  SolidityFunction,
  SolidityInt,
  SolidityString,
  SolidityTuple,
  TypedData,
  TypedDataType,
} from './abi.js'
import { wagmiMintExampleAbi } from './abis/json.js'

test('Address', () => {
  assertType<Address>('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
  // @ts-expect-error No leading `0x
  assertType<Address>('A0Cf798816D4b9b9866b5330EEa46a18382f251e')
})

test('Solidity Types', () => {
  assertType<SolidityAddress>('address')

  assertType<SolidityBool>('bool')

  assertType<SolidityBytes>('bytes')
  assertType<SolidityBytes>('bytes1')
  assertType<SolidityBytes>('bytes24')
  assertType<SolidityBytes>('bytes32')
  // @ts-expect-error Greater than 32
  assertType<SolidityBytes>('bytes36')

  assertType<SolidityFunction>('function')

  assertType<SolidityString>('string')

  assertType<SolidityTuple>('tuple')

  assertType<SolidityInt>('int')
  assertType<SolidityInt>('int8')
  assertType<SolidityInt>('int32')
  assertType<SolidityInt>('int256')
  assertType<SolidityInt>('uint')
  assertType<SolidityInt>('uint8')
  assertType<SolidityInt>('uint32')
  assertType<SolidityInt>('uint256')
  // @ts-expect-error Not multiple of 8
  assertType<SolidityInt>('int6')
  // @ts-expect-error Multiple of 8 greater than 256
  assertType<SolidityInt>('uint264')

  assertType<SolidityArray>('address[]')
  assertType<SolidityArray>('uint256[]')
  assertType<SolidityArray>('string[]')
  assertType<SolidityArray>('address[5]')
  assertType<SolidityArray>('uint256[5]')
  assertType<SolidityArray>('string[5]')

  assertType<SolidityArray>('address[][]')
  assertType<SolidityArray>('uint256[][]')
  assertType<SolidityArray>('string[][]')
  assertType<SolidityArray>('address[5][]')
  assertType<SolidityArray>('uint256[5][]')
  assertType<SolidityArray>('string[5][]')
  assertType<SolidityArray>('address[][3]')
})

test('AbiType', () => {
  assertType<AbiType>('address')
  assertType<AbiType>('bool')

  assertType<AbiType>('bytes')
  assertType<AbiType>('bytes1')
  assertType<AbiType>('bytes24')
  assertType<AbiType>('bytes32')

  assertType<AbiType>('function')
  assertType<AbiType>('string')
  assertType<AbiType>('tuple')

  assertType<AbiType>('int')
  assertType<AbiType>('int8')
  assertType<AbiType>('int32')
  assertType<AbiType>('int256')
  assertType<AbiType>('uint')
  assertType<AbiType>('uint8')
  assertType<AbiType>('uint32')
  assertType<AbiType>('uint256')
})

test('AbiInternalType', () => {
  assertType<AbiInternalType>('address')
  assertType<AbiInternalType>('bytes32')
  assertType<AbiInternalType>('address payable')
  assertType<AbiInternalType>('contract ENS')
  assertType<AbiInternalType>('struct IWritingEditions.WritingEdition')
})

test('AbiParameter', () => {
  assertType<AbiParameter>({
    internalType: 'address',
    name: 'owner',
    type: 'address',
  })

  assertType<AbiParameter>({
    internalType: 'string',
    name: 'symbol',
    type: 'string',
  })

  assertType<AbiParameter>({
    name: 'foo',
    type: 'tuple',
    internalType: 'struct a',
    components: [
      {
        name: 'bar',
        type: 'tuple',
        internalType: 'struct b',
        components: [{ name: 'bar', type: 'string' }],
      },
    ],
  })

  assertType<AbiParameter>({
    components: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'symbol', type: 'string' },
      { internalType: 'string', name: 'description', type: 'string' },
      { internalType: 'string', name: 'imageURI', type: 'string' },
      { internalType: 'string', name: 'contentURI', type: 'string' },
      { internalType: 'uint256', name: 'price', type: 'uint256' },
      { internalType: 'uint256', name: 'limit', type: 'uint256' },
      {
        internalType: 'address',
        name: 'fundingRecipient',
        type: 'address',
      },
      { internalType: 'address', name: 'renderer', type: 'address' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
      { internalType: 'uint16', name: 'fee', type: 'uint16' },
    ],
    internalType: 'struct IWritingEditions.WritingEdition',
    name: 'edition',
    type: 'tuple',
  })
})

test('AbiStateMutability', () => {
  assertType<AbiStateMutability>('pure')
  assertType<AbiStateMutability>('view')
  assertType<AbiStateMutability>('nonpayable')
  assertType<AbiStateMutability>('payable')
})

test('AbiFunction', () => {
  assertType<AbiFunction>({
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  })

  assertType<AbiFunction>({
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    // @ts-expect-error Must be function type
    type: 'event',
  })
})

test('AbiConstructor', () => {
  assertType<AbiConstructor>({
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  })
})
test('AbiFallback', () => {
  assertType<AbiFallback>({
    stateMutability: 'nonpayable',
    type: 'fallback',
  })
})
test('AbiReceive', () => {
  assertType<AbiReceive>({
    stateMutability: 'payable',
    type: 'receive',
  })
})

test('AbiEvent', () => {
  assertType<AbiEvent>({
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'approved', type: 'bool' },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  })
})

test('AbiError', () => {
  assertType<AbiError>({
    type: 'error',
    inputs: [
      { name: 'available', type: 'uint256' },
      { name: 'required', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  })
})

test('Abi', () => {
  assertType<Abi>(wagmiMintExampleAbi)
  assertType<Abi>([
    {
      type: 'error',
      inputs: [
        { name: 'available', type: 'uint256' },
        { name: 'required', type: 'uint256' },
      ],
      name: 'InsufficientBalance',
    },
    {
      type: 'event',
      inputs: [
        { name: 'a', type: 'uint256', indexed: true },
        { name: 'b', type: 'bytes32', indexed: false },
      ],
      name: 'Event',
    },
    {
      type: 'event',
      inputs: [
        { name: 'a', type: 'uint256', indexed: true },
        { name: 'b', type: 'bytes32', indexed: false },
      ],
      name: 'Event2',
    },
    {
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'a', type: 'uint256' }],
      name: 'foo',
      outputs: [],
    },
  ])
})

test('TypedDataType', () => {
  assertType<TypedDataType>('address')
  assertType<TypedDataType>('bool')
  assertType<TypedDataType>('int256')
  assertType<TypedDataType>('string')
  assertType<TypedDataType>('uint256')

  // @ts-expect-error tuple not allowed
  assertType<TypedDataType>('tuple')
  // @ts-expect-error tuple not allowed
  assertType<TypedDataType>('tuple[]')
})

test('TypedData', () => {
  assertType<TypedData>({
    Foo: [{ name: 'bar', type: 'string' }],
  })
  assertType<TypedData>({
    // @ts-expect-error Cannot use `AbiType` as `TypedData` key
    address: [{ name: 'bar', type: 'string' }],
  })
})
