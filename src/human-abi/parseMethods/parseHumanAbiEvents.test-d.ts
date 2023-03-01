import { expectTypeOf, test } from 'vitest'

import type { DeepReadonly } from '../utils'
import { parseHumanAbiEvents } from './parseHumanAbiEvents'

test('Parse Human Abi', () => {
  const abi = [
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
  ] as const
  expectTypeOf(
    parseHumanAbiEvents(abi, {
      parseContext: 'event',
      structTypes: new WeakSet(),
    }),
  ).toEqualTypeOf<
    DeepReadonly<
      [
        {
          name: 'Foo'
          type: 'event'
          anonymous: false
          inputs: [
            {
              name: 'bar'
              type: 'tuple'
              internalType: 'Struct Foo'
              components: [
                { name: 'name'; type: 'string'; internalType: 'string' },
                {
                  name: 'color'
                  type: 'tuple'
                  internalType: 'Struct Color'
                  components: [
                    { name: 'red'; type: 'uint8'; internalType: 'uint8' },
                    { name: 'green'; type: 'uint8'; internalType: 'uint8' },
                    { name: 'blue'; type: 'uint8'; internalType: 'uint8' },
                  ]
                },
              ]
            },
          ]
        },
        {
          name: 'Transfer'
          type: 'event'
          anonymous: false
          inputs: [
            {
              name: 'from'
              type: 'address'
              internalType: 'address'
              indexed: true
            },
            {
              name: 'to'
              type: 'address'
              indexed: true
              internalType: 'address'
            },
            { name: 'value'; type: 'address'; internalType: 'address' },
          ]
        },
        {
          name: 'PersonAdded'
          type: 'event'
          anonymous: false
          inputs: [
            {
              name: 'id'
              type: 'uint256'
              internalType: 'uint256'
              indexed: true
            },
            {
              name: 'person'
              type: 'tuple'
              internalType: 'Struct person'
              components: [
                { name: 'name'; type: 'string'; internalType: 'string' },
                { name: 'age'; internalType: 'uint16'; type: 'uint16' },
              ]
            },
          ]
        },
      ]
    >
  >
})
