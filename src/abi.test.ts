import { describe, it, test } from 'vitest'

import { expectType, wagmiMintExampleAbi } from '../test'

import {
  Abi,
  AbiError,
  AbiEvent,
  AbiFunction,
  AbiInternalType,
  AbiParameter,
  AbiParameterType,
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
} from './abi'

describe('Sol*', () => {
  it('address', () => {
    expectType<SolidityAddress>('address')
  })

  it('bool', () => {
    expectType<SolidityBool>('bool')
  })

  it('bytes', () => {
    expectType<SolidityBytes>('bytes')
    expectType<SolidityBytes>('bytes1')
    expectType<SolidityBytes>('bytes24')
    expectType<SolidityBytes>('bytes32')
    // @ts-expect-error Greater than 32
    expectType<SolidityBytes>('bytes36')
  })

  it('function', () => {
    expectType<SolidityFunction>('function')
  })

  it('string', () => {
    expectType<SolidityString>('string')
  })

  it('tuple', () => {
    expectType<SolidityTuple>('tuple')
  })

  it('int', () => {
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
  })

  it('array', () => {
    expectType<SolidityArray>('address[]')
    expectType<SolidityArray>('string[]')
    expectType<SolidityArray>('address[4]')
    expectType<SolidityArray>('string[4]')
    // @ts-expect-error Out of fixed array range
    expectType<SolidityArray>('string[100]')
  })
})

test('Address', () => {
  expectType<Address>('0xA0Cf798816D4b9b9866b5330EEa46a18382f251e')
  // @ts-expect-error No leading `0x
  expectType<Address>('A0Cf798816D4b9b9866b5330EEa46a18382f251e')
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

describe('AbiParameter', () => {
  it('type other than tuple', () => {
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
  })

  it('tuple', () => {
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
})

test('AbiParameterType', () => {
  expectType<AbiParameterType>('inputs')
  expectType<AbiParameterType>('outputs')
})

test('StateMutability', () => {
  expectType<AbiStateMutability>('pure')
  expectType<AbiStateMutability>('view')
  expectType<AbiStateMutability>('nonpayable')
  expectType<AbiStateMutability>('payable')
})

describe('AbiFunction', () => {
  it('function', () => {
    expectType<AbiFunction>({
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'pure',
      type: 'function',
    })
  })

  it('constructor', () => {
    expectType<AbiFunction>({
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    })
  })

  it('fallback', () => {
    expectType<AbiFunction>({
      stateMutability: 'nonpayable',
      type: 'fallback',
    })
  })

  it('receive', () => {
    expectType<AbiFunction>({
      stateMutability: 'payable',
      type: 'receive',
    })
  })

  it('event does not match', () => {
    expectType<AbiFunction>({
      inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
      name: 'tokenURI',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'pure',
      // @ts-expect-error Must be function type
      type: 'event',
    })
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

describe('Abi', () => {
  it('const assertion', () => {
    expectType<Abi>(wagmiMintExampleAbi)
  })

  it('no const assertion', () => {
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
})
