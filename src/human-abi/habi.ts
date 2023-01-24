import type {
  AbiIndexed,
  AbiMutability,
  AbiTypes,
  CustomSplit,
  SolidityType,
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
  T extends `${WS}${infer TName}(${string})${string}` ? TName : never

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

export type ExtractTupleName<T extends string> = T extends `${string})${
  | WS
  | `[${string}]${WS}`}${infer Name})`
  ? Name
  : ''

export type ExtractTupleType<T extends string> =
  T extends `${string}(${string})[${infer K}]${string}`
    ? `tuple[${K}]`
    : 'tuple'

export type ExtractTupleArgs<T extends string> =
  T extends `tuple(${infer Args})`
    ? Args
    : T extends `tuple(${infer Args})${WS}${string}`
    ? Args
    : never

export type ExtractArrayTupleArgs<T extends string> =
  T extends `tuple(${infer Args})[${string}]${string}` ? `${Args}` : never

export type ExtractTArgs<T extends string> = ExtractTupleType<T> extends 'tuple'
  ? ExtractTupleArgs<T>
  : ExtractArrayTupleArgs<T>

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

export type ParseHAbiFunctions<T extends readonly unknown[]> = T extends [never]
  ? never
  : T extends ''
  ? T
  : T extends readonly [infer Head, ...infer Rest]
  ? Head extends `function${infer Tail}`
    ? [
        {
          readonly name: ExtractNames<Tail>
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

export type ParseHAbiEvents<T extends readonly unknown[]> = T extends [never]
  ? never
  : T extends ['']
  ? T
  : T extends readonly [infer Head, ...infer Rest]
  ? Head extends `event${infer Tail}`
    ? [
        {
          readonly name: ExtractNames<Tail>
          readonly type: ExtractType<Head>
          readonly anonymous: false
          readonly inputs: readonly [
            ...HandleArguments<ExtractArgs<Head>, 'event'>,
          ] //ParseEventArgs<ExtractArgs<Head>>;
        },
        ...ParseHAbiEvents<Rest>,
      ]
    : ParseHAbiEvents<Rest>
  : []

export type ParseHAbiErrors<T extends readonly unknown[]> = T extends [never]
  ? never
  : T extends ['']
  ? T
  : T extends readonly [infer Head, ...infer Rest]
  ? Head extends `error${infer Tail}`
    ? [
        {
          readonly name: ExtractNames<Tail>
          readonly type: ExtractType<Head>
          readonly inputs: readonly [...ParseFunctionArgs<ExtractArgs<Head>>]
        },
        ...ParseHAbiErrors<Rest>,
      ]
    : ParseHAbiErrors<Rest>
  : []

export type ParseHumanAbi<HAbi extends readonly unknown[]> = [
  ...ParseHAbiErrors<HAbi>,
  ...ParseHAbiEvents<HAbi>,
  ...ParseHAbiFunctions<HAbi>,
]

export type HAbi = readonly (
  | `function${WS}${string}(${string})${WS}${AbiMutability}${WS}returns${WS}(${string})`
  | `function${WS}${string}(${string})${WS}returns${WS}(${string})`
  | `${AbiTypes}${WS}${string}(${string})`
)[]

export type IsHAbi<THAbi> = THAbi extends HAbi ? true : false
