import {
  Abi,
  AbiParameter,
  AbiParameterType,
  AbiStateMutability,
  AbiType,
  Address,
  SolAddress,
  SolArray,
  SolBool,
  SolBytes,
  SolFixed,
  SolFunction,
  SolInt,
  SolString,
  SolTuple,
} from './abi'
import { Replace } from './types'

export type SolArrayToPrimitiveType<TSolArray extends SolArray> =
  AbiTypeToPrimitiveType<Replace<TSolArray, '[]', ''>>[]

/**
 * Converts {@link AbiType} to corresponding TypeScript primitive type.
 *
 * Note: Does not include tuple conversion. Use {@link AbiParameterToPrimitiveType} to also convert tuples.
 *
 * @param TAbiType - {@link AbiType} to convert to TypeScript representation.
 * @returns TypeScript primitive type
 */
export type AbiTypeToPrimitiveType<TAbiType extends AbiType> =
  TAbiType extends `${any}[]`
    ? any[] // SolArrayToPrimitiveType<TAbiType>
    : TAbiType extends SolAddress
    ? Address
    : TAbiType extends SolBool
    ? boolean
    : TAbiType extends SolBytes
    ? string
    : TAbiType extends SolFunction
    ? `${Address}${string}`
    : TAbiType extends SolString
    ? string
    : TAbiType extends SolInt
    ? number
    : TAbiType extends SolFixed
    ? number
    : unknown

/**
 * Converts {@link AbiParameter} to corresponding TypeScript primitive type.
 *
 * @param TAbiParameter - {@link AbiParameter} to convert to TypeScript representation.
 * @returns TypeScript primitive type
 *
 * @example
 *
 * ```ts
 * // Returns string
 * type Result = AbiParameterToPrimitiveType<{
 *   internalType: 'string'
 *   name: 'name'
 *   type: 'string'
 * }>
 * ```
 */
export type AbiParameterToPrimitiveType<TAbiParameter extends AbiParameter> =
  TAbiParameter extends { type: SolTuple }
    ? {
        [Component in (TAbiParameter & {
          components: readonly AbiParameter[]
        })['components'][number] as Component['name']]: AbiParameterToPrimitiveType<Component>
      }
    : AbiTypeToPrimitiveType<TAbiParameter['type']>

/**
 * Checks if type is {@link Abi}
 *
 * @param TAbi - {@link Abi} to check.
 * @returns Boolean for whether {@link TAbi} is {@link Abi}.
 *
 * @example
 *
 * ```ts
 * // Returns true
 * type Result = IsAbi<typeof erc20Abi>
 * ```
 */
export type IsAbi<TAbi> = TAbi extends Abi ? true : false

/**
 * Extracts all {@link AbiFunction}s from {@link Abi}
 *
 * @param TAbi - {@link Abi} to extract functions from.
 * @returns Boolean for whether {@link TAbi} is {@link Abi}.
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
 * @returns Union of function names
 *
 * @example
 *
 * ```ts
 * // Returns 'tokenURI' | 'symbol' | 'totalSupply' | ...
 * type Result = ExtractAbiFunctionNames<typeof erc20Abi>
 * ```
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
 *
 * ```ts
 * // Returns
 * // { type: 'function', name: 'tokenURI', stateMutability: 'pure', inputs: [...], outputs: [...] }
 * type Result = ExtractAbiFunction<typeof erc20Abi, 'tokenURI'>
 * ```
 */
export type ExtractAbiFunction<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = Extract<ExtractAbiFunctions<TAbi>, { name: TFunctionName }>

/**
 * Extracts {@link AbiParameter}s for function name from {@link Abi}.
 *
 * @param TAbi - {@link Abi} to extract {@link AbiParameter}s from.
 * @param TFunctionName - String name of function
 * @param TAbiParameterType - {@link AbiParameterType} to extract parameters
 * @returns Array of {@link AbiParameter}
 *
 * @example
 *
 * ```ts
 * // Returns
 * // { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
 * type Result = ExtractAbiFunctionParameters<typeof erc20Abi, 'tokenURI', 'inputs'>
 * ```
 */
export type ExtractAbiFunctionParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TAbiParameterType extends AbiParameterType,
> = ExtractAbiFunction<TAbi, TFunctionName>[TAbiParameterType]

/**
 * Converts array of {@link AbiParameter} to corresponding TypeScript primitive types.
 *
 * @param TAbiParameters - Array of {@link AbiParameter} to convert to TypeScript representations.
 * @returns Array of TypeScript primitive types
 */
export type AbiParametersToPrimitiveTypes<
  TAbiParameters extends readonly AbiParameter[],
> = TAbiParameters['length'] extends 0
  ? undefined
  : TAbiParameters['length'] extends 1
  ? AbiParameterToPrimitiveType<TAbiParameters[0]>
  : {
      // SHOUTOUT(@tvler): For finding a better way to map tuples
      // https://github.com/microsoft/TypeScript/issues/27351
      [K in keyof TAbiParameters]: AbiParameterToPrimitiveType<
        TAbiParameters[K]
      >
    }
