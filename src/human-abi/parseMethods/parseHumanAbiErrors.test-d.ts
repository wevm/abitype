import { expectTypeOf, test } from 'vitest'

import type { DeepReadonly } from '../utils'
import { parseHumanAbiErrors } from './parseHumanAbiErrors'

test('Parse Human Abi', () => {
  expectTypeOf(
    parseHumanAbiErrors([
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
          name: 'InsufficientBalance'
          type: 'error'
          inputs: [
            { name: 'owner'; type: 'account'; internalType: 'account' },
            { name: 'balance'; type: 'uint256'; internalType: 'uint256' },
          ]
        },
      ]
    >
  >
})
