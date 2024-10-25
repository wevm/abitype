import { expectTypeOf, test } from 'vitest'

import type { SignatureAbiItem } from './signatureAbiItem.js'

test('SignatureAbiItem: function', () => {
  expectTypeOf<
    SignatureAbiItem<{
      name: 'balanceOf'
      type: 'function'
      stateMutability: 'view'
      inputs: [{ type: 'address' }, { type: 'address' }]
      outputs: [{ name: 'balance'; type: 'uint256' }]
    }>
  >().toEqualTypeOf<'balanceOf(address,address)'>()
  expectTypeOf<
    SignatureAbiItem<{
      name: 'balanceOf'
      type: 'function'
      stateMutability: 'view'
      inputs: [{ type: 'address' }]
      outputs: [{ name: 'balance'; type: 'uint256' }]
    }>
  >().toEqualTypeOf<'balanceOf(address)'>()
  expectTypeOf<
    SignatureAbiItem<{
      name: 'balanceOf'
      type: 'function'
      stateMutability: 'view'
      inputs: []
      outputs: [{ name: 'balance'; type: 'uint256' }]
    }>
  >().toEqualTypeOf<'balanceOf()'>()
  expectTypeOf<
    SignatureAbiItem<{
      type: 'function'
      name: 'foo'
      stateMutability: 'view'
      inputs: [
        {
          type: 'tuple'
          name: 'config'
          components: [{ type: 'uint16'; name: '' }, { type: 'bool'; name: '' }]
        },
      ]
      outputs: []
    }>
  >().toEqualTypeOf<'foo((uint16,bool))'>()
  expectTypeOf<
    SignatureAbiItem<{
      type: 'function'
      name: 'foo'
      stateMutability: 'view'
      inputs: [
        {
          type: 'tuple[]'
          name: 'config'
          components: [{ type: 'uint16'; name: '' }, { type: 'bool'; name: '' }]
        },
      ]
      outputs: []
    }>
  >().toEqualTypeOf<'foo((uint16,bool)[])'>()
})

test('SignatureAbiItem: event', () => {
  expectTypeOf<
    SignatureAbiItem<{
      readonly name: 'foo'
      readonly type: 'event'
      readonly inputs: [{ type: 'uint256' }, { type: 'uint256' }]
    }>
  >().toEqualTypeOf<'foo(uint256,uint256)'>()
  expectTypeOf<
    SignatureAbiItem<{
      readonly name: 'foo'
      readonly type: 'event'
      readonly inputs: [{ type: 'uint256' }]
    }>
  >().toEqualTypeOf<'foo(uint256)'>()
  expectTypeOf<
    SignatureAbiItem<{
      readonly name: 'foo'
      readonly type: 'event'
      readonly inputs: []
    }>
  >().toEqualTypeOf<'foo()'>()
  expectTypeOf<
    SignatureAbiItem<{
      name: 'foo'
      type: 'event'
      inputs: [{ type: 'tuple'; components: [{ type: 'uint256' }] }]
    }>
  >().toEqualTypeOf<'foo((uint256))'>()
  expectTypeOf<
    SignatureAbiItem<{
      name: 'foo'
      type: 'event'
      inputs: [{ type: 'tuple[]'; components: [{ type: 'uint256' }] }]
    }>
  >().toEqualTypeOf<'foo((uint256)[])'>()
})
