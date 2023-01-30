import type {
  AbiIndexed,
  AbiMutability,
  AbiTypes,
  ReOrderArray,
  ReplaceAll,
  SolidityType,
  SplitNesting,
  Trim,
  WS,
  hasTupleValue,
  isTupleValue,
} from './utils'

/**
 * Extract type from HAbi string.
 *
 * @param T - Any string
 * @returns "function" | "event" | "error"  in case it matches or never if it doesn't
 *
 * @example
 * type Result = ExtractType<"function hello(string world)">
 * //    ^? "function"
 */
export type ExtractType<T> = T extends `${infer TType}${WS}${string}`
  ? TType extends AbiTypes
    ? TType
    : never
  : never

/**
 * Extract name from HAbi string.
 *
 * @param T - Assumes the string starts with `"function" | "event" | "error"` followed by `WS` in order to extract the name
 * @returns The name in case of a match or never in case it fails
 *
 * @example
 * type Result = ExtractName<"function hello(string world)">
 * //    ^? "hello"
 */
export type ExtractNames<T extends string> =
  T extends `${AbiTypes}${WS}${infer TName}(${string})${string}` ? TName : never

/**
 * Extract mutabiliy from HAbi string.
 *
 * @param T - String to extract values from
 * @returns Value extracted from the string in case of a match or 'nonpayable' in case it didn't
 *
 * @example
 * type Result = ExtractMutability<"function hello(string world) view returns(uint token)">
 * //    ^? "view"
 */
export type ExtractMutability<T extends string> =
  T extends `${AbiTypes}${WS}${string}(${string})${WS}${infer P}${WS}${string}`
    ? P extends AbiMutability
      ? P
      : 'nonpayable'
    : 'nonpayable'

/**
 * Extract return values from HAbi string.
 *
 * @param T - String in the HAbi format
 * @returns The value inside of the `()`
 *
 * @example
 * type Result = ExtractReturn<"function hello(string world) view returns (uint token)">
 * //    ^? "uint token"
 */
export type ExtractReturn<T extends string> =
  T extends `${string}returns (${infer TName})`
    ? ReOrderArray<SplitNesting<ReplaceAll<TName, 'tuple', ''>>>
    : ['void']

/**
 * Extract the arguments from HAbi string.
 *
 * @param T - String in the HAbi format. All tuple values in the string are replaced
 * @returns A re-orded array with the values extracted from the string
 *
 * @example
 * type Result = ExtractArgs<"function hello(string world)">
 * //    ^? ["string world"]
 */
export type ExtractArgs<T extends string> = hasTupleValue<T> extends true
  ? T extends `${AbiTypes}${WS}${string}(${infer TName})${WS}${string}returns${string}`
    ? ReOrderArray<SplitNesting<ReplaceAll<TName, 'tuple', ''>>>
    : T extends `${AbiTypes}${WS}${string}(${infer TNames})`
    ? ReOrderArray<SplitNesting<ReplaceAll<TNames, 'tuple', ''>>>
    : never
  : T extends `${AbiTypes}${WS}${string}(${infer TName})${string}returns${string}`
  ? ReOrderArray<SplitNesting<ReplaceAll<TName, 'tuple', ''>>>
  : T extends `${AbiTypes}${WS}${string}(${infer TNames})`
  ? ReOrderArray<SplitNesting<ReplaceAll<TNames, 'tuple', ''>>>
  : never

/**
 * Check if the string has `indexed` value in it.
 *
 * @param T - Target string to check
 * @returns True in case of a match. False if it doesn't
 *
 * @example
 * type Result = isIndexed<"function hello(string world)">
 * //    ^? "false"
 */
export type isIndexed<T extends string> =
  T extends `${string}${AbiIndexed}${string}` ? true : unknown

/**
 * Extract all the info related to strings that end in ")". Does this recursively in case of nested values until it no longer matches.
 *
 * @param T - Target string to check
 * @returns The extracted trimmed values or a empty string in case it didn't match
 *
 * @example
 * type Result = ExtractTupleInfo<"((string world)[] worlds, address hello) person">
 * //    ^? "person"
 */
export type ExtractTupleInfo<T extends string> =
  T extends `${string})${infer Info}`
    ? Info extends `${string})`
      ? ''
      : Info extends `${string})${infer TInfo}`
      ? TInfo extends ''
        ? Trim<Info>
        : ExtractTupleInfo<Trim<TInfo>>
      : Trim<Info>
    : T

