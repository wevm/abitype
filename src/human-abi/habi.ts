import type {
  AbiIndexed,
  AbiMutability,
  AbiTypes,
  CustomSplit,
  Remove,
  SolidityType,
  Trim,
  WS,
  hasTupleValue,
  isTupleValue,
} from './utils'

export type ExtractType<T> = T extends `${infer TType}${WS}${string}`
  ? TType extends AbiTypes
    ? TType
    : never
  : never

export type ExtractNames<T extends string> =
  T extends `${AbiTypes}${WS}${infer TName}(${string})${string}` ? TName : never

export type ExtractMutability<T extends string> =
  T extends `${AbiTypes}${WS}${string}(${string})${WS}${infer P}${WS}${string}`
    ? P extends AbiMutability
      ? P
      : 'nonpayable'
    : 'nonpayable'

export type ExtractReturn<T extends string> =
  T extends `${string}returns (${infer TName})` ? CustomSplit<TName> : ['void']

export type ExtractArgs<T extends string> = hasTupleValue<T> extends true
  ? T extends `${AbiTypes}${WS}${string}(${infer TName})${WS}${string}returns${string}`
    ? CustomSplit<TName>
    : T extends `${AbiTypes}${WS}${string}(${infer TNames})`
    ? CustomSplit<TNames>
    : never
  : T extends `${AbiTypes}${WS}${string}(${infer TName})${string}returns${string}`
  ? CustomSplit<TName>
  : T extends `${AbiTypes}${WS}${string}(${infer TNames})`
  ? CustomSplit<TNames>
  : never

export type ExtractTupleName<T extends string> = Remove<
  T,
  ExtractTArgs<T>
> extends `tuple()[${string}]${infer Name}`
  ? Trim<Name>
  : Remove<T, ExtractTArgs<T>> extends `tuple()${infer Name}`
  ? Trim<Name>
  : ''

export type ExtractTupleType<T extends string> = Remove<
  T,
  ExtractTArgs<T>
> extends `tuple()[${infer K}]${string}`
  ? `tuple[${K}]`
  : 'tuple'

export type ExtractTArgs<T extends string> =
  T extends `tuple(${infer A})${infer B})${infer C})${infer D})${infer E})${infer F})${infer G})${infer H})${infer I})${infer J})${string}`
    ? `${A})${B})${C})${D})${E})${F})${G})${H})${I})${J}`
    : T extends `tuple(${infer A})${infer B})${infer C})${infer D})${infer E})${infer F})${infer G})${infer H})${infer I})${string}`
    ? `${A})${B})${C})${D})${E})${F})${G})${H})${I}`
    : T extends `tuple(${infer A})${infer B})${infer C})${infer D})${infer E})${infer F})${infer G})${infer H})${string}`
    ? `${A})${B})${C})${D})${E})${F})${G})${H}`
    : T extends `tuple(${infer A})${infer B})${infer C})${infer D})${infer E})${infer F})${infer G})${string}`
    ? `${A})${B})${C})${D})${E})${F})${G}`
    : T extends `tuple(${infer A})${infer B})${infer C})${infer D})${infer E})${infer F})${string}`
    ? `${A})${B})${C})${D})${E})${F}`
    : T extends `tuple(${infer A})${infer B})${infer C})${infer D})${infer E})${string}`
    ? `${A})${B})${C})${D})${E}`
    : T extends `tuple(${infer A})${infer B})${infer C})${infer D})${string}`
    ? `${A})${B})${C})${D}`
    : T extends `tuple(${infer A})${infer B})${infer C})${string}`
    ? `${A})${B})${C}`
    : T extends `tuple(${infer A})${infer B})${string}`
    ? `${A})${B}`
    : T extends `tuple(${infer Args})[${string}]${string}`
    ? Args
    : T extends `tuple(${infer Args})${string}`
    ? Args
    : never

export type ParseFunctionArgs<T extends string[]> = T extends [never]
  ? never
  : T extends ['']
  ? []
  : T extends [
      `${infer TType}${WS}${infer TName}`,
      ...infer Rest extends string[],
    ]
  ? [
      {
        readonly internalType: SolidityType<TType>
        readonly name: TName
        readonly type: SolidityType<TType>
      },
      ...ParseFunctionArgs<Rest>,
    ]
  : T extends [`${infer TType}`, ...infer Rest extends string[]]
  ? [
      {
        readonly internalType: SolidityType<TType>
        readonly name: ''
        readonly type: SolidityType<TType>
      },
      ...ParseFunctionArgs<Rest>,
    ]
  : []

export type ParseFunctionReturn<T extends string[]> = T extends [never]
  ? never
  : T extends ['void']
  ? []
  : T extends [
      `${infer TType}${WS}${infer TName}`,
      ...infer Rest extends string[],
    ]
  ? [
      {
        readonly internalType: SolidityType<TType>
        readonly name: TName
        type: SolidityType<TType>
      },
      ...ParseFunctionReturn<Rest>,
    ]
  : T extends [`${infer TType}`, ...infer Rest extends string[]]
  ? [
      {
        readonly internalType: SolidityType<TType>
        readonly name: ''
        readonly type: SolidityType<TType>
      },
      ...ParseFunctionReturn<Rest>,
    ]
  : []

