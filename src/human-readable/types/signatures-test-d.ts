import { assertType, test } from 'vitest'

import type {
  IsErrorSignature,
  IsEventSignature,
  IsFunctionSignature,
  IsSignature,
  IsStructSignature,
  Lexer,
  ProtectedKeywords,
  Signature,
  Signatures,
  isConstructorSignature,
  isProtectedKeyword,
} from './signatures'

test('IsErrorSignature', () => {
  // basic
  assertType<IsErrorSignature<'error Foo()'>>(true)

  // params
  assertType<IsErrorSignature<'error Foo(string bar)'>>(true)
  assertType<IsErrorSignature<'error Foo(string bar, string baz)'>>(true)
  assertType<IsErrorSignature<'error Foo(string bar, (string baz))'>>(true)

  // invalid
  assertType<IsErrorSignature<'error ()'>>(false)
  assertType<IsErrorSignature<'Foo()'>>(false)
  assertType<IsErrorSignature<'error Foo(string bar'>>(false)

  assertType<IsErrorSignature<'error Foo(string,)'>>(false)
  assertType<IsErrorSignature<'error Foo(string, string name,)'>>(false)
  assertType<IsErrorSignature<'error Foo(string calldata)'>>(false)
  assertType<IsErrorSignature<'error Foo(string memory)'>>(false)
  assertType<IsErrorSignature<'error Foo(string storage)'>>(false)
  assertType<IsErrorSignature<'error Foo(string indexed)'>>(false)
  assertType<IsErrorSignature<'error Foo(string calldata name)'>>(false)
  assertType<IsErrorSignature<'error Foo(string memory name)'>>(false)
  assertType<IsErrorSignature<'error Foo(string storage name)'>>(false)
  assertType<IsErrorSignature<'error Foo(string indexed name)'>>(false)
  assertType<IsErrorSignature<'error Foo((string) calldata)'>>(false)
  assertType<IsErrorSignature<'event Foo((string) indexed name)'>>(false)
})

test('IsEventSignature', () => {
  // basic
  assertType<IsEventSignature<'event Foo()'>>(true)

  // params
  assertType<IsEventSignature<'event Foo(string bar)'>>(true)
  assertType<IsEventSignature<'event Foo(string bar, string baz)'>>(true)
  assertType<IsEventSignature<'event Foo(string bar, (string baz))'>>(true)

  // invalid
  assertType<IsEventSignature<'event ()'>>(false)
  assertType<IsEventSignature<'Foo()'>>(false)
  assertType<IsEventSignature<'event Foo(string bar'>>(false)

  assertType<IsEventSignature<'event Foo(string,)'>>(false)
  assertType<IsEventSignature<'event Foo(string, string name,)'>>(false)
  assertType<IsEventSignature<'event Foo(string calldata)'>>(false)
  assertType<IsEventSignature<'event Foo(string memory)'>>(false)
  assertType<IsEventSignature<'event Foo(string storage)'>>(false)
  assertType<IsEventSignature<'event Foo(string calldata name)'>>(false)
  assertType<IsEventSignature<'event Foo(string memory name)'>>(false)
  assertType<IsEventSignature<'event Foo(string storage name)'>>(false)
  assertType<IsEventSignature<'event Foo((string) calldata)'>>(false)
  assertType<IsEventSignature<'event Foo((string) calldata name)'>>(false)
})

