import { expectTypeOf, test } from 'vitest'

import type { DeepReadonly } from '../utils'
import { parseHumanAbiFunctions } from './parseHumanAbiFunctions'

test('Parse Human Abi Functions', () => {
  expectTypeOf(
    parseHumanAbiFunctions([
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
    ]),
  ).toEqualTypeOf<
    DeepReadonly<
      [
        {
          name: 'foo'
          type: 'function'
          stateMutability: 'view'
          payable: false
          constant: true
          inputs: [
            {
              name: 'bar'
              internalType: 'Struct Foo'
              type: 'tuple'
              components: [
                { name: 'name'; internalType: 'string'; type: 'string' },
                {
                  name: 'color'
                  type: 'tuple'
                  internalType: 'Struct Color'
                  components: [
                    { name: 'red'; type: 'uint8'; internalType: 'uint8' },
                    { name: 'green'; internalType: 'uint8'; type: 'uint8' },
                    { name: 'blue'; type: 'uint8'; internalType: 'uint8' },
                  ]
                },
              ]
            },
          ]
          outputs: [{ name: ''; type: 'string'; internalType: 'string' }]
        },
        {
          name: 'transferFrom'
          type: 'function'
          constant: false
          payable: false
          stateMutability: 'nonpayable'
          inputs: [
            { name: 'from'; type: 'address'; internalType: 'address' },
            { name: 'to'; type: 'address'; internalType: 'address' },
            { name: 'value'; internalType: 'uint256'; type: 'uint256' },
          ]
          outputs: []
        },
        {
          name: 'balanceOf'
          stateMutability: 'view'
          payable: false
          constant: true
          type: 'function'
          inputs: [{ name: 'owner'; type: 'address'; internalType: 'address' }]
          outputs: [
            { name: 'balance'; type: 'uint256'; internalType: 'uint256' },
          ]
        },
        {
          name: 'addPerson'
          type: 'function'
          stateMutability: 'nonpayable'
          payable: false
          constant: false
          inputs: [
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
          outputs: []
        },
        {
          name: 'addPeople'
          type: 'function'
          stateMutability: 'nonpayable'
          payable: false
          constant: false
          inputs: [
            {
              name: 'person'
              type: 'tuple[]'
              internalType: 'Struct[] person'
              components: [
                { name: 'name'; type: 'string'; internalType: 'string' },
                { name: 'age'; type: 'uint16'; internalType: 'uint16' },
              ]
            },
          ]
          outputs: []
        },
        {
          name: 'getPerson'
          type: 'function'
          stateMutability: 'view'
          constant: true
          payable: false
          inputs: [{ name: 'id'; type: 'uint256'; internalType: 'uint256' }]
          outputs: [
            {
              name: ''
              type: 'tuple'
              internalType: 'Struct'
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