export type ParseEventArgs<T extends string[]> = T extends [never]
  ? never
  : T extends ['']
  ? []
  : T extends [
      `${infer TType}${AbiIndexed}${infer TName}`,
      ...infer Rest extends string[],
    ]
  ? [
      {
        readonly indexed: true
        readonly internalType: SolidityType<TType>
        readonly name: TName
        readonly type: SolidityType<TType>
      },
      ...ParseEventArgs<Rest>,
    ]
  : T extends [
      `${infer TType}${WS}${infer TName}`,
      ...infer Rest extends string[],
    ]
  ? [
      {
        readonly indexed: false
        readonly internalType: SolidityType<TType>
        readonly name: TName
        readonly type: SolidityType<TType>
      },
      ...ParseEventArgs<Rest>,
    ]
  : []

export type ParseComponents<T extends unknown[]> = T extends [never]
  ? never
  : T extends ['']
  ? never
  : T extends [infer Head extends string, ...infer Last extends string[]]
  ? isTupleValue<Head> extends true
    ? [
        {
          readonly name: ExtractTupleName<Head>
          readonly type: ExtractTupleType<Head>
          readonly components: [
            ...ParseComponents<[...CustomSplit<ExtractTArgs<Head>>, ...Last]>,
          ]
        },
      ]
    : T extends [
        `${infer TType}${WS}${infer TName}`,
        ...infer Last extends string[],
      ]
    ? [
        {
          readonly name: TName
          readonly type: SolidityType<TType>
        },
        ...ParseComponents<Last>,
      ]
    : T extends [`${infer TType}`, ...infer Last]
    ? [
        {
          readonly name: ''
          readonly type: SolidityType<TType>
        },
        ...ParseComponents<Last>,
      ]
    : []
  : []

export type HandleArguments<
  T extends unknown[],
  TType extends 'function' | 'event',
> = TType extends 'function'
  ? T extends [infer THead extends string, ...infer Rest extends string[]]
    ? isTupleValue<THead> extends true
      ? [...ParseComponents<[THead]>, ...HandleArguments<Rest, 'function'>]
      : [...ParseFunctionArgs<[THead]>, ...HandleArguments<Rest, 'function'>]
    : []
  : T extends [infer THead extends string, ...infer Rest extends string[]]
  ? isTupleValue<THead> extends true
    ? [...ParseComponents<[THead]>, ...HandleArguments<Rest, 'event'>]
    : [...ParseEventArgs<[THead]>, ...HandleArguments<Rest, 'event'>]
  : []

export type HandleReturnArguments<T extends unknown[]> = T extends [
  infer THead extends string,
  ...infer Rest extends string[],
]
  ? isTupleValue<THead> extends true
    ? [...ParseComponents<[THead]>, ...HandleReturnArguments<Rest>]
    : [...ParseFunctionReturn<[THead]>, ...HandleReturnArguments<Rest>]
  : []

export type ParseHAbiFunctions<T extends HAbi> = T extends [never]
  ? never
  : T extends ''
  ? T
  : T extends readonly [infer Head, ...infer Rest extends HAbi]
  ? Head extends `function${string}`
    ? [
        {
          readonly name: ExtractNames<Head>
          readonly type: ExtractType<Head>
          readonly stateMutability: ExtractMutability<Head>
          readonly inputs: readonly [
            ...HandleArguments<ExtractArgs<Head>, 'function'>,
          ]
          readonly outputs: readonly [
            ...HandleReturnArguments<ExtractReturn<Head>>,
          ]
        },
        ...ParseHAbiFunctions<Rest>,
      ]
    : ParseHAbiFunctions<Rest>
  : []

export type ParseHAbiEvents<T extends HAbi> = T extends [never]
  ? never
  : T extends ['']
  ? T
  : T extends readonly [infer Head, ...infer Rest extends HAbi]
  ? Head extends `event${string}`
    ? [
        {
          readonly name: ExtractNames<Head>
          readonly type: ExtractType<Head>
          readonly anonymous: false
          readonly inputs: readonly [
            ...HandleArguments<ExtractArgs<Head>, 'event'>,
          ]
        },
        ...ParseHAbiEvents<Rest>,
      ]
    : ParseHAbiEvents<Rest>
  : []

export type ParseHAbiErrors<T extends HAbi> = T extends [never]
  ? never
  : T extends ['']
  ? T
  : T extends readonly [infer Head, ...infer Rest extends HAbi]
  ? Head extends `error${string}`
    ? [
        {
          readonly name: ExtractNames<Head>
          readonly type: ExtractType<Head>
          readonly inputs: readonly [...ParseFunctionArgs<ExtractArgs<Head>>]
        },
        ...ParseHAbiErrors<Rest>,
      ]
    : ParseHAbiErrors<Rest>
  : []

export type ParseHumanAbi<HumanAbi extends HAbi> = [
  ...ParseHAbiErrors<HumanAbi>,
  ...ParseHAbiEvents<HumanAbi>,
  ...ParseHAbiFunctions<HumanAbi>,
]

export type HAbi = readonly (
  | `function${WS}${string}(${string})${WS}${AbiMutability}${WS}returns${WS}(${string})`
  | `function${WS}${string}(${string})${WS}returns${WS}(${string})`
  | `${AbiTypes}${WS}${string}(${string})`
)[]

export type IsHAbi<THAbi> = THAbi extends HAbi ? true : false
