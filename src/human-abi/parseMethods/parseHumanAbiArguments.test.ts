import { expect, test } from 'vitest'

import { parseHumanAbiArguments } from './parseHumanAbiArguments'

test('Parse Parameters', () => {
  console.dir(
    parseHumanAbiArguments(
      ['address owner', '(Demo deno, (string tokenURI))'],
      {
        parseContext: 'function',
        structs: {
          Demo: ['bytes x', 'address d'],
        },
      },
    ),
    { depth: null },
  )
  expect(
    parseHumanAbiArguments(['address cenas', 'NestedVoter vote'], {
      parseContext: 'function',
      structs: {
        Demo: ['bytes  x', 'address payable d'],
        Voter: ['uint weight', 'bool voted', 'address delegate', 'uint vote'],
        NestedVoter: [
          'Voter voter',
          'bool voted',
          'address delegate',
          'uint vote',
        ],
      },
    }),
  ).toMatchInlineSnapshot(`
[
  {
    "internalType": "address",
    "name": "cenas",
    "type": "address",
  },
  {
    "components": [
      {
        "components": [
          {
            "internalType": "uint",
            "name": "weight",
            "type": "uint",
          },
          {
            "internalType": "bool",
            "name": "voted",
            "type": "bool",
          },
          {
            "internalType": "address",
            "name": "delegate",
            "type": "address",
          },
          {
            "internalType": "uint",
            "name": "vote",
            "type": "uint",
          },
        ],
        "internalType": "structVoter",
        "name": "voter",
        "type": "tuple",
      },
      {
        "internalType": "bool",
        "name": "voted",
        "type": "bool",
      },
      {
        "internalType": "address",
        "name": "delegate",
        "type": "address",
      },
      {
        "internalType": "uint",
        "name": "vote",
        "type": "uint",
      },
    ],
    "internalType": "structNestedVoter",
    "name": "vote",
    "type": "tuple",
  },
]`)
})
