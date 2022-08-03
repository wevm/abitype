export type Address = `0x${string}`

/**
 * Solidity ABI spec elementary types
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#types
 */
export type AbiType =
  | 'address'
  | 'bool'
  | `bytes${number | ''}`
  | 'function'
  | 'string'
  | 'tuple'
  | `${'u' | ''}int${number | ''}`
  | `${'u' | ''}fixed${number}x${number}`
  | `${'u' | ''}fixed`
// TODO: Memory sizes and dynamic array types

/**
 * Converts {@see AbiType} to corresponding TypeScript primitive type.
 *
 * Note: Does not include tuple conversion. Use {@see AbiParameterTypeToPrimitiveType} to also convert tuples.
 */
export type AbiTypeToPrimitiveType<TAbiType extends AbiType> =
  TAbiType extends 'address'
    ? Address
    : TAbiType extends 'bool'
    ? boolean
    : TAbiType extends `bytes${number | ''}`
    ? string
    : TAbiType extends 'function'
    ? `${Address}${string}`
    : TAbiType extends 'string'
    ? string
    : TAbiType extends `${'u' | ''}int${number | ''}`
    ? number
    : TAbiType extends `${'u' | ''}fixed${number}x${number}`
    ? number
    : TAbiType extends `${'u' | ''}fixed`
    ? number
    : unknown

/**
 * Abi parameter
 */
export type AbiParameter = {
  type: AbiType
  name: string
  internalType: AbiType | `struct ${string}`
} & (
  | { type: Exclude<AbiType, 'tuple'> }
  | {
      type: Extract<AbiType, 'tuple'>
      components: readonly AbiParameter[]
    }
)

/**
 * Converts {@see AbiParameter} to corresponding TypeScript primitive type.
 */
export type AbiParameterTypeToPrimitiveType<
  TAbiParameter extends AbiParameter,
> = TAbiParameter extends { type: 'tuple' }
  ? {
      [Component in (TAbiParameter & {
        components: readonly AbiParameter[]
      })['components'][number] as Component['name']]: AbiParameterTypeToPrimitiveType<Component>
    }
  : AbiTypeToPrimitiveType<TAbiParameter['type']>

export type AbiParameterType = 'inputs' | 'outputs'

export type AbiStateMutability = 'pure' | 'view' | 'nonpayable' | 'payable'

/**
 * Abi function
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type AbiFunction<TAbiParameter extends AbiParameter = AbiParameter> = {
  /**
   * @deprecated use `pure` or `view` from {@link AbiStateMutability} instead
   * https://github.com/ethereum/solidity/issues/992
   */
  constant?: boolean
  /**
   * @deprecated use `payable` or `nonpayable` from {@link AbiStateMutability} instead
   * https://github.com/ethereum/solidity/issues/992
   */
  payable?: boolean
  stateMutability: AbiStateMutability
} & (
  | {
      type: 'function'
      inputs: readonly TAbiParameter[]
      name: string
      outputs: readonly TAbiParameter[]
    }
  | {
      type: 'constructor'
      inputs: readonly TAbiParameter[]
    }
  | { type: 'fallback' }
  | { type: 'receive'; stateMutability: 'payable' }
)

/**
 * Abi event
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type AbiEvent<TAbiParameter extends AbiParameter = AbiParameter> = {
  type: 'event'
  anonymous?: boolean
  inputs: readonly (TAbiParameter & { indexed?: boolean })[]
  name: string
}

/**
 * Abi error
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type AbiError<TAbiParameter extends AbiParameter = AbiParameter> = {
  type: 'error'
  inputs: readonly TAbiParameter[]
  name: string
}

/**
 * Abi
 * https://docs.soliditylang.org/en/v0.8.15/abi-spec.html#json
 */
export type Abi<TAbiParameter extends AbiParameter = AbiParameter> = readonly (
  | AbiFunction<TAbiParameter>
  | AbiEvent<TAbiParameter>
  | AbiError<TAbiParameter>
)[]

/**
 * Extracts all {@see AbiFunction} from abi
 */
export type ExtractAbiFunctions<
  TAbi extends Abi,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = Extract<
  TAbi[number],
  { type: 'function'; stateMutability: TAbiStateMutibility }
>
/**
 * Extracts all {@see AbiFunction} names from abi
 */
export type ExtractAbiFunctionNames<
  TAbi extends Abi,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = ExtractAbiFunctions<TAbi, TAbiStateMutibility>['name']
/**
 * Extracts {@see AbiFunction} with name from abi
 */
export type ExtractAbiFunction<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = Extract<ExtractAbiFunctions<TAbi>, { name: TFunctionName }>

/**
 * Extracts {@see AbiFunction} parameters for function name from abi
 */
export type ExtractAbiFunctionParameters<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
  TAbiParameterType extends AbiParameterType,
> = ExtractAbiFunction<TAbi, TFunctionName>[TAbiParameterType]

/**
 * Converts array of {@see AbiParameter} to corresponding TypeScript primitive types.
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
