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
  SolAddress,
  SolArray,
  SolBool,
  SolBytes,
  SolFixed,
  SolFunction,
  SolInt,
  SolString,
  SolTuple,
} from './abi'

describe('Sol*', () => {
  it('address', () => {
    expectType<SolAddress>('address')
  })

  it('bool', () => {
    expectType<SolBool>('bool')
  })

  it('bytes', () => {
    expectType<SolBytes>('bytes')
    expectType<SolBytes>('bytes1')
    expectType<SolBytes>('bytes24')
    expectType<SolBytes>('bytes32')
    // @ts-expect-error Greater than 32
    expectType<SolBytes>('bytes36')
  })

  it('function', () => {
    expectType<SolFunction>('function')
  })

  it('string', () => {
    expectType<SolString>('string')
  })

  it('tuple', () => {
    expectType<SolTuple>('tuple')
  })

  it('int', () => {
    expectType<SolInt>('int')
    expectType<SolInt>('int8')
    expectType<SolInt>('int32')
    expectType<SolInt>('int256')
    expectType<SolInt>('uint')
    expectType<SolInt>('uint8')
    expectType<SolInt>('uint32')
    expectType<SolInt>('uint256')
    // @ts-expect-error Not multiple of 8
    expectType<SolInt>('int6')
  })

  it('fixed', () => {
    expectType<SolFixed>('fixed')
    expectType<SolFixed>('fixed8x1')
    expectType<SolFixed>('fixed128x18')
    expectType<SolFixed>('fixed168x10')

    expectType<SolFixed>('ufixed')
    expectType<SolFixed>('ufixed8x1')
    expectType<SolFixed>('ufixed128x1')
    expectType<SolFixed>('ufixed168x10')

    // @ts-expect-error M is not multiple of 8
    expectType<SolFixed>('ufixed6x18')
    // @ts-expect-error N is not between 1 and 80
    expectType<SolFixed>('ufixed8x100')
  })

  it('array', () => {
    expectType<SolArray>('address[]')
    expectType<SolArray>('string[]')
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

  expectType<AbiType>('fixed')
  expectType<AbiType>('fixed8x1')
  expectType<AbiType>('fixed128x18')
  expectType<AbiType>('ufixed')
  expectType<AbiType>('ufixed8x1')
  expectType<AbiType>('ufixed128x18')
})

test('AbiInternalType', () => {
  expectType<AbiInternalType>('address')
  expectType<AbiInternalType>('bytes32')
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