/**
 * Extract the tuple arguments.
 *
 * @param T - String to extract values from
 * @returns The values in case it matches or a empty string in case it didn't
 *
 * @example
 * type Result = ExtractTArgs<"(string world)[] person">
 * //    ^? "string world"
 */
export type ExtractTArgs<T extends string> =
  T extends `(${infer Args})${ExtractTupleInfo<T>}`
    ? Args
    : T extends `(${infer Args})${WS}${ExtractTupleInfo<T>}`
    ? Args
    : ''

/**
 * Extract name from tuple string.
 *
 * @param T - String to extract values from
 * @returns The name of the tuple in case it has any
 *
 * @example
 * type Result = ExtractTupleName<"(string world)[] person">
 * //    ^? "person"
 */
export type ExtractTupleName<T extends string> =
  T extends `[${string}]${AbiIndexed}${infer Name}`
    ? Name
    : T extends `[${string}]${infer Name}`
    ? Trim<Name>
    : T extends `indexed ${infer Name}`
    ? Name
    : T

/**
 * Extract type from tuple string.
 *
 * @param T - String to extract values from
 * @returns the tuple type depending on {@link T}
 *
 * @example
 * type Result = ExtractTupleType<"(string world)[3] person">
 * //    ^? "tuple[3]"
 */
export type ExtractTupleType<T extends string> =
  T extends `[${infer K}]${string}` ? `tuple[${K}]` : 'tuple'

/**
 * Extract internal type from tuple string.
 *
 * @param T - String to extract values from
 * @returns the tuple internal type depending on {@link T}
 *
 * @example
 * type Result = ExtractTupleType<"(string world)[3] person">
 * //    ^? "Struct[3] person"
 */
export type ExtractTupleInternalType<T extends string> =
  T extends `[${infer K}]${AbiIndexed}${infer Name}`
    ? `Struct[${K}]${WS}${Name}`
    : T extends `[${infer K}]${infer Name}`
    ? `Struct[${K}]${Name}`
    : T extends `indexed ${infer Name}`
    ? `Struct${WS}${Name}`
    : Trim<`Struct${WS}${T}`>

/**
 * Parse HAbi string arguments.
 *
 * @param T - String to parse
 * @returns Array with the parsed abi values. Assumes values were extracted previously from {@link ExtractArgs}
 *
 * @example
 * type Result = ParseFunctionArgs<["string world"]>
 * //    ^? "[{name: "hello", type: "string", internalType: "string"}]"
 */
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
        readonly type: SolidityType<TType>
        readonly name: TName
        readonly internalType: SolidityType<TType>
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

/**
 * Parse HAbi string return.
 *
 * @param T - String to parse
 * @returns Array with the parsed abi values. Assumes values were extracted previously from {@link ExtractReturn}
 *
 * @example
 * type Result = ParseFunctionReturn<["string world"]>
 * //    ^? "[{name: "hello", type: "string", internalType: "string"}]"
 */
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
        readonly type: SolidityType<TType>
        readonly name: TName
        readonly internalType: SolidityType<TType>
      },
      ...ParseFunctionReturn<Rest>,
    ]
  : T extends [`${infer TType}`, ...infer Rest extends string[]]
  ? [
      {
        readonly type: SolidityType<TType>
        readonly name: ''
        readonly internalType: SolidityType<TType>
      },
      ...ParseFunctionReturn<Rest>,
    ]
  : []

/**
 * Parse HAbi event string arguments.
 *
 * @param T - String to parse
 * @returns Array with the parsed abi values. Assumes values were extracted previously from {@link ExtractArgs}
 *
 * @example
 * type Result = ParseFunctionArgs<["address indexed owner"]>
 * //    ^? "[{name: "owner", type: "address", internalType: "address", indexed: true}]"
 */
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
        readonly internalType: SolidityType<TType>
        readonly name: TName
        readonly type: SolidityType<TType>
      },
      ...ParseEventArgs<Rest>,
    ]
  : []

/**
 * Parse HAbi tuple string arguments.
 *
 * @param T - String to parse
 * @returns Array with the parsed abi values. Assumes values were extracted previously from {@link ExtractTArgs}
 *
 * @example
 * type Result = ParseComponents<["(string world)[] person"]>
 * //    ^? [{name: "person", type: "tuple[]", internalType: "Struct[] person", components:[{name: "world", type: "string", internalType: "world"}]}]
 */
