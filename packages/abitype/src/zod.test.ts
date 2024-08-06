import { describe, expect, it, test } from 'vitest'

import {
  customSolidityErrorsAbi,
  ensAbi,
  ensRegistryWithFallbackAbi,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  wethAbi,
  writingEditionsFactoryAbi,
} from './abis/json.js'
import {
  Abi,
  AbiConstructor,
  AbiError,
  AbiEvent,
  AbiEventParameter,
  AbiFallback,
  AbiFunction,
  AbiItemType,
  AbiParameter,
  AbiReceive,
  AbiStateMutability,
  Address,
  SolidityAddress,
  SolidityArray,
  SolidityArrayWithTuple,
  SolidityArrayWithoutTuple,
  SolidityBool,
  SolidityBytes,
  SolidityFunction,
  SolidityInt,
  SolidityString,
  SolidityTuple,
  TypedData,
} from './zod.js'

describe('AbiSchema', () => {
  it('returns valid schema', () => {
    expect(
      Abi.parse([
        {
          inputs: [{ type: 'address' }],
          name: 'love',
          outputs: [{ type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "inputs": [
            {
              "type": "address",
            },
          ],
          "name": "love",
          "outputs": [
            {
              "type": "uint256",
            },
          ],
          "stateMutability": "view",
          "type": "function",
        },
      ]
    `)
  })
  it('throws error for invalid schema', async () => {
    await expect(
      Abi.parseAsync([
        {
          inputs: [{ type: 'notAValidType' }],
          name: 'love',
          outputs: [{ type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ]),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ZodError: [
        {
          "validation": "regex",
          "code": "invalid_string",
          "message": "Invalid",
          "path": [
            0,
            "inputs",
            0,
            "type"
          ]
        }
      ]]
    `)
  })

  describe('behavior', () => {
    it("deprecated 'constant' field", () => {
      expect(
        Abi.parse([
          {
            constant: true,
            inputs: [{ name: 'node', type: 'bytes32' }],
            name: 'resolver',
            outputs: [{ name: 'owner', type: 'address' }],
            payable: false,
            type: 'function',
          },
        ]),
      ).toMatchInlineSnapshot(`
        [
          {
            "constant": true,
            "inputs": [
              {
                "name": "node",
                "type": "bytes32",
              },
            ],
            "name": "resolver",
            "outputs": [
              {
                "name": "owner",
                "type": "address",
              },
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function",
          },
        ]
      `)
    })

    it("deprecated 'payable' field", () => {
      expect(
        Abi.parse([
          {
            constant: false,
            inputs: [
              { name: 'node', type: 'bytes32' },
              { name: 'owner', type: 'address' },
            ],
            name: 'setOwner',
            outputs: [],
            payable: false,
            type: 'function',
          },
        ]),
      ).toMatchInlineSnapshot(`
        [
          {
            "constant": false,
            "inputs": [
              {
                "name": "node",
                "type": "bytes32",
              },
              {
                "name": "owner",
                "type": "address",
              },
            ],
            "name": "setOwner",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function",
          },
        ]
      `)
      expect(
        Abi.parse([
          {
            constant: false,
            inputs: [
              { name: 'node', type: 'bytes32' },
              { name: 'owner', type: 'address' },
            ],
            name: 'setOwner',
            outputs: [],
            payable: true,
            type: 'function',
          },
        ]),
      ).toMatchInlineSnapshot(`
        [
          {
            "constant": false,
            "inputs": [
              {
                "name": "node",
                "type": "bytes32",
              },
              {
                "name": "owner",
                "type": "address",
              },
            ],
            "name": "setOwner",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function",
          },
        ]
      `)
    })

    it('returns for receive', () => {
      expect(
        Abi.parse([
          {
            stateMutability: 'payable',
            type: 'receive',
          },
        ]),
      ).toMatchInlineSnapshot(`
        [
          {
            "stateMutability": "payable",
            "type": "receive",
          },
        ]
      `)
    })
  })
})

describe('Abi', () => {
  it('ensRegistryWithFallbackAbi', () => {
    Abi.parse(ensRegistryWithFallbackAbi)
  })
  it('nestedTupleArrayAbi', () => {
    Abi.parse(nestedTupleArrayAbi)
  })
  it('nounsAuctionHouseAbi', () => {
    Abi.parse(nounsAuctionHouseAbi)
  })
  it('wagmiMintExampleAbi', () => {
    Abi.parse(wagmiMintExampleAbi)
  })
  it('ensAbi', () => {
    Abi.parse(ensAbi)
  })
  it('wethAbi', () => {
    Abi.parse(wethAbi)
  })
  it('writingEditionsFactoryAbi', () => {
    Abi.parse(writingEditionsFactoryAbi)
  })
  it('customSolidityErrorsAbi', () => {
    Abi.parse(customSolidityErrorsAbi)
  })
})

describe('AbiFunction', () => {
  it('returns valid schema', () => {
    expect(
      AbiFunction.parse({
        inputs: [{ type: 'address' }],
        name: 'love',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      }),
    ).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "type": "address",
          },
        ],
        "name": "love",
        "outputs": [
          {
            "type": "uint256",
          },
        ],
        "stateMutability": "view",
        "type": "function",
      }
    `)
  })
  it('throws error for invalid schema', async () => {
    await expect(
      AbiFunction.parseAsync({
        inputs: [{ type: 'notAValidType' }],
        name: 'love',
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ZodError: [
        {
          "validation": "regex",
          "code": "invalid_string",
          "message": "Invalid",
          "path": [
            "inputs",
            0,
            "type"
          ]
        }
      ]]
    `)
  })

  describe('behavior', () => {
    it("deprecated 'constant' field", () => {
      expect(
        AbiFunction.parse({
          constant: true,
          inputs: [{ name: 'node', type: 'bytes32' }],
          name: 'resolver',
          outputs: [{ name: 'owner', type: 'address' }],
          payable: false,
          type: 'function',
        }),
      ).toMatchInlineSnapshot(`
        {
          "constant": true,
          "inputs": [
            {
              "name": "node",
              "type": "bytes32",
            },
          ],
          "name": "resolver",
          "outputs": [
            {
              "name": "owner",
              "type": "address",
            },
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function",
        }
      `)
    })

    it("deprecated 'payable' field", () => {
      expect(
        AbiFunction.parse({
          constant: false,
          inputs: [
            { name: 'node', type: 'bytes32' },
            { name: 'owner', type: 'address' },
          ],
          name: 'setOwner',
          outputs: [],
          payable: false,
          type: 'function',
        }),
      ).toMatchInlineSnapshot(`
        {
          "constant": false,
          "inputs": [
            {
              "name": "node",
              "type": "bytes32",
            },
            {
              "name": "owner",
              "type": "address",
            },
          ],
          "name": "setOwner",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function",
        }
      `)
      expect(
        AbiFunction.parse({
          constant: false,
          inputs: [
            { name: 'node', type: 'bytes32' },
            { name: 'owner', type: 'address' },
          ],
          name: 'setOwner',
          outputs: [],
          payable: true,
          type: 'function',
        }),
      ).toMatchInlineSnapshot(`
        {
          "constant": false,
          "inputs": [
            {
              "name": "node",
              "type": "bytes32",
            },
            {
              "name": "owner",
              "type": "address",
            },
          ],
          "name": "setOwner",
          "outputs": [],
          "payable": true,
          "stateMutability": "payable",
          "type": "function",
        }
      `)
    })
  })
})

