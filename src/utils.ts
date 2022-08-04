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
  SolFixed,
  SolFunction,
  SolInt,
  SolString,
  SolTuple,
} from './abi'

/**
 * Converts {@link AbiType} to corresponding TypeScript primitive type.
 *
 * Note: Does not include tuple conversion. Use {@link AbiParameterTypeToPrimitiveType} to also convert tuples.
 */
export type AbiTypeToPrimitiveType<TAbiType extends AbiType> =
  TAbiType extends SolAddress
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
 */
export type AbiParameterTypeToPrimitiveType<
  TAbiParameter extends AbiParameter,
> = TAbiParameter extends { type: SolTuple }
  ? {
      [Component in (TAbiParameter & {
        components: readonly AbiParameter[]
      })['components'][number] as Component['name']]: AbiParameterTypeToPrimitiveType<Component>
    }
  : AbiTypeToPrimitiveType<TAbiParameter['type']>

/**
 * Checks if type is abi
 */
export type IsAbi<T> = T extends Abi ? true : false

/**
 * Extracts all {@link AbiFunction} from abi
 */
export type ExtractAbiFunctions<
  TAbi extends Abi,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: 'function'; stateMutability: TAbiStateMutibility }
>
/**
 * Extracts all {@link AbiFunction} names from abi
 */
export type ExtractAbiFunctionNames<
  TAbi extends Abi,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = ExtractAbiFunctions<TAbi, TAbiStateMutibility>['name']
/**
 * Extracts {@link AbiFunction} with name from abi
 */
export type ExtractAbiFunction<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = Extract<ExtractAbiFunctions<TAbi>, { name: TFunctionName }>

/**
 * Extracts {@link AbiFunction} parameters for function name from abi
 */
export type ExtractAbiFunctionParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TAbiParameterType extends AbiParameterType,
> = ExtractAbiFunction<TAbi, TFunctionName>[TAbiParameterType]

/**
 * Converts array of {@link AbiParameter} to corresponding TypeScript primitive types.
 */
export type AbiParametersToPrimitiveTypes<
  TAbiParameters extends readonly AbiParameter[],
> = TAbiParameters['length'] extends 0
  ? undefined
  : TAbiParameters['length'] extends 1
  ? AbiParameterTypeToPrimitiveType<TAbiParameters[0]>
  : {
      // SHOUTOUT(@tvler): For finding a better way to map tuples
      // https://github.com/microsoft/TypeScript/issues/27351
      [K in keyof TAbiParameters]: AbiParameterTypeToPrimitiveType<
        TAbiParameters[K]
      >
    }
