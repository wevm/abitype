import type {
  AbiArgsType,
  AbiArgsTypeWithTuple,
  AbiArgsWithTuple,
  AbiMutability,
  AbiTypes,
  Modifier,
  Pop,
  PopLastIfEmpty,
  ReOrderArray,
  ReplaceAll,
  SolidityType,
  Split,
  Trim,
  TupleValue,
  WS,
  hasTupleValue,
  isTupleValue,
  isUnknown,
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
    ? ReOrderArray<ParseParams<ReplaceAll<TName, 'tuple', ''>>>
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
    ? ReOrderArray<ParseParams<ReplaceAll<TName, 'tuple', ''>>>
    : T extends `${AbiTypes}${WS}${string}(${infer TNames})`
    ? ReOrderArray<ParseParams<ReplaceAll<TNames, 'tuple', ''>>>
    : never
  : T extends `${AbiTypes}${WS}${string}(${infer TName})${string}returns${string}`
  ? ReOrderArray<ParseParams<ReplaceAll<TName, 'tuple', ''>>>
  : T extends `${AbiTypes}${WS}${string}(${infer TNames})`
  ? ReOrderArray<ParseParams<ReplaceAll<TNames, 'tuple', ''>>>
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
  T extends `${string} indexed ${string}` ? true : unknown

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
  T extends `[${string}] indexed ${infer Name}`
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
  T extends `[${infer K}] indexed ${infer Name}`
    ? `Struct[${K}]${WS}${Name}`
    : T extends `[${infer K}]${infer Name}`
    ? `Struct[${K}]${Name}`
    : T extends `indexed ${infer Name}`
    ? `Struct${WS}${Name}`
    : Trim<`Struct${WS}${T}`>

/**
 * Convert a struct string into a Record<string, AbiArgsType>. This is used as a type helper for struct arguments
 *
 * @param T - String to construct the struct object
 * @returns the constructed object by the string provided {@link T}
 *
 * @example
 * type Result = ConstructStructObject<"(string world)[3] person">
 */
export type CreateStructObject<T extends HAbi> = T extends [
  infer Head extends string,
  ...infer Rest extends HAbi,
]
  ? Head extends `${'s' | 'S'}truct${infer Name}{${infer Args}}`
    ? {
        [K in Trim<Name>]: PopLastIfEmpty<Split<Args, ';'>>
      } & CreateStructObject<Rest>
    : CreateStructObject<Rest>
  : Record<string, unknown>

/**
 * Extracts the struct names for a given argument
 *
 * @param T - String to extract the name of
 * @returns the extracted name {@link T}
 *
 * @example
 * type Result = ExtractStructName<"Voter[10]">
 */
export type ExtractStructName<T extends string> =
  T extends `${infer Name}[${string}]` ? Name : T

/**
 * Extracts the struct type for a given argument
 *
 * @param T - String to extract the type of
 * @returns the extracted type {@link T}
 *
 * @example
 * type Result = ExtractStructType<"Voter[10]">
 */
export type ExtractStructType<T extends string> =
  T extends `${string}[${infer K}]` ? `tuple[${K}]` : 'tuple'

/**
 * Extracts the struct internal type for a given argument
 *
 * @param T - String to extract the internal type of
 * @returns the extracted internal type {@link T}
 *
 * @example
 * type Result = ExtractStructName<"Voter[10]">
 */
export type ExtractStructInternalType<T extends string> =
  T extends `${infer Name}[${infer K}]` ? `Struct[${K}] ${Name}` : `Struct ${T}`

/**
 * Parse HAbi string arguments and return arguments.
 * If you want to use structs make use that you use the {@link CreateStructObject} on the optional generic
 *
 * @param T - String to parse
 * @param TObj - Record with the helper struct object.
 * @returns Array with the parsed abi values. Assumes values were extracted previously from {@link ExtractArgs}
 *
 * @example
 * type Result = ParseArgs<["string world"]>
 * //    ^? "[{name: "hello", type: "string", internalType: "string"}]"
 *
 * type ResultStruct = ParseArgs<["Voter vote"], CreateStructObject<["struct Voter{uint numberOfVotes;}"]>>
 * //    ^? "[{name: "vote", type: "tuple", internalType: "Struct Voter", components:[{name: "numberOfVotes", type: "uint256", internalType: "uint256"}]}]"
 */
export type ParseArgs<
  T extends AbiArgsType,
  TObj extends Record<string, AbiArgsType | unknown> = Record<string, unknown>,
> = T[0] extends '' | 'void'
  ? []
  : {
      [key in keyof T]: T[key] extends `${infer TType extends string}${WS}${infer TModifier extends Modifier}${WS}${infer TName extends string}`
        ? isUnknown<TObj[ExtractStructName<Trim<TType>>]> extends false
          ? {
              readonly internalType: ExtractStructInternalType<TType>
              readonly name: Trim<TName>
              readonly type: ExtractStructType<Trim<TType>>
              readonly components: ParseArgs<
                Extract<TObj[ExtractStructName<Trim<TType>>], AbiArgsType>,
                TObj
              >
            } & (TModifier extends 'indexed' ? { indexed: true } : unknown)
          : {
              readonly internalType: SolidityType<Trim<TType>>
              readonly name: Trim<TName>
              readonly type: SolidityType<Trim<TType>>
            } & (TModifier extends 'indexed' ? { indexed: true } : unknown)
        : T[key] extends `${infer Type}${WS}${infer Name}`
        ? isUnknown<TObj[ExtractStructName<Trim<Type>>]> extends false
          ? {
              readonly internalType: ExtractStructInternalType<Type>
              readonly name: Trim<Name> extends Modifier ? '' : Name
              readonly type: ExtractStructType<Trim<Type>>
              readonly components: ParseArgs<
                Extract<TObj[ExtractStructName<Trim<Type>>], AbiArgsType>,
                TObj
              >
            } & (Name extends 'indexed' ? { indexed: true } : unknown)
          : {
              readonly internalType: SolidityType<Trim<Type>>
              readonly name: Trim<Name>
              readonly type: SolidityType<Trim<Type>>
            } & (Name extends 'indexed' ? { indexed: true } : unknown)
        : isUnknown<TObj[ExtractStructName<Trim<T[key]>>]> extends false
        ? {
            readonly internalType: ExtractStructInternalType<Trim<T[key]>>
            readonly name: ''
            readonly type: ExtractStructType<Trim<T[key]>>
            readonly components: ParseArgs<
              Extract<TObj[ExtractStructName<Trim<T[key]>>], AbiArgsType>,
              TObj
            >
          }
        : {
            readonly internalType: SolidityType<T[key]>
            readonly name: ''
            readonly type: SolidityType<Trim<T[key]>>
          }
    }

/**
 * Splits a string for every `,` value in it in the expection it has nested values e.g `(${string})` {@link ExtractArgs} {@link ExtractReturn} {@link ExtractTArgs}
 *
 * @param T - string to split
 * @returns Array with the splited string {@link T}
 *
 * @example
 * type Result = ParseParms<'address owner, (bool loading, (string[][] names) cats)[] dog, uint tokenId'>
 * //    ^? ["address owner","(bool loading, (string[][] names) cats)[] dog","uint tokenId"]
 */
// Adapted from "https://github.com/ethers-io/ethers.js/blob/bf0b468490cb293cd916e4fff06e0909273719e6/packages/abi/src.ts/fragments.ts#L1043"
export type ParseParams<
  T extends string,
  TResult extends any[] = [],
  TStr extends string = '',
  Depth extends any[] = [],
> = T extends ''
  ? [...TResult, Trim<TStr>]
  : Depth['length'] extends 0
  ? T extends `${infer Char}${infer Rest}`
    ? Char extends ','
      ? ParseParams<Rest, [...TResult, Trim<TStr>], ''>
      : Char extends '('
      ? ParseParams<Rest, TResult, `${TStr}${Char}`, [...Depth, 1]>
      : ParseParams<Rest, TResult, `${TStr}${Char}`>
    : []
  : T extends `${infer Char}${infer Rest}`
  ? Char extends '('
    ? ParseParams<Rest, TResult, `${TStr}${Char}`, [...Depth, 1]>
    : Char extends ')'
    ? ParseParams<Rest, TResult, `${TStr}${Char}`, Pop<Depth>>
    : ParseParams<Rest, TResult, `${TStr}${Char}`, Depth>
  : []

/**
 * Parse HAbi string arguments and return arguments.
 *
 * @param T - String to parse
 * @returns Array with the parsed abi values. Assumes values were extracted previously from {@link ExtractArgs}
 *
 * @example
 * type Result = ParseFunctionArgs<["string world"]>
 * //    ^? "[{name: "hello", type: "string", internalType: "string"}]"
 */
// export type ParseArgss<T extends AbiArgsType> = T extends [never]
//   ? never
//   : T extends ['']
//   ? []
//   : T extends ['void']
//   ? []
//   : T extends [
//       `${infer TType}${AbiIndexed}${infer TName}`,
//       ...infer Rest extends AbiArgsType,
//     ]
//   ? [
//       {
//         readonly indexed: true
//         readonly internalType: SolidityType<TType>
//         readonly name: TName
//         readonly type: SolidityType<TType>
//       },
//       ...ParseArgss<Rest>,
//     ]
//   : T extends [
//       `${infer TType}${WS}${infer TName}`,
//       ...infer Rest extends AbiArgsType,
//     ]
//   ? [
//       {
//         readonly type: SolidityType<TType>
//         readonly name: TName
//         readonly internalType: SolidityType<TType>
//       },
//       ...ParseArgss<Rest>,
//     ]
//   : T extends [`${infer TType}`, ...infer Rest extends AbiArgsType]
//   ? [
//       {
//         readonly internalType: SolidityType<TType>
//         readonly name: ''
//         readonly type: SolidityType<TType>
//       },
//       ...ParseArgss<Rest>,
//     ]
//   : []

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
export type ParseComponents<T extends AbiArgsTypeWithTuple> = T extends [never]
  ? never
  : T extends ['']
  ? never
  : T extends [
      infer Head extends AbiArgsWithTuple,
      ...infer Last extends AbiArgsTypeWithTuple,
    ]
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
              [...ReOrderArray<ParseParams<ExtractTArgs<Head>>>, ...Last]
            >,
          ]
        } & (isIndexed<Head> extends true ? { indexed: true } : unknown),
      ]
    : [...ParseArgs<[Exclude<Head, TupleValue>]>, ...ParseComponents<Last>]
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
  T extends AbiArgsTypeWithTuple,
  TStructObject extends Record<string, AbiArgsType | unknown> = Record<
    string,
    unknown
  >,
