import { attest } from '@ark/attest'
import { describe, test } from 'vitest'
import type { erc20Abi } from './abis/json.js'
import type {
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  TypedDataToPrimitiveTypes,
} from './utils.js'

describe('AbiParameterToPrimitiveType', () => {
  test('basic type', () => {
    type Result = AbiParameterToPrimitiveType<{
      name: 'foo'
      type: 'string'
    }>
    attest.instantiations([638, 'instantiations'])
    attest<string>({} as Result)
  })

  test('tuple', () => {
    type Result = AbiParameterToPrimitiveType<
      {
        components: [
          { name: 'name'; type: 'string' },
          { name: 'symbol'; type: 'string' },
          { name: 'description'; type: 'string' },
          { name: 'imageURI'; type: 'string' },
          { name: 'contentURI'; type: 'string' },
          { name: 'price'; type: 'uint' },
          { name: 'limit'; type: 'uint256' },
          { name: 'fundingRecipient'; type: 'address' },
          { name: 'renderer'; type: 'address' },
          { name: 'nonce'; type: 'uint256' },
          { name: 'fee'; type: 'uint16' },
        ]
        internalType: 'struct IWritingEditions.WritingEdition'
        name: 'edition'
        type: 'tuple'
      },
      'inputs'
    >
    attest.instantiations([1238, 'instantiations'])
    attest<{
      name: string
      symbol: string
      description: string
      imageURI: string
      contentURI: string
      price: bigint
      limit: bigint
      fundingRecipient: `0x${string}`
      renderer: `0x${string}`
      nonce: bigint
      fee: number
    }>({} as Result)
    attest({} as Result).type.toString.snap(`{
  name: string
  symbol: string
  description: string
  imageURI: string
  contentURI: string
  price: bigint
  limit: bigint
  fundingRecipient: \`0x\${string}\`
  renderer: \`0x\${string}\`
  nonce: bigint
  fee: number
}`)
  })

  test('array', () => {
    const res = {} as AbiParameterToPrimitiveType<{
      name: 'foo'
      type: 'string[1][2][3]'
    }>
    attest.instantiations([10706, 'instantiations'])
    attest<
      readonly [
        readonly [readonly [string], readonly [string]],
        readonly [readonly [string], readonly [string]],
        readonly [readonly [string], readonly [string]],
      ]
    >(res)
  })
})

describe('TypedDataToPrimitiveTypes', () => {
  test('recursive', () => {
    const res = {} as TypedDataToPrimitiveTypes<{
      Foo: [{ name: 'bar'; type: 'Bar[]' }]
      Bar: [{ name: 'foo'; type: 'Foo[]' }]
    }>
    attest.instantiations([22798, 'instantiations'])
    attest<{
      Foo: {
        bar: readonly {
          foo: readonly [
            "Error: Circular reference detected. 'Foo[]' is a circular reference.",
          ][]
        }[]
      }
      Bar: {
        foo: readonly {
          bar: readonly [
            "Error: Circular reference detected. 'Bar[]' is a circular reference.",
          ][]
        }[]
      }
    }>(res)
  })

  test('deep', () => {
    const res = {} as TypedDataToPrimitiveTypes<{
      Contributor: [
        { name: 'name'; type: 'string' },
        { name: 'address'; type: 'address' },
      ]
      Website: [
        { name: 'domain'; type: 'string' },
        { name: 'webmaster'; type: 'Contributor' },
      ]
      Project: [
        { name: 'name'; type: 'string' },
        { name: 'contributors'; type: 'Contributor[2]' },
        { name: 'website'; type: 'Website' },
      ]
      Organization: [
        { name: 'name'; type: 'string' },
        { name: 'projects'; type: 'Project[]' },
        { name: 'website'; type: 'Website' },
      ]
    }>
    attest.instantiations([24281, 'instantiations'])
    attest<{
      Contributor: {
        name: string
        address: `0x${string}`
      }
      Website: {
        domain: string
        webmaster: {
          name: string
          address: `0x${string}`
        }
      }
      Project: {
        name: string
        contributors: readonly [
          {
            name: string
            address: `0x${string}`
          },
          {
            name: string
            address: `0x${string}`
          },
        ]
        website: {
          domain: string
          webmaster: {
            name: string
            address: `0x${string}`
          }
        }
      }
      Organization: {
        name: string
        projects: readonly {
          name: string
          contributors: readonly [
            {
              name: string
              address: `0x${string}`
            },
            {
              name: string
              address: `0x${string}`
            },
          ]
          website: {
            domain: string
            webmaster: {
              name: string
              address: `0x${string}`
            }
          }
        }[]
        website: {
          domain: string
          webmaster: {
            name: string
            address: `0x${string}`
          }
        }
      }
    }>(res)
  })
})

