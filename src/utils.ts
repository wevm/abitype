import {
  Abi,
  AbiParameter,
  AbiParameterType,
  AbiStateMutability,
  AbiType,
  Address,
  SolAddress,
  SolBool,
  SolBytes,
  SolFixedArrayLookup,
  SolFunction,
  SolInt,
  SolString,
  SolTuple,
} from './abi'
import { MaybeArray, Tuple } from './types'

/**
 * Converts {@link AbiType} to corresponding TypeScript primitive type.
 *
 * Note: Does not include tuple conversion. Use {@link AbiParameterToPrimitiveType} to also convert tuples.
 *
 * @param TAbiType - {@link AbiType} to convert to TypeScript representation.
 * @returns TypeScript primitive type
 */
export type AbiTypeToPrimitiveType<TAbiType extends AbiType> =
  TAbiType extends `${infer T}[]`
    ? AbiTypeToPrimitiveType<T extends AbiType ? T : any>[]
    : TAbiType extends SolAddress
    ? Address
    : TAbiType extends SolString
    ? string
    : TAbiType extends SolBool
    ? boolean
    : TAbiType extends SolFunction
    ? `${Address}${string}`
    : TAbiType extends SolBytes
    ? string | ArrayLike<number>
    : TAbiType extends SolInt
    ? bigint | number
    : TAbiType extends `${infer T}[${infer M}]`
    ? M extends keyof SolFixedArrayLookup
      ? Tuple<
          AbiTypeToPrimitiveType<T extends AbiType ? T : any>,
          SolFixedArrayLookup[M]
        >
      : AbiTypeToPrimitiveType<T extends AbiType ? T : any>[]
    : unknown

/**
 * Converts {@link AbiParameter} to corresponding TypeScript primitive type.
 *
 * @param TAbiParameter - {@link AbiParameter} to convert to TypeScript representation.
 * @returns TypeScript primitive type
 *
 * @example
 * type Result = AbiParameterToPrimitiveType<{
 *   internalType: 'string'
 *   name: 'name'
 *   type: 'string'
 * }>
 *
 * string
 */
export type AbiParameterToPrimitiveType<TAbiParameter extends AbiParameter> =
  TAbiParameter['type'] extends `${SolTuple}${'' | '[]'}`
    ? MaybeArray<
        TAbiParameter['type'],
        {
          [Component in (TAbiParameter & {
            components: readonly AbiParameter[]
          })['components'][number] as Component['name']]: AbiParameterToPrimitiveType<Component>
        }
      >
    : AbiTypeToPrimitiveType<TAbiParameter['type']>

/**
 * Converts array of {@link AbiParameter} to corresponding TypeScript primitive types.
 *
 * @param TAbiParameters - Array of {@link AbiParameter} to convert to TypeScript representations.
 * @returns Array of TypeScript primitive types
 */
export type AbiParametersToPrimitiveTypes<
  TAbiParameters extends readonly AbiParameter[],
> = {
  // SHOUTOUT(@tvler): For finding a better way to map tuples
  // https://github.com/microsoft/TypeScript/issues/27351
  [K in keyof TAbiParameters]: AbiParameterToPrimitiveType<TAbiParameters[K]>
}

/**
 * Checks if type is {@link Abi}
 *
 * @param TAbi - {@link Abi} to check.
 * @returns Boolean for whether {@link TAbi} is {@link Abi}.
 *
 * @example
 * type Result = IsAbi<typeof erc20Abi>
 *
 * true
 */
export type IsAbi<TAbi> = TAbi extends Abi ? true : false

/**
 * Extracts all {@link AbiFunction} types from {@link Abi}
 *
 * @param TAbi - {@link Abi} to extract functions from.
 * @param TAbiStateMutibility - {@link AbiStateMutability} to filter by.
 * @returns All {@link AbiFunction} types from {@link Abi}.
 */
export type ExtractAbiFunctions<
  TAbi extends Abi,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: 'function'; stateMutability: TAbiStateMutibility }
>

/**
 * Extracts all {@link AbiFunction} names from {@link Abi}
 *
 * @param TAbi - {@link Abi} to extract function names from.
 * @param TAbiStateMutibility - {@link AbiStateMutability} to filter by.
 * @returns Union of function names
 *
 * @example
 * type Result = ExtractAbiFunctionNames<typeof erc20Abi>
 *
 * 'balanceOf' | 'decimals' | 'name' | 'symbol' | 'totalSupply'
 */