describe('AbiConstructor', () => {
  it('returns valid schema', () => {
    expect(
      AbiConstructor.parse({
        inputs: [{ type: 'address' }],
        type: 'constructor',
        stateMutability: 'nonpayable',
      }),
    ).toMatchInlineSnapshot(`
      {
        "inputs": [
          {
            "type": "address",
          },
        ],
        "stateMutability": "nonpayable",
        "type": "constructor",
      }
    `)
  })

  describe('behavior', () => {
    it("deprecated 'payable' field", () => {
      expect(
        AbiConstructor.parse({
          inputs: [{ type: 'address' }],
          type: 'constructor',
          payable: false,
        }),
      ).toMatchInlineSnapshot(`
        {
          "inputs": [
            {
              "type": "address",
            },
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor",
        }
      `)
      expect(
        AbiConstructor.parse({
          inputs: [{ type: 'address' }],
          type: 'constructor',
          payable: true,
        }),
      ).toMatchInlineSnapshot(`
        {
          "inputs": [
            {
              "type": "address",
            },
          ],
          "payable": true,
          "stateMutability": "payable",
          "type": "constructor",
        }
      `)
    })
  })
})

describe('AbiFallback', () => {
  it('returns valid schema', () => {
    expect(
      AbiFallback.parse({
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'fallback',
      }),
    ).toMatchInlineSnapshot(`
      {
        "stateMutability": "nonpayable",
        "type": "fallback",
      }
    `)
  })

  describe('behavior', () => {
    it("deprecated 'payable' field", () => {
      expect(
        AbiFallback.parse({
          inputs: [],
          type: 'fallback',
          payable: false,
        }),
      ).toMatchInlineSnapshot(`
        {
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "fallback",
        }
      `)
      expect(
        AbiFallback.parse({
          inputs: [],
          type: 'fallback',
          payable: true,
        }),
      ).toMatchInlineSnapshot(`
        {
          "payable": true,
          "stateMutability": "payable",
          "type": "fallback",
        }
      `)
    })
  })
})

