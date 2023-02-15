import type { ParseAbi } from './utils'
import { parseAbi } from './utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Result = ParseAbi<
  // ^?
  [
    'error Foo(address bar)',
    'event Foo(address indexed bar)',
    'struct Foo { address bar; }',

    'function foo()',
    // basic
    'function foo() returns (uint256)',
    'function foo() view',
    'function foo() public',
    // combinations
    'function foo() view returns (uint256)',
    'function foo() public view',
    'function foo() public view returns (uint256)',
    // params
    'function foo(uint256, uint256)',
    'function foo(uint256) returns (uint256)',
    'function foo(uint256) view',
    'function foo(uint256) public',
    'function foo(uint256) view returns (uint256)',
    'function foo(uint256) public view',
    'function foo(uint256) public view returns (uint256)',

    'constructor(address indexed bar)',
    'fallback()',
    'receive() external payable',
  ]
>

const res = parseAbi(
  //  ^?
  [
    'error Foo(address bar)',
    'event Foo(address indexed bar)',
    'struct Foo { address bar; }',

    'function foo()',
    // basic
    'function foo() returns (uint256)',
    'function foo() view',
    'function foo() public',
    // combinations
    'function foo() view returns (uint256)',
    'function foo() public view',
    'function foo() public view returns (uint256)',
    // params
    'function foo(uint256, uint256)',
    'function foo(uint256) returns (uint256)',
    'function foo(uint256) view',
    'function foo(uint256) public',
    'function foo(uint256) view returns (uint256)',
    'function foo(uint256) public view',
    'function foo(uint256) public view returns (uint256)',

    'constructor(address indexed bar)',
    'fallback()',
    'receive() external payable',
  ] as const,
)