export type ParseComponents<T extends unknown[]> = T extends [never]
  ? never
  : T extends ['']
  ? never
  : T extends [infer Head extends string, ...infer Last extends string[]]
  ? Head extends `(${string}`
    ? [
        {
          readonly type: ExtractTupleType<ExtractTupleInfo<Head>>
          readonly name: ExtractTupleName<ExtractTupleInfo<Head>>
          readonly internalType: ExtractTupleInternalType<
            ExtractTupleInfo<Head>
          >
          readonly components: [
            ...ParseComponents<
              [...ReOrderArray<SplitNesting<ExtractTArgs<Head>>>, ...Last]
            >,
          ]
        },
      ]
    : T extends [
        `${infer TType}${WS}${infer TName}`,
        ...infer Last extends string[],
      ]
    ? [
        {
          readonly type: SolidityType<TType>
          readonly name: TName
          readonly internalType: SolidityType<TType>
        },
        ...ParseComponents<Last>,
      ]
    : T extends [`${infer TType}`, ...infer Last]
    ? [
        {
          readonly type: SolidityType<TType>
          readonly name: ''
          readonly internalType: SolidityType<TType>
        },
        ...ParseComponents<Last>,
      ]
    : []
  : []

/**
 * Parse HAbi tuple string arguments. This handles the indexed values on the string
 *
 * @param T - String to parse
 * @returns Array with the parsed abi values. Assumes values were extracted previously from {@link ExtractTArgs}
 *
 * @example
 * type Result = ParseComponents<["(string world)[] person"]>
 * //    ^? [{name: "person", type: "tuple[]", internalType: "Struct[] person", indexed: true, components:[{name: "world", type: "string", internalType: "world"}]}]
 */