export type ExtractAbiFunctionNames<
  TAbi extends Abi,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = ExtractAbiFunctions<TAbi, TAbiStateMutibility>['name']

/**
 * Extracts {@link AbiFunction} with name from {@link Abi}
 *
 * @param TAbi - {@link Abi} to extract {@link AbiFunction} from.
 * @param TFunctionName - String name of function to extract from {@link Abi}
 * @returns Matching {@link AbiFunction}
 *
 * @example
 * type Result = ExtractAbiFunction<typeof erc20Abi, 'tokenURI'>
 *
 * {
 *   type: 'function',
 *   name: 'tokenURI',
 *   stateMutability: 'pure',
 *   inputs: [{
 *     internalType: 'uint256',
 *     name: 'tokenId',
 *     type: 'uint256',
 *   }],
 *   outputs: [{
 *     internalType: 'string',
 *     name: '',
 *     type: 'string'
 *   }],
 * }
 */
export type ExtractAbiFunction<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = Extract<ExtractAbiFunctions<TAbi>, { name: TFunctionName }>

/**
 * Extracts {@link AbiParameter} types for function name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiParameter}s from.
 * @param TFunctionName - String name of function
 * @param TAbiParameterType - {@link AbiParameterType} to extract parameters
 * @returns Array of {@link AbiParameter}
 *
 * @example
 * type Result = ExtractAbiFunctionParameters<typeof erc20Abi, 'tokenURI', 'inputs'>
 *
 * [{
 *   internalType: 'uint256',
 *   name: 'tokenId',
 *   type: 'uint256',
 * }]
 */
export type ExtractAbiFunctionParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TAbiParameterType extends AbiParameterType,
> = ExtractAbiFunction<TAbi, TFunctionName>[TAbiParameterType]

/**
 * Extracts all {@link AbiEvent} types from {@link Abi}
 *
 * @param TAbi - {@link Abi} to extract functions from.
 * @returns Boolean for whether {@link TAbi} is {@link Abi}.
 */
export type ExtractAbiEvents<TAbi extends Abi> = Extract<
  TAbi[number],
  { type: 'event' }
>

/**
 * @description Extracts all {@link AbiEvent} names from {@link Abi}
 *
 * @param TAbi - {@link Abi} to extract event names from.
 * @returns Union of event names
 *
 * @example
 * type Result = ExtractAbiEventNames<typeof erc20Abi>
 *
 * 'approval' | 'transfer'
 */
export type ExtractAbiEventNames<TAbi extends Abi> =
  ExtractAbiEvents<TAbi>['name']

/**
 * Extracts {@link AbiEvent} with name from {@link Abi}
 *
 * @param TAbi - {@link Abi} to extract {@link AbiEvent} from.
 * @param TEventName - String name of event to extract from {@link Abi}
 * @returns Matching {@link AbiEvent}
 *
 * @example
 * type Result = ExtractAbiEvent<typeof erc20Abi, 'transfer'>
 *
 * {
 *   type: 'event',
 *   name: 'Transfer',
 *   anonymous: false,
 *   inputs: [
 *     { indexed: true, internalType: 'address', name: 'from', type: 'address' },
 *     { indexed: true, internalType: 'address', name: 'to', type: 'address' },
 *     {
 *       indexed: false,
 *       internalType: 'uint256',
 *       name: 'value',
 *       type: 'uint256',
 *     },
 *   ],
 * }
 */
export type ExtractAbiEvent<
  TAbi extends Abi,
  TEventName extends ExtractAbiEventNames<TAbi>,
> = Extract<ExtractAbiEvents<TAbi>, { name: TEventName }>

/**
 * Extracts {@link AbiParameter} types for event name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiParameter}s from.
 * @param TEventName - String name of event
 * @returns Array of {@link AbiParameter}
 *
 * @example
 * type Result = ExtractAbiFunctionParameters<typeof erc20Abi, 'transfer'>
 *
 * [
 *   { indexed: true, internalType: 'address', name: 'from', type: 'address' },
 *   { indexed: true, internalType: 'address', name: 'to', type: 'address' },
 *   {
 *     indexed: false,
 *     internalType: 'uint256',
 *     name: 'value',
 *     type: 'uint256',
 *   },
 * ]
 */
export type ExtractAbiEventParameters<
  TAbi extends Abi,
  TEventName extends ExtractAbiEventNames<TAbi>,
> = ExtractAbiEvent<TAbi, TEventName>['inputs']