test('AbiReceive', () => {
  expect(
    AbiReceive.parse({
      stateMutability: 'payable',
      type: 'receive',
    }),
  ).toMatchInlineSnapshot(`
    {
      "stateMutability": "payable",
      "type": "receive",
    }
  `)
})

test('AbiEvent', () => {
  expect(
    AbiEvent.parse({
      type: 'event',
      name: 'TestEvent',
      inputs: [],
    }),
  ).toMatchInlineSnapshot(`
    {
      "inputs": [],
      "name": "TestEvent",
      "type": "event",
    }
  `)
})

test('AbiError', () => {
  expect(
    AbiError.parse({
      type: 'error',
      name: 'TestError',
      inputs: [],
    }),
  ).toMatchInlineSnapshot(`
    {
      "inputs": [],
      "name": "TestError",
      "type": "error",
    }
  `)
})

describe('AbiParameter', () => {
  it('returns valid schema', () => {
    expect(
      AbiParameter.parse({
        name: '',
        type: 'address',
      }),
    ).toMatchInlineSnapshot(`
      {
        "name": "",
        "type": "address",
      }
    `)
  })
})

describe('AbiEventParameter', () => {
  it('returns valid schema', () => {
    expect(
      AbiEventParameter.parse({
        type: 'address',
        indexed: true,
      }),
    ).toMatchInlineSnapshot(`
      {
        "indexed": true,
        "type": "address",
      }
    `)
  })
})

test('SolidityAddress', () => {
  expect(SolidityAddress.parse('address')).toMatchInlineSnapshot('"address"')
})
test('SolidityBool', () => {
  expect(SolidityBool.parse('bool')).toMatchInlineSnapshot('"bool"')
})
test('SolidityBytes', () => {
  expect(SolidityBytes.parse('bytes32')).toMatchInlineSnapshot('"bytes32"')
})
test('SolidityFunction', () => {
  expect(SolidityFunction.parse('function')).toMatchInlineSnapshot('"function"')
})
test('SolidityString', () => {
  expect(SolidityString.parse('string')).toMatchInlineSnapshot('"string"')
})
test('SolidityTuple', () => {
  expect(SolidityTuple.parse('tuple')).toMatchInlineSnapshot('"tuple"')
})
test('SolidityInt', () => {
  expect(SolidityInt.parse('uint256')).toMatchInlineSnapshot('"uint256"')
})
test('SolidityArrayWithoutTuple', () => {
  expect(SolidityArrayWithoutTuple.parse('uint256[]')).toMatchInlineSnapshot(
    '"uint256[]"',
  )
})
test('SolidityArrayWithTuple', () => {
  expect(SolidityArrayWithTuple.parse('tuple[]')).toMatchInlineSnapshot(
    '"tuple[]"',
  )
})
test('SolidityArray', () => {
  expect(SolidityArray.parse('uint256[]')).toMatchInlineSnapshot('"uint256[]"')
  expect(SolidityArray.parse('tuple[]')).toMatchInlineSnapshot('"tuple[]"')
})

