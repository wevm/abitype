import type { RevertErrorString, RevertPanicString } from './mask'
import type { OPCODES } from './opcodes'
import type { RecurseSelector, ToSelector } from './utils'

export type FindFunctionSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['DUP1']}${OPCODES['PUSH4']}${infer Selector}${OPCODES['EQ']}${
      | OPCODES['PUSH2']
      | OPCODES['PUSH3']}${string}${OPCODES['JUMPI']}${infer Rest extends string}`
  ? [
      {
        type: 'function'
        selector: Selector extends `${string}${OPCODES['DUP1']}${OPCODES['PUSH4']}${infer Tail}`
          ? RecurseSelector<Tail>
          : `0x${Selector}`
      },
      ...FindFunctionSelectors<Rest>,
    ]
  : T extends `${string}${OPCODES['DUP1']}${OPCODES['PUSH4']}${infer Selector}${
      | OPCODES['GT']
      | OPCODES['LT']}${
      | OPCODES['PUSH2']
      | OPCODES['PUSH3']}${string}${OPCODES['JUMPI']}${infer Rest extends string}`
  ? [
      {
        type: 'function'
        selector: Selector extends `${string}${OPCODES['DUP1']}${OPCODES['PUSH4']}${infer Tail}`
          ? RecurseSelector<Tail>
          : `0x${Selector}`
      },
      ...FindFunctionSelectors<Rest>,
    ]
  : []

export type FindEventSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['AND']}${OPCODES['PUSH32']}${infer Hash}60405180910390${OPCODES['LOG4']}${infer Rest}`
  ? [
      { type: 'event'; selector: `0x${ToSelector<Hash>}` },
      ...FindEventSelectors<Rest>,
    ]
  : T extends `${string}${OPCODES['AND']}${OPCODES['PUSH32']}${infer Hash}60405180910390${OPCODES['LOG3']}${infer Rest}`
  ? [
      { type: 'event'; selector: `0x${ToSelector<Hash>}` },
      ...FindEventSelectors<Rest>,
    ]
  : T extends `${string}${OPCODES['AND']}${OPCODES['PUSH32']}${infer Hash}60405180910390${OPCODES['LOG2']}${infer Rest}`
  ? [
      { type: 'event'; selector: `0x${ToSelector<Hash>}` },
      ...FindEventSelectors<Rest>,
    ]
  : T extends `${string}${OPCODES['AND']}${OPCODES['PUSH32']}${infer Hash}60405180910390${OPCODES['LOG1']}${infer Rest}`
  ? [
      { type: 'event'; selector: `0x${ToSelector<Hash>}` },
      ...FindEventSelectors<Rest>,
    ]
  : T extends `${string}${OPCODES['AND']}${OPCODES['PUSH32']}${infer Hash}60405180910390${OPCODES['LOG0']}${infer Rest}`
  ? [
      { type: 'event'; selector: `0x${ToSelector<Hash>}` },
      ...FindEventSelectors<Rest>,
    ]
  : []

export type FindConstructorArgs<T extends string> =
  T extends `${string}60033${infer Args}` ? Args : ''

export type FindErrorSelectors<T extends string> = T extends ''
  ? []
  : // This means that we have a revert string. We don't care since these aren't on the contracts compiled ABI.
  T extends `${string}${OPCODES['MLOAD']}${OPCODES['PUSH32']}${RevertErrorString}${OPCODES['DUP2']}${OPCODES['MSTORE']}${string}${OPCODES['REVERT']}${infer Rest}`
  ? [...FindErrorSelectors<Rest>]
  : // This means that we have a panic error. We don't care since these aren't on the contracts compiled ABI.
  T extends `${string}${OPCODES['MLOAD']}${OPCODES['PUSH32']}${RevertPanicString}${OPCODES['DUP2']}${OPCODES['MSTORE']}${string}${OPCODES['REVERT']}${infer Rest}`
  ? [...FindErrorSelectors<Rest>]
  : T extends `${string}${OPCODES['MLOAD']}${OPCODES['PUSH32']}${infer Error}${OPCODES['DUP2']}${OPCODES['MSTORE']}${string}${OPCODES['REVERT']}${infer Rest}`
  ? [
      { type: 'error'; selector: `0x${ToSelector<Error>}` },
      ...FindErrorSelectors<Rest>,
    ]
  : []

export type ExtractSelectors<T extends string> = [
  { type: 'constructor'; selector: FindConstructorArgs<T> },
  ...FindErrorSelectors<T>,
  ...FindEventSelectors<T>,
  ...FindFunctionSelectors<T>,
]