test('IsFunctionSignature', () => {
  // basic
  assertType<IsFunctionSignature<'function foo()'>>(true)
  assertType<IsFunctionSignature<'function foo() returns (uint256)'>>(true)
  assertType<IsFunctionSignature<'function foo() view'>>(true)
  assertType<IsFunctionSignature<'function foo() public'>>(true)
  // combinations
  assertType<IsFunctionSignature<'function foo() view returns (uint256)'>>(true)
  assertType<IsFunctionSignature<'function foo() public view'>>(true)
  assertType<
    IsFunctionSignature<'function foo() public view returns (uint256)'>
  >(true)
  // params
  assertType<IsFunctionSignature<'function foo(uint256, uint256)'>>(true)
  assertType<IsFunctionSignature<'function foo(uint256) returns (uint256)'>>(
    true,
  )
  assertType<IsFunctionSignature<'function foo(uint256) view'>>(true)
  assertType<IsFunctionSignature<'function foo(uint256) public'>>(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) view returns (uint256)'>
  >(true)
  assertType<IsFunctionSignature<'function foo(uint256) public view'>>(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns (uint256)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns (uint256 tokenId)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns (uint256 tokenId, uint256 balance)'>
  >(true)

  // invalid
  assertType<IsFunctionSignature<'function ()'>>(false)
  assertType<IsFunctionSignature<'function foo() '>>(false)
  assertType<IsFunctionSignature<'function foo()  public'>>(false)
  assertType<IsFunctionSignature<'function foo() re turns (uint256)'>>(false)
  assertType<IsFunctionSignature<'function foo() re tur ns (uint256)'>>(false)
  assertType<IsFunctionSignature<'foo()'>>(false)

  assertType<IsFunctionSignature<'function foo(string,)'>>(false)
  assertType<IsFunctionSignature<'function foo(string, string name,)'>>(false)
  assertType<
    IsFunctionSignature<'function foo(string, string name) returns (string name,)'>
  >(false)
  assertType<
    IsFunctionSignature<'function foo(string, string name) external returns (string name,)'>
  >(false)
  assertType<
    IsFunctionSignature<'function foo(string, string name) external view returns (string name,)'>
  >(false)
  assertType<
    IsFunctionSignature<'function foo(string, string name) returns (string name, string symbol,)'>
  >(false)
  assertType<
    IsFunctionSignature<'function foo(string, string name) external returns (string name, string symbol,)'>
  >(false)
  assertType<
    IsFunctionSignature<'function foo(string, string name) external view returns (string name, string symbol,)'>
  >(false)
  assertType<IsFunctionSignature<'function foo(string indexed)'>>(false)
  assertType<IsFunctionSignature<'function foo(string indexed name)'>>(false)
  assertType<IsFunctionSignature<'function foo((string) indexed)'>>(false)
  assertType<IsFunctionSignature<'function foo((string) indexed name)'>>(false)
})

test('IsStructSignature', () => {
  // basic
  assertType<IsStructSignature<'struct Foo {}'>>(true)

  // properties
  assertType<IsStructSignature<'struct Foo { string bar; }'>>(true)
  assertType<IsStructSignature<'struct Foo { string bar; string baz; }'>>(true)
  assertType<IsStructSignature<'struct Foo { string bar; (string baz) baz; }'>>(
    true,
  )

  // invalid
  assertType<IsStructSignature<'struct {}'>>(false)
  assertType<IsStructSignature<'Foo {}'>>(false)
  assertType<IsStructSignature<'struct Foo {string bar'>>(false)
})

test('IsConstructorSignature', () => {
  assertType<isConstructorSignature<'constructor()'>>(true)
  assertType<isConstructorSignature<'constructor(string)'>>(true)
  assertType<isConstructorSignature<'constructor(string name)'>>(true)
  assertType<isConstructorSignature<'constructor(string name, string symbol)'>>(
    true,
  )
  assertType<isConstructorSignature<'constructor(string memory name)'>>(true)

  assertType<isConstructorSignature<'constructor(,)'>>(false)

  assertType<isConstructorSignature<'constructor(string name,)'>>(false)
  assertType<
    isConstructorSignature<'constructor(string name, string symbol,)'>
  >(false)
})
test('IsSignature', () => {
  // basic
  assertType<IsSignature<'function foo()'>>(true)
  assertType<IsSignature<'constructor()'>>(true)
  assertType<IsSignature<'fallback()'>>(true)
  assertType<IsSignature<'receive() external payable'>>(true)
  assertType<IsSignature<'event Foo()'>>(true)
  assertType<IsSignature<'error Foo()'>>(true)
  assertType<IsSignature<'struct Foo {}'>>(true)

  // invalid
  assertType<IsSignature<'foo()'>>(false)
  assertType<IsSignature<'function ()'>>(false)
  assertType<IsSignature<'constructor ()'>>(false)
  assertType<IsSignature<'fallback ()'>>(false)
  assertType<IsSignature<'receive() payable'>>(false)
  assertType<IsSignature<'event ()'>>(false)
  assertType<IsSignature<'error ()'>>(false)
  assertType<IsSignature<'struct {}'>>(false)
})

test('Signature', () => {
  assertType<Signature<'function foo()'>>('function foo()')
  assertType<Signature<'function foo ()'>>([
    'Error: Signature "function foo ()" is invalid.',
  ])
  assertType<Signature<'function foo??()'>>([
    'Error: Signature "function foo??()" is invalid.',
  ])
})

test('Signatures', () => {
  assertType<Signatures<['function foo()']>>(['function foo()'])
  assertType<Signatures<['function foo ()']>>([
    ['Error: Signature "function foo ()" is invalid at position 0.'],
  ])
})

test('SolidityLexer', () => {
  assertType<Lexer<'A'>>(true)
  assertType<Lexer<'thisisavalidstring'>>(true)
  assertType<Lexer<'thisisavalidstringwithnumber012345'>>(true)
  assertType<Lexer<'thisisavalidstringwithnumber012345and_'>>(true)
  assertType<Lexer<'invalid?'>>(false)
  assertType<Lexer<'invalid!'>>(false)
})

test('Protected Keywords', () => {
  assertType<isProtectedKeyword<ProtectedKeywords>>(true)
  assertType<isProtectedKeyword<'   calldata    '>>(true)
  assertType<isProtectedKeyword<'           byte'>>(true)
  assertType<isProtectedKeyword<'memory         '>>(true)

  // Not protected
  assertType<isProtectedKeyword<'normalname'>>(false)
  assertType<isProtectedKeyword<'normalname    '>>(false)
  assertType<isProtectedKeyword<'    normalname'>>(false)
  assertType<isProtectedKeyword<'  normalname  '>>(false)
})
