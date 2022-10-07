import { expectType, test, wagmiMintExampleAbi } from '../test'

import {
  Abi,
  AbiError,
  AbiEvent,
  AbiFunction,
  AbiInternalType,
  AbiParameter,
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
} from './abi'

test('Address', () => {
  expectType<Address>('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
  // @ts-expect-error No leading `0x
  expectType<Address>('A0Cf798816D4b9b9866b5330EEa46a18382f251e')
})

test('Solidity Types', () => {
  expectType<SolidityAddress>('address')

  expectType<SolidityBool>('bool')

  expectType<SolidityBytes>('bytes')
  expectType<SolidityBytes>('bytes1')
  expectType<SolidityBytes>('bytes24')
  expectType<SolidityBytes>('bytes32')
  // @ts-expect-error Greater than 32
  expectType<SolidityBytes>('bytes36')

  expectType<SolidityFunction>('function')

  expectType<SolidityString>('string')

  expectType<SolidityTuple>('tuple')

  expectType<SolidityInt>('int')
  expectType<SolidityInt>('int8')
  expectType<SolidityInt>('int32')
  expectType<SolidityInt>('int256')
  expectType<SolidityInt>('uint')
  expectType<SolidityInt>('uint8')
  expectType<SolidityInt>('uint32')
  expectType<SolidityInt>('uint256')
  // @ts-expect-error Not multiple of 8
  expectType<SolidityInt>('int6')
  // @ts-expect-error Multiple of 8 greater than 256
  expectType<SolidityInt>('uint264')

  expectType<SolidityArray>('address[]')
  expectType<SolidityArray>('uint256[]')
  expectType<SolidityArray>('string[]')
  expectType<SolidityArray>('address[5]')
  expectType<SolidityArray>('uint256[5]')
  expectType<SolidityArray>('string[5]')

  expectType<SolidityArray>('address[][]')
  expectType<SolidityArray>('uint256[][]')
  expectType<SolidityArray>('string[][]')
  expectType<SolidityArray>('address[5][]')
  expectType<SolidityArray>('uint256[5][]')
  expectType<SolidityArray>('string[5][]')
  expectType<SolidityArray>('address[][3]')
})

test('AbiType', () => {
  expectType<AbiType>('address')
  expectType<AbiType>('bool')

  expectType<AbiType>('bytes')
  expectType<AbiType>('bytes1')
  expectType<AbiType>('bytes24')
  expectType<AbiType>('bytes32')

  expectType<AbiType>('function')
  expectType<AbiType>('string')
  expectType<AbiType>('tuple')

  expectType<AbiType>('int')
  expectType<AbiType>('int8')
  expectType<AbiType>('int32')
  expectType<AbiType>('int256')
  expectType<AbiType>('uint')
  expectType<AbiType>('uint8')
  expectType<AbiType>('uint32')
  expectType<AbiType>('uint256')
})

test('AbiInternalType', () => {
  expectType<AbiInternalType>('address')
  expectType<AbiInternalType>('bytes32')
  expectType<AbiInternalType>('address payable')
  expectType<AbiInternalType>('contract ENS')
  expectType<AbiInternalType>('struct IWritingEditions.WritingEdition')
})

test('AbiParameter', () => {
  expectType<AbiParameter>({
    internalType: 'address',
    name: 'owner',
    type: 'address',
  })

  expectType<AbiParameter>({
    internalType: 'string',
    name: 'symbol',
    type: 'string',
  })

  expectType<AbiParameter>({
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

  expectType<AbiParameter>({
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
  expectType<AbiStateMutability>('pure')
  expectType<AbiStateMutability>('view')
  expectType<AbiStateMutability>('nonpayable')
  expectType<AbiStateMutability>('payable')
})

test('AbiFunction', () => {
  expectType<AbiFunction>({
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  })

  expectType<AbiFunction>({
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  })

  expectType<AbiFunction>({
    stateMutability: 'nonpayable',
    type: 'fallback',
  })

  expectType<AbiFunction>({
    stateMutability: 'payable',
    type: 'receive',
  })

  expectType<AbiFunction>({
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    // @ts-expect-error Must be function type
    type: 'event',
  })
})

test('AbiEvent', () => {
  expectType<AbiEvent>({
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
  expectType<AbiError>({
    type: 'error',
    inputs: [
      { name: 'available', type: 'uint256' },
      { name: 'required', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  })
})

test('Abi', () => {
  expectType<Abi>(wagmiMintExampleAbi)
  expectType<Abi>([
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
  expectType<TypedDataType>('address')
  expectType<TypedDataType>('bool')
  expectType<TypedDataType>('int256')
  expectType<TypedDataType>('string')
  expectType<TypedDataType>('uint256')

  // @ts-expect-error tuple not allowed
  expectType<TypedDataType>('tuple')
  // @ts-expect-error tuple not allowed
  expectType<TypedDataType>('tuple[]')
})

test('TypedData', () => {
  expectType<TypedData>({
    Foo: [{ name: 'bar', type: 'string' }],
  })
  expectType<TypedData>({
    // @ts-expect-error Cannot use `AbiType` as `TypedData` key
    address: [{ name: 'bar', type: 'string' }],
  })
})
