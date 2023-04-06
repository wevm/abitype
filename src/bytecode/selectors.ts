import type { RevertErrorString, RevertPanicString } from './mask'
import type { OPCODES } from './opcodes'
import type {
  IsErrorSelector,
  RecurseSelector,
  Slice,
  ToSelector,
} from './utils'

export type FindConstructorArgs<T extends string> =
  T extends `${string}60033${infer Args}`
    ? Args
    : T extends `${string}6343${string}0033${infer Args}`
    ? Args
    : T extends `${string}6343${string}000a${infer Args}`
    ? Args
    : ''

export type FindFunctionSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['DUP1']}${OPCODES['PUSH4']}${infer Selector}${OPCODES['EQ']}${OPCODES['PUSH2']}${string}${OPCODES['JUMPI']}${infer Rest extends string}`
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

export type FindCommonEventSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['AND']}${OPCODES['PUSH32']}${infer Rest}`
  ? Slice<Rest, 16> extends infer Result extends string
    ? Result extends `${string}ffff${string}` | `${string}0000${string}`
      ? FindCommonEventSelectors<Rest>
      : [
          { type: 'event'; selector: `0x${ToSelector<Result>}` },
          ...FindCommonEventSelectors<Rest>,
        ]
    : []
  : []

export type FindUncommonEventSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['SWAP1']}${OPCODES['PUSH32']}${infer Rest}`
  ? Slice<Rest, 16> extends infer Result extends string
    ? Result extends `${string}ffff${string}` | `${string}0000${string}`
      ? FindUncommonEventSelectors<Rest>
      : [
          { type: 'event'; selector: `0x${ToSelector<Result>}` },
          ...FindUncommonEventSelectors<Rest>,
        ]
    : []
  : []

export type FindSwap2EventSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['SWAP2']}${OPCODES['PUSH32']}${infer Rest}`
  ? Slice<Rest, 16> extends infer Result extends string
    ? Result extends `${string}ffff${string}` | `${string}0000${string}`
      ? FindSwap2EventSelectors<Rest>
      : [
          { type: 'event'; selector: `0x${ToSelector<Result>}` },
          ...FindSwap2EventSelectors<Rest>,
        ]
    : []
  : []

export type FindEventSelectors<T extends string> = [
  ...FindCommonEventSelectors<T>,
  ...FindUncommonEventSelectors<T>,
  ...FindSwap2EventSelectors<T>,
]

export type FindYulTypeErrorSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['JUMPDEST']}${OPCODES['PUSH4']}${infer Hash}4601cfd${infer Rest}`
  ? IsErrorSelector<Hash> extends infer Result
    ? Result extends false
      ? FindYulTypeErrorSelectors<`${Hash}4601cfd${Rest}`>
      : [
          { type: 'error'; selector: `0x${ToSelector<Hash>}` },
          ...FindYulTypeErrorSelectors<Rest>,
        ]
    : []
  : []

export type FindYulUncommonTypeErrorSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['JUMPDEST']}${OPCODES['POP']}${OPCODES['PUSH4']}${infer Hash}4601cfd${infer Rest}`
  ? IsErrorSelector<Hash> extends infer Result
    ? Result extends false
      ? FindYulUncommonTypeErrorSelectors<`${Hash}4601cfd${Rest}`>
      : [
          { type: 'error'; selector: `0x${ToSelector<Hash>}` },
          ...FindYulUncommonTypeErrorSelectors<Rest>,
        ]
    : []
  : []

export type FindSolidityCommonErrorSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['MLOAD']}${OPCODES['PUSH32']}${infer Hash}815260040160405180910390fd${infer Rest}`
  ? Hash extends RevertErrorString | RevertPanicString
    ? FindSolidityCommonErrorSelectors<Rest>
    : [
        { type: 'error'; selector: `0x${ToSelector<Hash>}` },
        ...FindSolidityCommonErrorSelectors<Rest>,
      ]
  : []

export type FindSolidityUncommonErrorSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['MLOAD']}${OPCODES['PUSH4']}${infer Hash}815260040160405180910390fd${infer Rest}`
  ? [
      { type: 'error'; selector: `0x${ToSelector<Hash>}` },
      ...FindSolidityUncommonErrorSelectors<Rest>,
    ]
  : []

export type FindErrorSelectors<T extends string> = [
  ...FindYulTypeErrorSelectors<T>,
  ...FindYulUncommonTypeErrorSelectors<T>,
  ...FindSolidityCommonErrorSelectors<T>,
  ...FindSolidityUncommonErrorSelectors<T>,
]

export type ExtractSelectors<T extends string> = [
  { type: 'constructor'; selector: FindConstructorArgs<T> },
  ...FindErrorSelectors<T>,
  ...FindEventSelectors<T>,
  ...FindFunctionSelectors<T>,
]
