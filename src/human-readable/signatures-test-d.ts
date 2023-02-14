import { assertType, test } from 'vitest'

import type {
  IsConstructorSignature,
  IsErrorSignature,
  IsEventSignature,
  IsFallbackSignature,
  IsFunctionSignature,
  IsReceiveSignature,
  IsSignature,
  IsStructSignature,
} from './signatures'

test('FunctionSignature', () => {
  // basic
  assertType<IsFunctionSignature<'function foo()'>>(true)

  // params
  assertType<IsFunctionSignature<'function foo(string bar)'>>(true)
  assertType<IsFunctionSignature<'function foo(string bar, string baz)'>>(true)
  assertType<IsFunctionSignature<'function foo(string bar, (string baz))'>>(
    true,
  )

  // return
  assertType<IsFunctionSignature<'function foo() returns (string bar)'>>(true)
  assertType<
    IsFunctionSignature<'function foo() public pure returns (string bar)'>
  >(true)
  assertType<
    IsFunctionSignature<'function foo() returns (string bar, (string baz))'>
  >(true)

  // invalid
  assertType<IsFunctionSignature<'function ()'>>(false)
  assertType<IsFunctionSignature<'foo()'>>(false)
  assertType<IsFunctionSignature<'function foo(string bar'>>(false)
})

test('ConstructorSignature', () => {
  // basic
  assertType<IsConstructorSignature<'constructor()'>>(true)

  // params
  assertType<IsConstructorSignature<'constructor(string bar)'>>(true)
  assertType<IsConstructorSignature<'constructor(string bar, string baz)'>>(
    true,
  )
  assertType<IsConstructorSignature<'constructor(string bar, (string baz))'>>(
    true,
  )

  // invalid
  assertType<IsConstructorSignature<'constructor(string bar'>>(false)
})

test('FallbackSignature', () => {
  // basic
  assertType<IsFallbackSignature<'fallback()'>>(true)

  // invalid
  assertType<IsFallbackSignature<'fallback() foo'>>(false)
})

test('ReceiveSignature', () => {
  // basic
  assertType<IsReceiveSignature<'receive() external payable'>>(true)

  // invalid
  assertType<IsReceiveSignature<'receive() external'>>(false)
  assertType<IsReceiveSignature<'receive() payable'>>(false)
  assertType<IsReceiveSignature<'receive()'>>(false)
})

test('EventSignature', () => {
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

test('ErrorSignature', () => {
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

test('Signature', () => {
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