> = T extends [
  infer THead extends AbiArgsWithTuple,
  ...infer Rest extends AbiArgsTypeWithTuple,
]
  ? isTupleValue<THead> extends true
    ? [...ParseComponents<[THead]>, ...HandleArguments<Rest>]
    : [
        ...ParseArgs<[Exclude<THead, TupleValue>], TStructObject>,
        ...HandleArguments<Rest, TStructObject>,
      ]
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
export type ParseHAbiFunctions<
  T extends HAbi,
  TStructObject extends Record<string, AbiArgsType | unknown> = Record<
    string,
    unknown
  >,
> = T extends [never]
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
            ...HandleArguments<ExtractArgs<Head>, TStructObject>,
          ]
          readonly name: ExtractNames<Head>
          readonly outputs: readonly [
            ...HandleArguments<ExtractReturn<Head>, TStructObject>,
          ]
          readonly payable: ExtractMutability<Head> extends 'payable'
            ? true
            : false
          readonly stateMutability: ExtractMutability<Head>
          readonly type: ExtractType<Head>
        },
        ...ParseHAbiFunctions<Rest, TStructObject>,
      ]
    : ParseHAbiFunctions<Rest, TStructObject>
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
export type ParseHAbiEvents<
  T extends HAbi,
  TStructObject extends Record<string, AbiArgsType | unknown> = Record<
    string,
    unknown
  >,
