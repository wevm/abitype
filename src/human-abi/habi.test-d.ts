import { assertType, test } from 'vitest'

import type {
  ExtractArgs,
  ExtractArrayTupleArgs,
  ExtractMutability,
  ExtractNames,
  ExtractReturn,
  ExtractTArgs,
  ExtractTupleArgs,
  ExtractTupleName,
  ExtractTupleType,
  ExtractType,
  HandleArguments,
  HandleReturnArguments,
  IsHAbi,
  ParseComponents,
  ParseEventArgs,
  ParseFunctionArgs,
  ParseFunctionReturn,
  ParseHAbiErrors,
  ParseHAbiEvents,
  ParseHAbiFunctions,
  ParseHumanAbi,
} from './habi'

const testAbi = [
  'function balanceOf(address owner) view returns (uint tokenId)',
  'event Transfer(address indexed from, address indexed to, address value)',
  'error InsufficientBalance(account owner, uint balance)',
  'function addPerson(tuple(string name, uint16 age) person)',
  'function addPeople(tuple(string name, uint16 age)[] person)',
  'function getPerson(uint id) view returns (tuple(string name, uint16 age) person)',
  'event PersonAdded(uint indexed id, tuple(string name, uint16 age) person)',
] as const

type FuncType = typeof testAbi[0]
type EventType = typeof testAbi[1]
type ErrorType = typeof testAbi[2]
type FuncTypeTuple = typeof testAbi[3]
type FuncTypeTupleArray = typeof testAbi[4]
type FuncTypeReturnTuple = typeof testAbi[5]
type EventTuple = typeof testAbi[6]

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
    assertType<ExtractArgs<FuncTypeTuple>>([
      'tuple(string name, uint16 age) person',
    ])
  })

  test('Event Tuple', () => {
    assertType<ExtractArgs<EventTuple>>([
      'uint indexed id',
      'tuple(string name, uint16 age) person',
    ])
  })

  test('Function Tuple Array', () => {
    assertType<ExtractArgs<FuncTypeTupleArray>>([
      'tuple(string name, uint16 age)[] person',
    ])
  })
})