export type ParseEventComponents<T extends unknown[]> = T extends [never]
  ? never
  : T extends ['']
  ? never
  : T extends [infer Head extends string, ...infer Last extends string[]]
  ? Head extends `(${string}`
    ? [
        {
          readonly name: ExtractTupleName<ExtractTupleInfo<Head>>
          readonly type: ExtractTupleType<ExtractTupleInfo<Head>>
          readonly indexed: isIndexed<Head>
          readonly internalType: ExtractTupleInternalType<
            ExtractTupleInfo<Head>
          >
          readonly components: [
            ...ParseEventComponents<
              [...ReOrderArray<SplitNesting<ExtractTArgs<Head>>>, ...Last]
            >,
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
          readonly internalType: SolidityType<TType>
        },
        ...ParseEventComponents<Last>,
      ]
    : T extends [`${infer TType}`, ...infer Last]
    ? [
        {
          readonly name: ''
          readonly type: SolidityType<TType>
          readonly internalType: SolidityType<TType>
        },
        ...ParseEventComponents<Last>,
      ]
    : []
  : []

/**
 * Handle arguments based on if they are tuple values or not. Calls correct function accordingly
 *
 * @param T - String to parse
 * @returns Array with the parsed abi values. Assumes values were extracted previously from {@link ExtractArgs}
 *
 * @example
 * type Result = HandleArguments<["(string world)[] person"], "function">
 * //    ^? [{name: "person", type: "tuple[]", internalType: "Struct[] person", indexed: true, components:[{name: "world", type: "string", internalType: "world"}]}]
 */
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
    ? [...ParseEventComponents<[THead]>, ...HandleArguments<Rest, 'event'>]
    : [...ParseEventArgs<[THead]>, ...HandleArguments<Rest, 'event'>]
  : []

/**
 * Extract name from HAbi string.
 *
 * @param T - Assumes the string starts with `"function" | "event" | "error"` followed by `WS` in order to extract the name
 * @returns The name in case of a match or never in case it fails
 *
 * @example
 * type Result = ExtractName<"function hello(string world)">
 * //    ^? "hello"
 */
export type HandleReturnArguments<T extends unknown[]> = T extends [
  infer THead extends string,
  ...infer Rest extends string[],
]
  ? isTupleValue<THead> extends true
    ? [...ParseComponents<[THead]>, ...HandleReturnArguments<Rest>]
    : [...ParseFunctionReturn<[THead]>, ...HandleReturnArguments<Rest>]
  : []

/**
 * Parses the HAbi type string into to proper abi representation. This one only works for function type strings
 *
 * @param T - String to parse. Must meet HAbi specs
 * @returns Array with the parsed abi values.
 *
 * @example
 * type Result = ParseHAbiFunctions<["function hello(string world)"]>
 * //    ^? [{name: "hello", type: "function", constant: false, payable: false, inputs:[{name: "world", type: "string", internalType: "string"}], outputs:[]}]
 */
export type ParseHAbiFunctions<T extends HAbi> = T extends [never]
  ? never
  : T extends ''
  ? T
  : T extends readonly [infer Head, ...infer Rest extends HAbi]
  ? Head extends `function${string}`
    ? [
        {
          readonly constant: ExtractMutability<Head> extends 'view' | 'pure'
            ? true
            : false
          readonly inputs: readonly [
            ...HandleArguments<ExtractArgs<Head>, 'function'>,
          ]
          readonly name: ExtractNames<Head>
          readonly outputs: readonly [
            ...HandleReturnArguments<ExtractReturn<Head>>,
          ]
          readonly payable: ExtractMutability<Head> extends 'payable'
            ? true
            : false
          readonly stateMutability: ExtractMutability<Head>
          readonly type: ExtractType<Head>
        },
        ...ParseHAbiFunctions<Rest>,
      ]
    : ParseHAbiFunctions<Rest>
  : []

/**
 * Parses the HAbi type string into to proper abi representation. This one only works for event type strings
 *
 * @param T - String to parse. Must meet HAbi specs
 * @returns Array with the parsed abi values.
 *
 * @example
 * type Result = ParseHAbiEvents<["event hello(string world)"]>
 * //    ^? [{name: "hello", type: "event", anonymous: false, inputs:[{name: "world", type: "string", internalType: "string"}]}]
 */
export type ParseHAbiEvents<T extends HAbi> = T extends [never]
  ? never
  : T extends ['']
  ? T
  : T extends readonly [infer Head, ...infer Rest extends HAbi]
  ? Head extends `event${string}`
    ? [
        {
          readonly anonymous: false
          readonly inputs: readonly [
            ...HandleArguments<ExtractArgs<Head>, 'event'>,
          ]
          readonly name: ExtractNames<Head>
          readonly type: ExtractType<Head>
        },
        ...ParseHAbiEvents<Rest>,
      ]
    : ParseHAbiEvents<Rest>
  : []

/**
 * Parses the HAbi type string into to proper abi representation. This one only works for error type strings
 *
 * @param T - String to parse. Must meet HAbi specs
 * @returns Array with the parsed abi values.
 *
 * @example
 * type Result = ParseHAbiErrors<["error hello(string world)"]>
 * //    ^? [{name: "hello", type: "error", inputs:[{name: "world", type: "string", internalType: "string"}]}]
 */
export type ParseHAbiErrors<T extends HAbi> = T extends [never]
  ? never
  : T extends ['']
  ? T
  : T extends readonly [infer Head, ...infer Rest extends HAbi]
  ? Head extends `error${string}`
    ? [
        {
          readonly type: ExtractType<Head>
          readonly name: ExtractNames<Head>
          readonly inputs: readonly [...ParseFunctionArgs<ExtractArgs<Head>>]
        },
        ...ParseHAbiErrors<Rest>,
      ]
    : ParseHAbiErrors<Rest>
  : []

/**
 * Parses all of the HAbi type string in to array of objects much like their abi representation
 *
 * @param HumanAbi - Array of strings that must meet HAbi specs
 * @returns Array of the parsed strings
 *
 * @example
 * type Result = ParseHumanAbi<["error hello(string world)","event hello(string world)","function hello(string world)"]>
 * //    ^? [{name: "hello", type: "error", inputs:[{name: "world", type: "string", internalType: "string"}]},{name: "hello", type: "event", anonymous: false, inputs:[{name: "world", type: "string", internalType: "string"}]},{name: "hello", type: "function", constant: false, payable: false, inputs:[{name: "world", type: "string", internalType: "string"}], outputs:[]}]
 */
export type ParseHumanAbi<HumanAbi extends HAbi> = readonly [
  ...ParseHAbiErrors<HumanAbi>,
  ...ParseHAbiEvents<HumanAbi>,
  ...ParseHAbiFunctions<HumanAbi>,
]

/**
 * HAbi spec in order to properly parse the given array of strings
 */
export type HAbi = readonly (
  | `function${WS}${string}(${string})${WS}${AbiMutability}${WS}returns${WS}(${string})`
  | `function${WS}${string}(${string})${WS}returns${WS}(${string})`
  | `${AbiTypes}${WS}${string}(${string})`
)[]

/**
 * Checks if an array of strings meets the HAbi specs
 *
 * @param THAbi - Array of strings to check
 * @returns True if it matches or false it if doesn't
 *
 * @example
 * type Result = IsHAbi<["functions hello(string world)"]>
 * //    ^? "false"
 */
export type IsHAbi<THAbi> = THAbi extends HAbi ? true : false

/**
 * Extracts all the func names in the HAbi spec array
 *
 * @param THAbi - Array of strings to check
 * @returns A union type of all the names extracted
 *
 * @example
 * type Result = ExtractHAbiFunctionNames<typeof erc721abi>
 * //    ^? "balanceOf | ownerOf | ..."
 */
export type ExtractHAbiFunctionNames<THAbi extends HAbi> = Extract<
  {
    [TKey in keyof THAbi]: THAbi[TKey] extends infer TFunc extends `function${string}`
      ? {
          name: ExtractNames<TFunc>
        }
      : never
  }[number],
  { name: string }
>['name']

/**
 * Extracts all the event names in the HAbi spec array
 *
 * @param THAbi - Array of strings to check
 * @returns A union type of all the names extracted
 *
 * @example
 * type Result = ExtractHAbiEventNames<typeof erc721abi>
 * //    ^? "Transfer |  ..."
 */
export type ExtractHAbiEventNames<THAbi extends HAbi> = {
  [TKey in keyof THAbi]: THAbi[TKey] extends infer TFunc extends `event${string}`
    ? ExtractNames<TFunc>
    : never
}[number]

/**
 * Extracts all the error names in the HAbi spec array
 *
 * @param THAbi - Array of strings to check
 * @returns A union type of all the names extracted
 *
 * @example
 * type Result = ExtractHAbiErrorNames<>
 * //    ^? "NotOwner |  ..."
 */
export type ExtractHAbiErrorNames<THAbi extends HAbi> = {
  [TKey in keyof THAbi]: THAbi[TKey] extends infer TFunc extends `error${string}`
    ? ExtractNames<TFunc>
    : never
}[number]

/**
 * Extracts a func type from the parsed abi. Usefull if you want to grab a specific function
 *
 * @param THAbi - Array of strings to check
 * @param TFuncName - Union of all possible function names to grab from
 * @returns Object of the the selected function
 *
 * @example
 * type Result = ExtractHAbiFunction<["error hello(string world)","event hello(string world)","function hello(string world)"]>
 * //    ^? [{name: "hello", type: "function", constant: false, payable: false, inputs:[{name: "world", type: "string", internalType: "string"}], outputs:[]}]
 */
export type ExtractHAbiFunction<
  THAbi extends HAbi,
  TFuncName extends ExtractHAbiFunctionNames<THAbi>,
> = Extract<ParseHAbiFunctions<THAbi>[number], { name: TFuncName }>

/**
 * Extracts a func type from the parsed abi. Usefull if you want to grab a specific event
 *
 * @param THAbi - Array of strings to check
 * @param TFuncName - Union of all possible event names to grab from
 * @returns Object of the the selected function
 *
 * @example
 * type Result = ExtractHAbiEvent<["error hello(string world)","event hello(string world)","function hello(string world)"]>
 * //    ^? [{name: "hello", type: "event", anonymous: false, inputs:[{name: "world", type: "string", internalType: "string"}]}]
 */
export type ExtractHAbiEvent<
  THAbi extends HAbi,
  TEventName extends ExtractHAbiEventNames<THAbi>,
> = Extract<ParseHAbiEvents<THAbi>[number], { name: TEventName }>

/**
 * Extracts a func type from the parsed abi. Usefull if you want to grab a specific error
 *
 * @param THAbi - Array of strings to check
 * @param TFuncName - Union of all possible error names to grab from
 * @returns Object of the the selected function
 *
 * @example
 * type Result = ExtractHAbiError<["error hello(string world)","event hello(string world)","function hello(string world)"]>
 * //    ^? [{name: "hello", type: "error", inputs:[{name: "world", type: "string", internalType: "string"}]}]
 */
export type ExtractHAbiError<
  THAbi extends HAbi,
  TErrorName extends ExtractHAbiErrorNames<THAbi>,
> = Extract<ParseHAbiErrors<THAbi>[number], { name: TErrorName }>