test('deeply nested parameters', () => {
  const res = {} as AbiParametersToPrimitiveTypes<
    [
      {
        name: 's'
        type: 'tuple'
        components: [
          { name: 'a'; type: 'uint8' },
          { name: 'b'; type: 'uint8[]' },
          {
            name: 'c'
            type: 'tuple[]'
            components: [
              { name: 'x'; type: 'uint8' },
              { name: 'y'; type: 'uint8' },
            ]
          },
        ]
      },
      {
        name: 't'
        type: 'tuple'
        components: [{ name: 'x'; type: 'uint8' }, { name: 'y'; type: 'uint8' }]
      },
      { name: 'a'; type: 'uint8' },
      {
        name: 't'
        type: 'tuple[2]'
        components: [
          { name: 'x'; type: 'uint256' },
          { name: 'y'; type: 'uint256' },
        ]
      },
    ]
  >
  attest.instantiations([11348, 'instantiations'])
  attest<
    [
      s: {
        a: number
        b: readonly number[]
        c: readonly {
          x: number
          y: number
        }[]
      },
      {
        x: number
        y: number
      },
      number,
      readonly [
        {
          x: bigint
          y: bigint
        },
        {
          x: bigint
          y: bigint
        },
      ],
    ]
  >(res)
})

test('self-referencing', () => {
  const res = {} as TypedDataToPrimitiveTypes<{
    Name: [{ name: 'first'; type: 'Name' }, { name: 'last'; type: 'string' }]
  }>
  attest.instantiations([12801, 'instantiations'])
  attest<{
    Name: {
      first: [
        "Error: Cannot convert self-referencing struct 'Name' to primitive type.",
      ]
      last: string
    }
  }>(res)
})

type transferFrom = ExtractAbiFunction<
  typeof erc20Abi,
  'transferFrom'
>['inputs']
test('basic without named tuple', () => {
  type Result = AbiParametersToPrimitiveTypes<transferFrom, 'inputs', false>
  const res = {} as Result
  attest.instantiations([906, 'instantiations'])
  attest<
    readonly [sender: `0x${string}`, recipient: `0x${string}`, amount: bigint]
  >(res)
  attest(res).type.toString.snap(
    'readonly [`0x${string}`, `0x${string}`, bigint]',
  )
})
test('basic with named tuple', () => {
  type Result = AbiParametersToPrimitiveTypes<transferFrom, 'inputs', true>
  const res = {} as Result
  attest.instantiations([1131, 'instantiations'])
  attest<
    readonly [sender: `0x${string}`, recipient: `0x${string}`, amount: bigint]
  >(res)
  attest(res).type.toString.snap(`readonly [
  sender: \`0x\${string}\`,
  recipient: \`0x\${string}\`,
  amount: bigint
]`)
})

type parameters = readonly [
  { name: 'account'; type: 'uint8' },
  { name: 'address'; type: 'uint8' },
  { name: 'admin'; type: 'uint8' },
  { name: 'allowed'; type: 'uint8' },
  { name: 'amount'; type: 'uint8' },
  { name: 'authority'; type: 'uint8' },
  { name: 'available'; type: 'uint8' },
  { name: 'count'; type: 'uint8' },
  { name: 'currency'; type: 'uint8' },
  { name: 'deadline'; type: 'uint8' },
  { name: 'from'; type: 'uint8' },
  { name: 'funder'; type: 'uint8' },
  { name: 'hash'; type: 'address' },
  { name: 'id'; type: 'uint8' },
  { name: 'memo'; type: 'uint8' },
  { name: 'nonce'; type: 'uint8' },
  { name: 'nonceKey'; type: 'uint8' },
  { name: 'owner'; type: 'uint8' },
  { name: 'policyId'; type: 'uint8' },
  { name: 'policyType'; type: 'uint8' },
]
test('without named tuples', () => {
  type Result = AbiParametersToPrimitiveTypes<parameters, 'inputs', false>
  ;({}) as Result
  attest.instantiations([1276, 'instantiations'])
  attest({} as Result).type.toString.snap(`readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  \`0x\${string}\`,
  number,
  number,
  number,
  number,
  number,
  number,
  number
]`)
})
test('with named tuples', () => {
  type Result = AbiParametersToPrimitiveTypes<parameters, 'inputs', true>
  ;({}) as Result
  attest.instantiations([1998, 'instantiations'])
  attest({} as Result).type.toString.snap(`readonly [
  account: number,
  address: number,
  admin: number,
  allowed: number,
  amount: number,
  authority: number,
  available: number,
  count: number,
  currency: number,
  deadline: number,
  from: number,
  funder: number,
  hash: \`0x\${string}\`,
  id: number,
  memo: number,
  nonce: number,
  nonceKey: number,
  owner: number,
  policyId: number,
  policyType: number
]`)
})