test('AbiStateMutability', () => {
  expect(AbiStateMutability.parse('nonpayable')).toMatchInlineSnapshot(
    '"nonpayable"',
  )
  expect(AbiStateMutability.parse('payable')).toMatchInlineSnapshot('"payable"')
  expect(AbiStateMutability.parse('pure')).toMatchInlineSnapshot('"pure"')
  expect(AbiStateMutability.parse('view')).toMatchInlineSnapshot('"view"')
})

test('AbiItemType', () => {
  expect(AbiItemType.parse('constructor')).toMatchInlineSnapshot(
    '"constructor"',
  )
  expect(AbiItemType.parse('event')).toMatchInlineSnapshot('"event"')
  expect(AbiItemType.parse('error')).toMatchInlineSnapshot('"error"')
  expect(AbiItemType.parse('fallback')).toMatchInlineSnapshot('"fallback"')
  expect(AbiItemType.parse('function')).toMatchInlineSnapshot('"function"')
  expect(AbiItemType.parse('receive')).toMatchInlineSnapshot('"receive"')
})

test('AddressType', () => {
  expect(
    Address.parse('0x0000000000000000000000000000000000000000'),
  ).toMatchInlineSnapshot('"0x0000000000000000000000000000000000000000"')
  expect(() => Address.parse('0x')).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "Invalid Address 0x",
        "path": []
      }
    ]]
  `)
})

test('EIP-712 TypedData', () => {
  const types = {
    Name: [
      { name: 'first', type: 'Name' },
      { name: 'last', type: 'string' },
    ],
  }

  const circularReference = {
    Foo: [{ name: 'bar', type: 'Bar' }],
    Bar: [{ name: 'foo', type: 'Foo' }],
  }

  const unknowType = {
    Name: [
      { name: 'first', type: 'Foo' },
      { name: 'last', type: 'string' },
    ],
  }

  expect(() => TypedData.parse(types)).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "Invalid type. Name is a self reference.",
        "path": []
      }
    ]]
  `)

  expect(() => TypedData.parse(types)).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "Invalid type. Name is a self reference.",
        "path": []
      }
    ]]
  `)

  expect(() => TypedData.parse(unknowType)).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "Invalid type. Foo is not a valid EIP-712 type.",
        "path": []
      }
    ]]
  `)

  expect(() =>
    TypedData.parse(circularReference),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "Invalid type. Bar is a circular reference.",
        "path": []
      },
      {
        "code": "custom",
        "message": "Invalid type. Foo is a circular reference.",
        "path": []
      }
    ]]
  `)

  expect(() =>
    TypedData.parse({ address: [{ name: 'owner', type: 'address' }] }),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "Invalid key. address is a solidity type.",
        "path": []
      }
    ]]
  `)

  expect(() =>
    TypedData.parse({ Foo: [{ name: 'owner', type: '' }] }),
  ).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "Invalid type. Foo does not have a type.",
        "path": []
      }
    ]]
  `)

  const single = {
    Contributor: [
      { name: 'name', type: 'string' },
      { name: 'address', type: 'address' },
    ],
  }

  const nested = {
    Contributor: [
      { name: 'name', type: 'string' },
      { name: 'address', type: 'address' },
    ],
    Website: [
      { name: 'domain', type: 'string' },
      { name: 'webmaster', type: 'Contributor' },
    ],
  }

  const deeplyNested = {
    Contributor: [
      { name: 'name', type: 'string' },
      { name: 'address', type: 'address' },
    ],
    Website: [
      { name: 'domain', type: 'string' },
      { name: 'webmaster', type: 'Contributor' },
    ],
    Project: [
      { name: 'name', type: 'string' },
      { name: 'contributors', type: 'Contributor[2]' },
      { name: 'website', type: 'Website' },
    ],
    Organization: [
      { name: 'name', type: 'string' },
      { name: 'projects', type: 'Project[]' },
      { name: 'website', type: 'Website' },
    ],
  }

  expect(TypedData.parse(single)).toMatchObject(single)
  expect(TypedData.parse(nested)).toMatchObject(nested)
  expect(TypedData.parse(deeplyNested)).toMatchObject(deeplyNested)
})
