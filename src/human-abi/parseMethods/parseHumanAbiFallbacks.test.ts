import { expect, test } from 'vitest'

import { parseHumanAbiFallbacks } from './parseHumanAbiFallbacks'

test('parseHumanAbiFallbacks runtime', () => {
  expect(
    parseHumanAbiFallbacks([
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
      'fallback()',
      'receive() external payable',
    ]),
  ).toMatchInlineSnapshot(`
[
  {
    "type": "fallback",
  },
  {
    "stateMutability": "payable",
    "type": "receive",
  },
]`)
})
