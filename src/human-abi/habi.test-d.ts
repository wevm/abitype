import { assertType, test } from 'vitest'

import type {
  CreateStructObject,
  ExtractArgs,
  ExtractHAbiError,
  ExtractHAbiErrorNames,
  ExtractHAbiEvent,
  ExtractHAbiEventNames,
  ExtractHAbiFunction,
  ExtractHAbiFunctionNames,
  ExtractMutability,
  ExtractNames,
  ExtractReturn,
  ExtractStructInternalType,
  ExtractStructName,
  ExtractStructType,
  ExtractTArgs,
  ExtractTupleInfo,
  ExtractTupleInternalType,
  ExtractTupleName,
  ExtractTupleType,
  ExtractType,
  HandleArguments,
  IsHAbi,
  ParseArgs,
  ParseComponents,
  ParseHAbiConstructor,
  ParseHAbiErrors,
  ParseHAbiEvents,
  ParseHAbiFallbacks,
  ParseHAbiFunctions,
  ParseHumanAbi,
  ParseParams,
  isIndexed,
} from './habi'
import type { PopLastIfEmpty, ReOrderArray, ReplaceAll, Split } from './utils'

const testAbi = [
  'function balanceOf(address owner) view returns (uint tokenId)',
  'event Transfer(address indexed from, address indexed to, address value)',
  'error InsufficientBalance(account owner, uint balance)',
  'function addPerson(tuple(string name, uint16 age) person)',
  'function addPeople(tuple(string name, uint16 age)[] person)',
  'function getPerson(uint id) view returns (tuple(string name, uint16 age) person)',
  'event PersonAdded(uint indexed id, tuple(string name, uint16 age) indexed person)',
] as const

type FuncType = typeof testAbi[0]
type EventType = typeof testAbi[1]
type ErrorType = typeof testAbi[2]
type FuncTypeTuple = typeof testAbi[3]
type FuncTypeTupleArray = typeof testAbi[4]
type FuncTypeReturnTuple = typeof testAbi[5]
type EventTuple = typeof testAbi[6]

test('Utils', () => {
  test('ReOrder', () => {
    assertType<
      ReOrderArray<
        ParseParams<'address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId'>
      >
    >([
      'address owner',
      'uint tokenId',
      '(bool loading, (string[][] names) cats)[] dog',
    ])
  }),
    test('SplitNesting', () => {
      assertType<
        ParseParams<'address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId'>
      >([
        'address owner',
        '(bool loading, (string[][] names) cats)[] dog',
        'uint tokenId',
      ])
    })

  test('Remove All', () => {
    assertType<
      ReplaceAll<'tuple(tuple(tuple(tuple(tuple(tuple())))))', 'tuple', ''>
    >('(((((())))))')
  })
})
test('Extract Names', () => {
  test('Function', () => {
    assertType<ExtractNames<FuncType>>('balanceOf')
  })

  test('Event', () => {
    assertType<ExtractNames<EventType>>('Transfer')
  })

  test('Error', () => {
    assertType<ExtractNames<ErrorType>>('InsufficientBalance')
  })
})

test('Extract Mutability', () => {
  test('View', () => {
    assertType<ExtractMutability<FuncType>>('view')
  })

  test('Non-Payable', () => {
    assertType<ExtractMutability<'function balanceOf(address owner)'>>(
      'nonpayable',
    )
  })

  test('Payable', () => {
    assertType<
      ExtractMutability<'function balanceOf(address owner) payable returns(uint256 tokenId)'>
    >('payable')
  })

  test('Pure', () => {
    assertType<
      ExtractMutability<'function balanceOf(address owner) pure returns(uint256 tokenId)'>
    >('pure')
  })
})

test('ExtractArgs', () => {
  test('Function', () => {
    assertType<ExtractArgs<FuncType>>(['address owner'])
  })

  test('Event', () => {
    assertType<ExtractArgs<EventType>>([
      'address indexed from',
      'address indexed to',
      'address value',
    ])
  })

  test('Error', () => {
    assertType<ExtractArgs<ErrorType>>(['account owner', 'uint balance'])
  })

  test('Function Tuple', () => {
    assertType<ExtractArgs<FuncTypeTuple>>(['(string name, uint16 age) person'])
  })

  test('Event Tuple', () => {
    assertType<ExtractArgs<EventTuple>>([
      'uint indexed id',
      '(string name, uint16 age) indexed person',
    ])
  })

  test('Event Indexed Tuple', () => {
    assertType<isIndexed<'tuple(string name, uint16 age) indexed person'>>(true)
  })

  test('Function Tuple Array', () => {
    assertType<ExtractArgs<FuncTypeTupleArray>>([
      '(string name, uint16 age)[] person',
    ])
  })
})