test('ExtractReturn', () => {
  test('Tuple', () => {
    assertType<ExtractReturn<FuncTypeReturnTuple>>([
      'tuple(string name, uint16 age) person',
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
})

test('ExtractTupleName', () => {
  test('Name', () => {
    assertType<ExtractTupleName<FuncTypeTuple>>('person')
  })

  test('Name Array', () => {
    assertType<ExtractTupleName<FuncTypeTupleArray>>('person')
  })

  test('No Name', () => {
    assertType<ExtractTupleName<'FuncType'>>('')
  })
})

test('ExtractTupleType', () => {
  test('Array', () => {
    assertType<ExtractTupleType<FuncTypeTupleArray>>('tuple[]')
  })

  test('Normal', () => {
    assertType<ExtractTupleType<FuncTypeTuple>>('tuple')
  })

  test('Fixed size Array', () => {
    assertType<ExtractTupleType<'tuple(address whatever)[5] person'>>(
      'tuple[5]',
    )
  })
})

test('ExtractTupleArgs', () => {
  test('Non Array', () => {
    assertType<ExtractTupleArgs<ExtractArgs<FuncTypeTuple>[number]>>(
      'string name, uint16 age',
    )
  })

  test('Array', () => {
    assertType<ExtractArrayTupleArgs<ExtractArgs<FuncTypeTupleArray>[number]>>(
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
    assertType<HandleArguments<ExtractArgs<FuncType>, 'function'>>([
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ])
  })

  test('Function Tuple', () => {
    assertType<HandleArguments<ExtractArgs<FuncTypeTuple>, 'function'>>([
      {
        type: 'tuple',
        name: 'person',
        components: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'age',
            type: 'uint16',
          },
        ],
      },
    ])
  })

  test('Function Tuple Array', () => {
    assertType<HandleArguments<ExtractArgs<FuncTypeTupleArray>, 'function'>>([
      {
        type: 'tuple[]',
        name: 'person',
        components: [
          {
            name: 'name',
            type: 'string',
          },
          {
            name: 'age',
            type: 'uint16',
          },
        ],
      },
    ])
  })

  test('Event Tuple', () => {
    assertType<HandleArguments<ExtractArgs<EventTuple>, 'event'>>([
      { name: 'id', type: 'uint256', internalType: 'uint256', indexed: true },
      {
        type: 'tuple',
        name: 'person',
        components: [
          { name: 'name', type: 'string' },
          { name: 'age', type: 'uint16' },
        ],
      },
    ])
  })
})

test('HandleReturnArguments', () => {
  test('Non Tuple', () => {
    assertType<HandleReturnArguments<ExtractReturn<FuncType>>>([
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ])
  })

  test('Tuple Return', () => {
    assertType<HandleReturnArguments<ExtractReturn<FuncTypeReturnTuple>>>([
      {
        name: 'person',
        type: 'tuple',
        components: [
          { name: 'name', type: 'string' },
          { name: 'age', type: 'uint16' },
        ],
      },
    ])
  })
})

// Inference break here on nested named and array tuple.
test('ParseComponents', () => {
  test('Nested Tuples', () => {
    assertType<
      ParseComponents<
        [
          'tuple(tuple(address baby, tuple(tuple(uint tokenId))), address from)[] person',
        ]
      >
    >([
      {
        name: 'person',
        type: 'tuple[]',
        components: [
          {
            name: 'from',
            type: 'address',
          },
          {
            name: '',
            type: 'tuple',
            components: [
              { name: 'baby', type: 'address' },
              {
                name: '',
                type: 'tuple',
                components: [
                  {
                    name: '',
                    type: 'tuple',
                    components: [{ name: 'tokenId', type: 'uint256' }],
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

test('ParseEventArgs', () => {
  assertType<ParseEventArgs<ExtractArgs<EventType>>>([
    {
      name: 'from',
      type: 'address',
      internalType: 'address',
      indexed: true,
    },
    { indexed: true, name: 'to', type: 'address', internalType: 'address' },
    { indexed: false, internalType: 'address', type: 'address', name: 'value' },
  ])
})

test('ParseFunctionArgs and Return', () => {
  test('Function Args', () => {
    assertType<ParseFunctionArgs<ExtractArgs<FuncType>>>([
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ])
  })

  test('Function Return', () => {
    assertType<ParseFunctionReturn<ExtractReturn<FuncType>>>([
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
          indexed: false,
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
          components: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'uint16' },
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
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      outputs: [{ name: 'tokenId', type: 'uint256', internalType: 'uint256' }],
    },
    {
      name: 'addPerson',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'person',
          type: 'tuple',
          components: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'uint16' },
          ],
        },
      ],
      outputs: [],
    },
    {
      name: 'addPeople',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'person',
          type: 'tuple[]',
          components: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'uint16' },
          ],
        },
      ],
      outputs: [],
    },
    {
      name: 'getPerson',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
      outputs: [
        {
          name: 'person',
          type: 'tuple',
          components: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'uint16' },
          ],
        },
      ],
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
          indexed: false,
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
          components: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'uint16' },
          ],
        },
      ],
    },
    {
      name: 'balanceOf',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      outputs: [{ name: 'tokenId', type: 'uint256', internalType: 'uint256' }],
    },
    {
      name: 'addPerson',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'person',
          type: 'tuple',
          components: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'uint16' },
          ],
        },
      ],
      outputs: [],
    },
    {
      name: 'addPeople',
      type: 'function',
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'person',
          type: 'tuple[]',
          components: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'uint16' },
          ],
        },
      ],
      outputs: [],
    },
    {
      name: 'getPerson',
      type: 'function',
      stateMutability: 'view',
      inputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
      outputs: [
        {
          name: 'person',
          type: 'tuple',
          components: [
            { name: 'name', type: 'string' },
            { name: 'age', type: 'uint16' },
          ],
        },
      ],
    },
  ])
})
