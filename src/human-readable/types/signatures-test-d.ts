import { assertType, expectTypeOf, test } from 'vitest'

import type {
  IsConstructorSignature,
  IsErrorSignature,
  IsEventSignature,
  IsFunctionSignature,
  IsName,
  IsSignature,
  IsSolidityKeyword,
  IsStructSignature,
  IsValidCharacter,
  Signature,
  Signatures,
  SolidityKeywords,
  ValidateName,
} from './signatures.js'

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
})

test('IsFunctionSignature', () => {
  // basic
  assertType<IsFunctionSignature<'function foo()'>>(true)
  assertType<IsFunctionSignature<'function foo() returns (uint256)'>>(true)
  assertType<IsFunctionSignature<'function foo() returns(uint256)'>>(true)
  assertType<IsFunctionSignature<'function foo() view'>>(true)
  assertType<IsFunctionSignature<'function foo() public'>>(true)
  // combinations
  assertType<IsFunctionSignature<'function foo() view returns (uint256)'>>(true)
  assertType<IsFunctionSignature<'function foo() view returns(uint256)'>>(true)
  assertType<IsFunctionSignature<'function foo() public view'>>(true)
  assertType<
    IsFunctionSignature<'function foo() public view returns (uint256)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo() public view returns(uint256)'>
  >(true)
  // params
  assertType<IsFunctionSignature<'function foo(uint256, uint256)'>>(true)
  assertType<IsFunctionSignature<'function foo(uint256) returns (uint256)'>>(
    true,
  )
  assertType<IsFunctionSignature<'function foo(uint256) returns(uint256)'>>(
    true,
  )
  assertType<IsFunctionSignature<'function foo(uint256) view'>>(true)
  assertType<IsFunctionSignature<'function foo(uint256) public'>>(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) view returns (uint256)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) view returns(uint256)'>
  >(true)
  assertType<IsFunctionSignature<'function foo(uint256) public view'>>(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns (uint256)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns(uint256)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns (uint256 tokenId)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns(uint256 tokenId)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns (uint256 tokenId, uint256 balance)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo(uint256) public view returns(uint256 tokenId, uint256 balance)'>
  >(true)

  // invalid
  assertType<IsFunctionSignature<'function ()'>>(false)
  assertType<IsFunctionSignature<'function foo() '>>(false)
  assertType<IsFunctionSignature<'function foo()  public'>>(false)
  assertType<IsFunctionSignature<'function foo() re turns (uint256)'>>(false)
  assertType<IsFunctionSignature<'function foo() re tur ns (uint256)'>>(false)
  assertType<IsFunctionSignature<'foo()'>>(false)
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
  assertType<IsConstructorSignature<'constructor()'>>(true)
  assertType<IsConstructorSignature<'constructor() payable'>>(true)
  assertType<IsConstructorSignature<'constructor(string)'>>(true)
  assertType<IsConstructorSignature<'constructor(string name)'>>(true)
  assertType<IsConstructorSignature<'constructor(string name, string symbol)'>>(
    true,
  )
  assertType<IsConstructorSignature<'constructor(string memory name)'>>(true)
  assertType<IsConstructorSignature<'constructor(string memory name) payable'>>(
    true,
  )

  assertType<IsConstructorSignature<'constructor()payable'>>(false)
  assertType<IsConstructorSignature<'constructor(string'>>(false)
})

test('IsSignature', () => {
  // basic
  assertType<IsSignature<'function foo()'>>(true)
  assertType<IsSignature<'constructor()'>>(true)
  assertType<IsSignature<'fallback() external'>>(true)
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
  // assertType<Signature<'function foo??()'>>([
  //   'Error: Signature "function foo??()" is invalid.',
  // ])
})

test('Signatures', () => {
  assertType<Signatures<['function foo()']>>(['function foo()'])
  assertType<Signatures<['function foo ()']>>([
    ['Error: Signature "function foo ()" is invalid at position 0.'],
  ])
})

test('IsName', () => {
  expectTypeOf<IsName<''>>().toEqualTypeOf<false>()
  expectTypeOf<IsName<'   '>>().toEqualTypeOf<false>()
  expectTypeOf<IsName<'foo'>>().toEqualTypeOf<true>()
  // no whitespace
  expectTypeOf<IsName<' foo'>>().toEqualTypeOf<false>()
  expectTypeOf<IsName<'foo '>>().toEqualTypeOf<false>()
  expectTypeOf<IsName<' foo '>>().toEqualTypeOf<false>()
  // no solidity keywords
  expectTypeOf<IsName<'alias'>>().toEqualTypeOf<false>()
  expectTypeOf<IsName<'copyof'>>().toEqualTypeOf<false>()
  expectTypeOf<IsName<'virtual'>>().toEqualTypeOf<false>()
  // no invalid characters
  // expectTypeOf<IsName<'foo?'>>().toEqualTypeOf<false>()
  // expectTypeOf<IsName<'foo,'>>().toEqualTypeOf<false>()
})

test('ValidateName', () => {
  expectTypeOf<ValidateName<'foo'>>().toEqualTypeOf<'foo'>()
  expectTypeOf<ValidateName<'foo bar'>>().toEqualTypeOf<
    ['Error: Name "foo bar" cannot contain whitespace.']
  >()
  expectTypeOf<ValidateName<'alias'>>().toEqualTypeOf<
    ['Error: "alias" is a protected Solidity keyword.']
  >()
  expectTypeOf<ValidateName<'foo$', true>>().toEqualTypeOf<
    ['Error: "foo$" contains invalid character.']
  >()
})

test('IsSolidityKeyword', () => {
  expectTypeOf<IsSolidityKeyword<SolidityKeywords>>().toEqualTypeOf<true>()
  expectTypeOf<IsSolidityKeyword<'calldata'>>().toEqualTypeOf<true>()
  expectTypeOf<IsSolidityKeyword<'byte'>>().toEqualTypeOf<true>()
  expectTypeOf<IsSolidityKeyword<'memory'>>().toEqualTypeOf<true>()

  expectTypeOf<IsSolidityKeyword<'foo'>>().toEqualTypeOf<false>()
  expectTypeOf<IsSolidityKeyword<'bar'>>().toEqualTypeOf<false>()
})

test('IsValidCharacter', () => {
  expectTypeOf<IsValidCharacter<'A'>>().toEqualTypeOf<true>()
  expectTypeOf<IsValidCharacter<'foobarbaz'>>().toEqualTypeOf<true>()
  expectTypeOf<IsValidCharacter<'123123'>>().toEqualTypeOf<true>()
  expectTypeOf<IsValidCharacter<'___'>>().toEqualTypeOf<true>()
  expectTypeOf<IsValidCharacter<'foo_123'>>().toEqualTypeOf<true>()
  expectTypeOf<IsValidCharacter<'foo_123?'>>().toEqualTypeOf<false>()
  expectTypeOf<IsValidCharacter<'foo!123'>>().toEqualTypeOf<false>()
  expectTypeOf<IsValidCharacter<''>>().toEqualTypeOf<false>()
  expectTypeOf<IsValidCharacter<'         '>>().toEqualTypeOf<false>()
})