test('ExtractReturn', () => {
  test('Tuple', () => {
    assertType<ExtractReturn<FuncTypeReturnTuple>>([
      '(string name, uint16 age) person',
    ])
  })

  test('NonTuple', () => {
    assertType<ExtractReturn<FuncType>>(['uint tokenId'])
  })
})

test('ExtractType', () => {
  test('Function', () => {
    assertType<ExtractType<FuncType>>('function')
  })

  test('Event', () => {
    assertType<ExtractType<EventType>>('event')
  })

  test('Function', () => {
    assertType<ExtractType<ErrorType>>('error')
  })

  test('Internal Type', () => {
    assertType<
      ExtractTupleInternalType<
        ExtractTupleInfo<'(string name, uint16 age) person'>
      >
    >('Struct person')
  })
})

test('ExtractTupleName', () => {
  test('Name', () => {
    assertType<
      ExtractTupleName<ExtractTupleInfo<ExtractArgs<FuncTypeTuple>[number]>>
    >('person')
  })

  test('Name Array', () => {
    assertType<
      ExtractTupleName<
        ExtractTupleInfo<ExtractArgs<FuncTypeTupleArray>[number]>
      >
    >('person')
  })

  test('No Name', () => {
    assertType<ExtractTupleName<ExtractTupleInfo<'FuncType'>>>('FuncType')
  })
})

test('ExtractTupleType', () => {
  test('Array', () => {
    assertType<
      ExtractTupleType<
        ExtractTupleInfo<ExtractArgs<FuncTypeTupleArray>[number]>
      >
    >('tuple[]')
  })

  test('Normal', () => {
    assertType<ExtractTupleType<FuncTypeTuple>>('tuple')
  })

  test('Fixed size Array', () => {
    assertType<
      ExtractTupleType<ExtractTupleInfo<'(address whatever)[5] person'>>
    >('tuple[5]')
  })
})

test('ExtractTupleArgs', () => {
  test('Non Array', () => {
    assertType<ExtractTArgs<ExtractArgs<FuncTypeTuple>[number]>>(
      'string name, uint16 age',
    )
  })

  test('Array', () => {
    assertType<ExtractTArgs<ExtractArgs<FuncTypeTupleArray>[number]>>(
      'string name, uint16 age',
    )
  })

  test('Handle correctly', () => {
    assertType<ExtractTArgs<ExtractArgs<FuncTypeTuple>[number]>>(
      'string name, uint16 age',
    )
    assertType<ExtractTArgs<ExtractArgs<FuncTypeTupleArray>[number]>>(
      'string name, uint16 age',
    )
  })
})

test('IsHAbi', () => {
  test('true', () => {
    assertType<IsHAbi<typeof testAbi>>(true)
  })

  test('false', () => {
    assertType<
      IsHAbi<
        readonly [
          'functions getBalance(address owner) view returns(uint256 tokenId)',
        ]
      >
    >(false)
  })
})

test('HandleArguments', () => {
  test('Function', () => {
    assertType<HandleArguments<ExtractArgs<FuncType>>>([
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ])
  })

  test('Function Tuple', () => {
    assertType<HandleArguments<ExtractArgs<FuncTypeTuple>>>([
      {
        type: 'tuple',
        name: 'person',
        internalType: 'Struct person',
        components: [
          {
            name: 'name',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'age',
            type: 'uint16',
            internalType: 'uint16',
          },
        ],
      },
    ])
  })

  test('Function Tuple Array', () => {
    assertType<HandleArguments<ExtractArgs<FuncTypeTupleArray>>>([
      {
        type: 'tuple[]',
        name: 'person',
        internalType: 'Struct[] person',
        components: [
          {
            name: 'name',
            type: 'string',
            internalType: 'string',
          },
          {
            name: 'age',
            type: 'uint16',
            internalType: 'uint16',
          },
        ],
      },
    ])
  })

  test('Event Tuple', () => {
    assertType<HandleArguments<ExtractArgs<EventTuple>>>([
      { name: 'id', type: 'uint256', internalType: 'uint256', indexed: true },
      {
        type: 'tuple',
        name: 'person',
        indexed: true,
        internalType: 'Struct person',
        components: [
          { name: 'name', type: 'string', internalType: 'string' },
          { name: 'age', type: 'uint16', internalType: 'uint16' },
        ],
      },
    ])
  })
})