> = T extends [never]
  ? never
  : T extends ['']
  ? T
  : T extends readonly [infer Head, ...infer Rest extends HAbi]
  ? Head extends `event${string}`
    ? [
        {
          readonly anonymous: false
          readonly inputs: readonly [
            ...HandleArguments<ExtractArgs<Head>, TStructObject>,
          ]
          readonly name: ExtractNames<Head>
          readonly type: ExtractType<Head>
        },
        ...ParseHAbiEvents<Rest, TStructObject>,
      ]
    : ParseHAbiEvents<Rest, TStructObject>
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
export type ParseHAbiErrors<
  T extends HAbi,
  TStructObject extends Record<string, AbiArgsType | unknown> = Record<
    string,
    unknown
  >,
> = T extends [never]
  ? never
  : T extends ['']
  ? T
  : T extends readonly [infer Head, ...infer Rest extends HAbi]
  ? Head extends `error${string}`
    ? [
        {
          readonly type: ExtractType<Head>
          readonly name: ExtractNames<Head>
          readonly inputs: ParseArgs<ExtractArgs<Head>, TStructObject>
        },
        ...ParseHAbiErrors<Rest, TStructObject>,
      ]
    : ParseHAbiErrors<Rest, TStructObject>
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
export type ParseHumanAbi<
  HumanAbi extends HAbi,
  TStructObject extends Record<
    string,
    AbiArgsType | unknown
  > = CreateStructObject<HumanAbi>,
> = readonly [
  ...ParseHAbiErrors<HumanAbi, TStructObject>,
  ...ParseHAbiEvents<HumanAbi, TStructObject>,
  ...ParseHAbiFunctions<HumanAbi, TStructObject>,
]

/**
 * HAbi spec in order to properly parse the given array of strings
 */
export type HAbi = readonly (
  | `function${WS}${string}(${string})${WS}${AbiMutability}${WS}returns${WS}(${string})`
  | `function${WS}${string}(${string})${WS}returns${WS}(${string})`
  | `${AbiTypes}${WS}${string}(${string})`
  | `${'s' | 'S'}truct${WS}${string}{${string}}`
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
