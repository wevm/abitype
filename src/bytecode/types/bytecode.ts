import type { Abi } from '../../abi'
import type { ParseAbiParameters } from '../../human-readable/types/utils'
import type { Selectors } from './config'
import type { OPCODES, RevertErrorString, RevertPanicString } from './opcodes'
import type {
  ExtractName,
  ExtractParameters,
  IsErrorSelector,
  RecurseSelector,
  Slice,
  ToSelector,
} from './utils'

export type HasConstructor<T extends string> =
  T extends `${string}60033${string}`
    ? true
    : T extends `${string}6343${string}0033${string}`
    ? true
    : T extends `${string}6343${string}000a${string}`
    ? true
    : false

export type FindCommonEventSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['AND']}${OPCODES['PUSH32']}${infer Rest}`
  ? Slice<Rest, 32> extends infer Result extends string
    ? Result extends
        | `${string}ffffffffff${string}`
        | `${string}0000000000${string}`
      ? FindCommonEventSelectors<Rest>
      : [
          {
            type: 'event'
            name: Selectors[`0x${ToSelector<Result>}`] extends string
              ? ExtractName<Selectors[`0x${ToSelector<Result>}`]>
              : `0x${ToSelector<Result>}`
            inputs: Selectors[`0x${ToSelector<Result>}`] extends string
              ? ParseAbiParameters<
                  ExtractParameters<Selectors[`0x${ToSelector<Result>}`]>
                >
              : readonly []
          },
          ...FindCommonEventSelectors<Rest>,
        ]
    : []
  : []

export type FindUncommonEventSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['SWAP1']}${OPCODES['PUSH32']}${infer Rest}`
  ? Slice<Rest, 32> extends infer Result extends string
    ? Result extends
        | `${string}ffffffffff${string}`
        | `${string}0000000000${string}`
      ? FindUncommonEventSelectors<Rest>
      : [
          {
            type: 'event'
            name: Selectors[`0x${ToSelector<Result>}`] extends string
              ? ExtractName<Selectors[`0x${ToSelector<Result>}`]>
              : `0x${ToSelector<Result>}`
            inputs: Selectors[`0x${ToSelector<Result>}`] extends string
              ? ParseAbiParameters<
                  ExtractParameters<Selectors[`0x${ToSelector<Result>}`]>
                >
              : readonly []
          },
          ...FindUncommonEventSelectors<Rest>,
        ]
    : []
  : []

export type FindSwap2EventSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['SWAP2']}${OPCODES['PUSH32']}${infer Rest}`
  ? Slice<Rest, 32> extends infer Result extends string
    ? Result extends
        | `${string}ffffffffff${string}`
        | `${string}0000000000${string}`
      ? FindSwap2EventSelectors<Rest>
      : [
          {
            type: 'event'
            name: Selectors[`0x${ToSelector<Result>}`] extends string
              ? ExtractName<Selectors[`0x${ToSelector<Result>}`]>
              : `0x${ToSelector<Result>}`
            inputs: Selectors[`0x${ToSelector<Result>}`] extends string
              ? ParseAbiParameters<
                  ExtractParameters<Selectors[`0x${ToSelector<Result>}`]>
                >
              : readonly []
          },

          ...FindSwap2EventSelectors<Rest>,
        ]
    : []
  : []

export type FindYulTypeErrorSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['JUMPDEST']}${OPCODES['PUSH4']}${infer Hash}4601cfd${infer Rest}`
  ? IsErrorSelector<Hash> extends false
    ? FindYulTypeErrorSelectors<`${Hash}4601cfd${Rest}`>
    : [
        {
          type: 'error'
          name: Selectors[`0x${ToSelector<Hash>}`] extends string
            ? ExtractName<Selectors[`0x${ToSelector<Hash>}`]>
            : `0x${ToSelector<Hash>}`
          inputs: Selectors[`0x${ToSelector<Hash>}`] extends string
            ? ParseAbiParameters<
                ExtractParameters<Selectors[`0x${ToSelector<Hash>}`]>
              >
            : readonly []
        },
        ...FindYulTypeErrorSelectors<Rest>,
      ]
  : []

export type FindYulUncommonTypeErrorSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['JUMPDEST']}${OPCODES['POP']}${OPCODES['PUSH4']}${infer Hash}4601cfd${infer Rest}`
  ? IsErrorSelector<Hash> extends false
    ? FindYulUncommonTypeErrorSelectors<`${Hash}4601cfd${Rest}`>
    : [
        {
          type: 'error'
          name: Selectors[`0x${ToSelector<Hash>}`] extends string
            ? ExtractName<Selectors[`0x${ToSelector<Hash>}`]>
            : `0x${ToSelector<Hash>}`
          inputs: Selectors[`0x${ToSelector<Hash>}`] extends string
            ? ParseAbiParameters<
                ExtractParameters<Selectors[`0x${ToSelector<Hash>}`]>
              >
            : readonly []
        },
        ...FindYulUncommonTypeErrorSelectors<Rest>,
      ]
  : []

export type FindSolidityCommonErrorSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['MLOAD']}${OPCODES['PUSH32']}${infer Hash}815260040160405180910390fd${infer Rest}`
  ? Hash extends RevertErrorString | RevertPanicString
    ? FindSolidityCommonErrorSelectors<Rest>
    : [
        {
          type: 'error'
          name: Selectors[`0x${ToSelector<Hash>}`] extends string
            ? ExtractName<Selectors[`0x${ToSelector<Hash>}`]>
            : `0x${ToSelector<Hash>}`

          inputs: Selectors[`0x${ToSelector<Hash>}`] extends string
            ? ParseAbiParameters<
                ExtractParameters<Selectors[`0x${ToSelector<Hash>}`]>
              >
            : readonly []
        },
        ...FindSolidityCommonErrorSelectors<Rest>,
      ]
  : []

export type FindSolidityUncommonErrorSelectors<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['MLOAD']}${OPCODES['PUSH4']}${infer Hash}815260040160405180910390fd${infer Rest}`
  ? [
      {
        type: 'error'
        name: Selectors[`0x${ToSelector<Hash>}`] extends string
          ? ExtractName<Selectors[`0x${ToSelector<Hash>}`]>
          : `0x${ToSelector<Hash>}`
        inputs: Selectors[`0x${ToSelector<Hash>}`] extends string
          ? ParseAbiParameters<
              ExtractParameters<Selectors[`0x${ToSelector<Hash>}`]>
            >
          : readonly []
      },
      ...FindSolidityUncommonErrorSelectors<Rest>,
    ]
  : []

export type ParseBytecodeFunctions<T extends string> = T extends ''
  ? []
  : T extends `${string}${OPCODES['DUP1']}${OPCODES['PUSH4']}${infer Selector}${OPCODES['EQ']}${OPCODES['PUSH2']}${string}${OPCODES['JUMPI']}${infer Rest extends string}`
  ? [
      {
        readonly type: 'function'
        readonly name: Selector extends `${string}${OPCODES['DUP1']}${OPCODES['PUSH4']}${infer Tail}`
          ? RecurseSelector<Tail> extends infer Result extends string
            ? Selectors[Result] extends string
              ? ExtractName<Selectors[Result]>
              : Result
            : never
          : Selectors[`0x${Selector}`] extends string
          ? ExtractName<Selectors[`0x${Selector}`]>
          : `0x${Selector}`
        readonly inputs: Selectors[`0x${Selector}`] extends string
          ? ParseAbiParameters<ExtractParameters<Selectors[`0x${Selector}`]>>
          : readonly []
        readonly stateMutability: 'nonpayable'
        readonly outputs: []
      },
      ...ParseBytecodeFunctions<Rest>,
    ]
  : []

export type ParseBytecodeErrors<T extends string> = [
  ...FindYulTypeErrorSelectors<T>,
  ...FindYulUncommonTypeErrorSelectors<T>,
  ...FindSolidityCommonErrorSelectors<T>,
  ...FindSolidityUncommonErrorSelectors<T>,
]

export type ParseBytecodeEvents<T extends string> = [
  ...FindCommonEventSelectors<T>,
  ...FindUncommonEventSelectors<T>,
  ...FindSwap2EventSelectors<T>,
]

export type ParseBytecodeConstructor<T extends string> =
  HasConstructor<T> extends true
    ? [
        {
          readonly type: 'constructor'
          readonly stateMutability: 'nonpayable'
          readonly inputs: []
        },
      ]
    : []

export type ParseBytecode<T extends string> = string extends T
  ? Abi
  : readonly [
      ...ParseBytecodeConstructor<T>,
      ...ParseBytecodeErrors<T>,
      ...ParseBytecodeEvents<T>,
      ...ParseBytecodeFunctions<T>,
    ]