test('HandleReturnArguments', () => {
  test('Non Tuple', () => {
    assertType<HandleArguments<ExtractReturn<FuncType>>>([
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ])
  })

  test('Tuple Return', () => {
    assertType<HandleArguments<ExtractReturn<FuncTypeReturnTuple>>>([
      {
        name: 'person',
        type: 'tuple',
        internalType: 'Struct person',
        components: [
          { name: 'name', type: 'string', internalType: 'string' },
          { name: 'age', type: 'uint16', internalType: 'uint16' },
        ],
      },
    ])
  })
})

test('ParseComponents', () => {
  test('Nested Tuples', () => {
    assertType<
      ParseComponents<
        ReOrderArray<
          ParseParams<'(address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId) person'>
        >
      >
    >([
      {
        name: 'person',
        type: 'tuple',
        internalType: 'Struct person',
        components: [
          { name: 'owner', type: 'address', internalType: 'address' },
          { name: 'tokenId', type: 'uint256', internalType: 'uint256' },
          {
            name: 'dog',
            type: 'tuple[]',
            internalType: 'Struct[] dog',
            components: [
              { name: 'loading', type: 'bool', internalType: 'bool' },
              {
                name: 'cats',
                type: 'tuple',
                internalType: 'Struct cats',
                components: [
                  {
                    name: 'names',
                    type: 'string[][]',
                    internalType: 'string[][]',
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
  })

  test('Max Depth', () => {
    assertType<
      ParseComponents<
        [
          '(((((((((((uint tokenId) animal) person)[24] person) person) person) person)[3] person) person) person)[] person) person',
        ]
      >
    >([
      {
        name: 'person',
        type: 'tuple',
        internalType: 'Struct person',
        components: [
          {
            name: 'person',
            type: 'tuple[]',
            internalType: 'Struct[] person',
            components: [
              {
                name: 'person',
                type: 'tuple',
                internalType: 'Struct person',
                components: [
                  {
                    name: 'person',
                    type: 'tuple',
                    internalType: 'Struct person',
                    components: [
                      {
                        name: 'person',
                        type: 'tuple[3]',
                        internalType: 'Struct[3] person',
                        components: [
                          {
                            name: 'person',
                            type: 'tuple',
                            internalType: 'Struct person',
                            components: [
                              {
                                name: 'person',
                                type: 'tuple',
                                internalType: 'Struct person',
                                components: [
                                  {
                                    name: 'person',
                                    type: 'tuple',
                                    internalType: 'Struct person',
                                    components: [
                                      {
                                        name: 'person',
                                        type: 'tuple[24]',
                                        internalType: 'Struct[24] person',
                                        components: [
                                          {
                                            name: 'person',
                                            type: 'tuple',
                                            internalType: 'Struct person',
                                            components: [
                                              {
                                                name: 'animal',
                                                type: 'tuple',
                                                internalType: 'Struct animal',
                                                components: [
                                                  {
                                                    type: 'uint256',
                                                    name: 'tokenId',
                                                    internalType: 'uint256',
                                                  },
                                                ],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
  })
})

test('ParseEventComponents', () => {
  test('Event Tuple', () => {
    assertType<ParseComponents<['(string name, uint16 age) indexed person']>>([
      {
        type: 'tuple',
        name: 'person',
        indexed: true,
        internalType: 'Struct person',
        components: [
          { name: 'name', type: 'string', internalType: 'string' },
          { name: 'age', type: 'uint16', internalType: 'uint16' },
        ],
      },
    ])
  })
})

test('ParseEventArgs', () => {
  assertType<ParseArgs<ExtractArgs<EventType>>>([
    {
      name: 'from',
      type: 'address',
      internalType: 'address',
      indexed: true,
    },
    { indexed: true, name: 'to', type: 'address', internalType: 'address' },
    { internalType: 'address', type: 'address', name: 'value' },
  ])
})

test('ParseFunctionArgs and Return', () => {
  test('Function Args', () => {
    assertType<ParseArgs<ExtractArgs<FuncType>>>([
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ])
  })

  test('Function Return', () => {
    assertType<ParseArgs<ExtractReturn<FuncType>>>([
      {
        name: 'tokenId',
        type: 'uint256',
        internalType: 'uint256',
      },
    ])
  })
})

test('ParseHAbiErrors', () => {
  assertType<ParseHAbiErrors<typeof testAbi>>([
    {
      name: 'InsufficientBalance',
      type: 'error',
      inputs: [
        { name: 'owner', type: 'account', internalType: 'account' },
        { name: 'balance', type: 'uint256', internalType: 'uint256' },
      ],
    },
  ])
})

test('ParseHAbiEvents', () => {
  assertType<ParseHAbiEvents<typeof testAbi>>([
    {
      name: 'Transfer',
      type: 'event',
      anonymous: false,
      inputs: [
        {
          name: 'from',
          type: 'address',
          internalType: 'address',
          indexed: true,
        },
        { name: 'to', type: 'address', internalType: 'address', indexed: true },
        {
          name: 'value',
          type: 'address',
          internalType: 'address',
        },
      ],
    },
    {
      name: 'PersonAdded',
      type: 'event',
      anonymous: false,
      inputs: [
        { indexed: true, name: 'id', type: 'uint256', internalType: 'uint256' },
        {
          name: 'person',
          type: 'tuple',
          internalType: 'Struct person',
          indexed: true,
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'age', type: 'uint16', internalType: 'uint16' },
          ],
        },
      ],
    },
  ])
})

test('ParseHAbiFunctions', () => {
  assertType<ParseHAbiFunctions<typeof testAbi>>([
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      constant: true,
      payable: false,
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      outputs: [{ name: 'tokenId', type: 'uint256', internalType: 'uint256' }],
    },
    {
      name: 'addPerson',
      type: 'function',
      stateMutability: 'nonpayable',
      constant: false,
      payable: false,
      inputs: [
        {
          name: 'person',
          type: 'tuple',
          internalType: 'Struct person',
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'age', type: 'uint16', internalType: 'uint16' },
          ],
        },
      ],
      outputs: [],
    },
    {
      name: 'addPeople',
      type: 'function',
      stateMutability: 'nonpayable',
      constant: false,
      payable: false,
      inputs: [
        {
          name: 'person',
          type: 'tuple[]',
          internalType: 'Struct[] person',
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'age', type: 'uint16', internalType: 'uint16' },
          ],
        },
      ],
      outputs: [],
    },
    {
      name: 'getPerson',
      type: 'function',
      stateMutability: 'view',
      constant: true,
      payable: false,
      inputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
      outputs: [
        {
          name: 'person',
          type: 'tuple',
          internalType: 'Struct person',
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'age', type: 'uint16', internalType: 'uint16' },
          ],
        },
      ],
    },
  ])
})

test('Parse Constructor', () => {
  assertType<ParseHAbiConstructor<['constructor(string hello)']>>([
    {
      type: 'constructor',
      stateMutability: 'nonpayable',
      inputs: [{ name: 'hello', type: 'string', internalType: 'string' }],
    },
  ])
})

test('Parse Fallbacks', () => {
  assertType<ParseHAbiFallbacks<['fallback()', 'receive() external payable']>>([
    {
      type: 'fallback',
    },
    {
      type: 'receive',
      stateMutability: 'payable',
    },
  ])
})

test('ParseHumanAbi', () => {
  assertType<ParseHumanAbi<typeof testAbi>>([
    {
      name: 'InsufficientBalance',
      type: 'error',
      inputs: [
        { name: 'owner', type: 'account', internalType: 'account' },
        { name: 'balance', type: 'uint256', internalType: 'uint256' },
      ],
    },
    {
      name: 'Transfer',
      type: 'event',
      anonymous: false,
      inputs: [
        {
          name: 'from',
          type: 'address',
          internalType: 'address',
          indexed: true,
        },
        { name: 'to', type: 'address', internalType: 'address', indexed: true },
        {
          name: 'value',
          type: 'address',
          internalType: 'address',
        },
      ],
    },
    {
      name: 'PersonAdded',
      type: 'event',
      anonymous: false,
      inputs: [
        { indexed: true, name: 'id', type: 'uint256', internalType: 'uint256' },
        {
          name: 'person',
          type: 'tuple',
          internalType: 'Struct person',
          indexed: true,
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'age', type: 'uint16', internalType: 'uint16' },
          ],
        },
      ],
    },
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      constant: true,
      payable: false,
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      outputs: [{ name: 'tokenId', type: 'uint256', internalType: 'uint256' }],
    },
    {
      name: 'addPerson',
      type: 'function',
      stateMutability: 'nonpayable',
      constant: false,
      payable: false,
      inputs: [
        {
          name: 'person',
          type: 'tuple',
          internalType: 'Struct person',
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'age', type: 'uint16', internalType: 'uint16' },
          ],
        },
      ],
      outputs: [],
    },
    {
      name: 'addPeople',
      type: 'function',
      constant: false,
      payable: false,
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'person',
          type: 'tuple[]',
          internalType: 'Struct[] person',
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'age', type: 'uint16', internalType: 'uint16' },
          ],
        },
      ],
      outputs: [],
    },
    {
      name: 'getPerson',
      type: 'function',
      constant: true,
      payable: false,
      stateMutability: 'view',
      inputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
      outputs: [
        {
          name: 'person',
          type: 'tuple',
          internalType: 'Struct person',
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'age', type: 'uint16', internalType: 'uint16' },
          ],
        },
      ],
    },
  ])

  test('With structs', () => {
    assertType<
      ParseHumanAbi<
        [
          'struct Color { uint8 red; uint8 green; uint8 blue; }',
          'struct Foo { string name; Color color; }',
          'function foo(Foo bar) view returns (string)',
          'event Foo(Foo bar)',
          'constructor(string symbol, string name)',
          'function transferFrom(address from, address to, uint value)',
          'function balanceOf(address owner) view returns (uint256 balance)',
          'event Transfer(address indexed from, address indexed to, address value)',
          'error InsufficientBalance(account owner, uint balance)',
          'function addPerson((string name, uint16 age) person)',
          'function addPeople((string name, uint16 age)[] person)',
          'function getPerson(uint id) view returns ((string name, uint16 age))',
          'event PersonAdded(uint indexed id, (string name, uint16 age) person)',
        ]
      >
    >([
      {
        type: 'constructor',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'symbol', type: 'string', internalType: 'string' },
          { name: 'name', internalType: 'string', type: 'string' },
        ],
      },
      {
        name: 'InsufficientBalance',
        type: 'error',
        inputs: [
          { name: 'owner', type: 'account', internalType: 'account' },
          { name: 'balance', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'Foo',
        type: 'event',
        anonymous: false,
        inputs: [
          {
            name: 'bar',
            type: 'tuple',
            internalType: 'Struct Foo',
            components: [
              { name: 'name', type: 'string', internalType: 'string' },
              {
                name: 'color',
                type: 'tuple',
                internalType: 'Struct Color',
                components: [
                  { name: 'red', type: 'uint8', internalType: 'uint8' },
                  { name: 'green', type: 'uint8', internalType: 'uint8' },
                  { name: 'blue', type: 'uint8', internalType: 'uint8' },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Transfer',
        type: 'event',
        anonymous: false,
        inputs: [
          {
            name: 'from',
            type: 'address',
            internalType: 'address',
            indexed: true,
          },
          {
            name: 'to',
            type: 'address',
            indexed: true,
            internalType: 'address',
          },
          { name: 'value', type: 'address', internalType: 'address' },
        ],
      },
      {
        name: 'PersonAdded',
        type: 'event',
        anonymous: false,
        inputs: [
          {
            name: 'id',
            type: 'uint256',
            internalType: 'uint256',
            indexed: true,
          },
          {
            name: 'person',
            type: 'tuple',
            internalType: 'Struct person',
            components: [
              { name: 'name', type: 'string', internalType: 'string' },
              { name: 'age', internalType: 'uint16', type: 'uint16' },
            ],
          },
        ],
      },
      {
        name: 'foo',
        type: 'function',
        stateMutability: 'view',
        payable: false,
        constant: true,
        inputs: [
          {
            name: 'bar',
            internalType: 'Struct Foo',
            type: 'tuple',
            components: [
              { name: 'name', internalType: 'string', type: 'string' },
              {
                name: 'color',
                type: 'tuple',
                internalType: 'Struct Color',
                components: [
                  { name: 'red', type: 'uint8', internalType: 'uint8' },
                  { name: 'green', internalType: 'uint8', type: 'uint8' },
                  { name: 'blue', type: 'uint8', internalType: 'uint8' },
                ],
              },
            ],
          },
        ],
        outputs: [{ name: '', type: 'string', internalType: 'string' }],
      },
      {
        name: 'transferFrom',
        type: 'function',
        constant: false,
        payable: false,
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'from', type: 'address', internalType: 'address' },
          { name: 'to', type: 'address', internalType: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
        ],
        outputs: [],
      },
      {
        name: 'balanceOf',
        stateMutability: 'view',
        payable: false,
        constant: true,
        type: 'function',
        inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
        outputs: [
          { name: 'balance', type: 'uint256', internalType: 'uint256' },
        ],
      },
      {
        name: 'addPerson',
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        constant: false,
        inputs: [
          {
            name: 'person',
            type: 'tuple',
            internalType: 'Struct person',
            components: [
              { name: 'name', type: 'string', internalType: 'string' },
              { name: 'age', internalType: 'uint16', type: 'uint16' },
            ],
          },
        ],
        outputs: [],
      },
      {
        name: 'addPeople',
        type: 'function',
        stateMutability: 'nonpayable',
        payable: false,
        constant: false,
        inputs: [
          {
            name: 'person',
            type: 'tuple[]',
            internalType: 'Struct[] person',
            components: [
              { name: 'name', type: 'string', internalType: 'string' },
              { name: 'age', type: 'uint16', internalType: 'uint16' },
            ],
          },
        ],
        outputs: [],
      },
      {
        name: 'getPerson',
        type: 'function',
        stateMutability: 'view',
        constant: true,
        payable: false,
        inputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
        outputs: [
          {
            name: '',
            type: 'tuple',
            internalType: 'Struct',
            components: [
              { name: 'name', type: 'string', internalType: 'string' },
              { name: 'age', internalType: 'uint16', type: 'uint16' },
            ],
          },
        ],
      },
    ])
  })
})

test('Extract Names', () => {
  assertType<ExtractHAbiFunctionNames<typeof testAbi>>('balanceOf')
  assertType<ExtractHAbiEventNames<typeof testAbi>>('Transfer')
  assertType<ExtractHAbiErrorNames<typeof testAbi>>('InsufficientBalance')
})

test('Extract Abi Specs', () => {
  assertType<ExtractHAbiFunction<typeof testAbi, 'balanceOf'>>({
    constant: true,
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
    type: 'function',
    name: 'balanceOf',
    outputs: [{ name: 'tokenId', type: 'uint256', internalType: 'uint256' }],
    payable: false,
    stateMutability: 'view',
  })

  assertType<ExtractHAbiEvent<typeof testAbi, 'Transfer'>>({
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', internalType: 'address', indexed: true },
      { name: 'to', type: 'address', internalType: 'address', indexed: true },
      { name: 'value', type: 'address', internalType: 'address' },
    ],
  })

  assertType<ExtractHAbiError<typeof testAbi, 'InsufficientBalance'>>({
    name: 'InsufficientBalance',
    type: 'error',
    inputs: [
      { name: 'owner', type: 'account', internalType: 'account' },
      { name: 'balance', type: 'uint256', internalType: 'uint256' },
    ],
  })
})

test('Can extract structs', () => {
  assertType<
    CreateStructObject<
      [
        'function cenas()',
        'struct Demo {bytes  x; address payable d;}',
        'struct Voter {  uint weight;  bool voted;  address delegate; uint vote; }',
        'struct NestedVoter {  Voter voter;  bool voted;  address delegate; uint vote; }',
      ]
    >
  >({
    Demo: ['bytes  x', 'address payable d'],
    Voter: ['uint weight', 'bool voted', 'address delegate', 'uint vote'],
    NestedVoter: ['Voter voter', 'bool voted', 'address delegate', 'uint vote'],
  })

  assertType<
    CreateStructObject<
      [
        'struct Voter {  uint weight;  bool voted;  address delegate; uint vote; }',
        'function call(Voter memory voter) returns (address, uint256)',
      ]
    >
  >({
    Voter: ['uint weight', 'bool voted', 'address delegate', 'uint vote'],
  })
})

test('Can parse Struct', () => {
  assertType<
    ParseHumanAbi<
      [
        'struct Voter {  uint weight;  bool voted;  address delegate; uint vote; }',
        'function call(Voter memory voter) returns (address, uint256)',
      ]
    >
  >([
    {
      constant: false,
      name: 'call',
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [
        {
          name: 'voter',
          type: 'tuple',
          internalType: 'Struct Voter',
          components: [
            {
              name: 'weight',
              type: 'uint256',
              internalType: 'uint256',
            },
            {
              name: 'voted',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: 'delegate',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'vote',
              type: 'uint256',
              internalType: 'uint256',
            },
          ],
        },
      ],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address',
        },
        {
          name: '',
          type: 'uint256',
          internalType: 'uint256',
        },
      ],
    },
  ])

  test('Can parse nested structs', () => {
    assertType<
      ParseHumanAbi<
        [
          'struct Voter {  uint weight; }',
          'struct NestedVoter {  Voter voter;  uint vote; }',
          'struct NestedVoter2 {  NestedVoter[] voter;  Voter[10] votes;  uint vote; }',
          'function call(NestedVoter2 memory voter) returns (address, uint256)',
        ]
      >
    >([
      {
        constant: false,
        payable: false,
        name: 'call',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          {
            internalType: 'Struct NestedVoter2',
            name: 'voter',
            type: 'tuple',
            components: [
              {
                internalType: 'Struct[] NestedVoter',
                name: 'voter',
                type: 'tuple[]',
                components: [
                  {
                    name: 'voter',
                    type: 'tuple',
                    internalType: 'Struct Voter',
                    components: [
                      {
                        name: 'weight',
                        type: 'uint256',
                        internalType: 'uint256',
                      },
                    ],
                  },
                  { name: 'vote', type: 'uint256', internalType: 'uint256' },
                ],
              },
              {
                internalType: 'Struct[10] Voter',
                name: 'votes',
                type: 'tuple[10]',
                components: [
                  {
                    name: 'weight',
                    type: 'uint256',
                    internalType: 'uint256',
                  },
                ],
              },
              {
                internalType: 'uint256',
                name: 'vote',
                type: 'uint256',
              },
            ],
          },
        ],
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
          { internalType: 'uint256', name: '', type: 'uint256' },
        ],
      },
    ])
  })

  test('Can parse events structs', () => {
    assertType<
      ParseHumanAbi<
        [
          'struct Voter {  uint weight; }',
          'event call(Voter indexed voter, address owner)',
        ]
      >
    >([
      {
        name: 'call',
        type: 'event',
        anonymous: false,
        inputs: [
          {
            name: 'voter',
            indexed: true,
            type: 'tuple',
            internalType: 'Struct Voter',
            components: [
              {
                name: 'weight',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          { name: 'owner', type: 'address', internalType: 'address' },
        ],
      },
    ])
  })

  test('Can parse error structs', () => {
    assertType<
      ParseHumanAbi<
        [
          'struct Voter {  uint weight; }',
          'error call(Voter voter, address owner)',
        ]
      >
    >([
      {
        name: 'call',
        type: 'error',
        inputs: [
          {
            name: 'voter',
            type: 'tuple',
            internalType: 'Struct Voter',
            components: [
              {
                name: 'weight',
                type: 'uint256',
                internalType: 'uint256',
              },
            ],
          },
          { name: 'owner', type: 'address', internalType: 'address' },
        ],
      },
    ])
  })
})

test('Extract Struct Name', () => {
  assertType<ExtractStructName<'Voter[10]'>>('Voter')
  assertType<ExtractStructName<'Voter[]'>>('Voter')
  assertType<ExtractStructName<'Voter'>>('Voter')
})

test('Extract Struct Type', () => {
  assertType<ExtractStructType<'Voter[10]'>>('tuple[10]')
  assertType<ExtractStructType<'Voter[]'>>('tuple[]')
  assertType<ExtractStructType<'Voter'>>('tuple')
})

test('Extract Struct internalType', () => {
  assertType<ExtractStructInternalType<'Voter[10]'>>('Struct[10] Voter')
  assertType<ExtractStructInternalType<'Voter[]'>>('Struct[] Voter')
  assertType<ExtractStructInternalType<'Voter'>>('Struct Voter')
})

test('Utils', () => {
  assertType<Split<'Hello World', ' '>>(['Hello', 'World'])
  assertType<Split<'Hello World', 'l'>>(['He', '', 'o Wor', 'd'])
  assertType<PopLastIfEmpty<[1, 2, 3]>>([1, 2, 3])
  assertType<PopLastIfEmpty<['1', '2', '']>>(['1', '2'])
})
