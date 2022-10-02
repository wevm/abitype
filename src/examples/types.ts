import {
  Abi,
  AbiFunction,
  AbiParameter,
  AbiStateMutability,
  Address,
} from '../abi'
import {
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from '../utils'

/**
 * Check if {@link T} is `never`
 *
 * @param T - Type to check
 * @returns `true` if {@link T} is `never`, otherwise `false`
 *
 * @example
 * type Result = IsNever<'foo'>
 */
export type IsNever<T> = [T] extends [never] ? true : false

/**
 * Check if {@link T} and {@link U} are equal
 *
 * @param T
 * @param U
 * @returns `true` if {@link T} and {@link U} are not equal, otherwise `false`
 *
 * @example
 * type Result = NotEqual<'foo', 'bar'>
 */
export type NotEqual<T, U> = [T] extends [U] ? false : true

/**
 * Boolean "or" operator
 *
 * @param T
 * @param U
 * @returns `true` if either {@link T} or {@link U} are `true`, otherwise `false`
 *
 * @example
 * type Result = Or<true, false>
 */
export type Or<T, U> = T extends true ? true : U extends true ? true : false

type GetArgs<
  TAbi extends Abi | readonly unknown[],
  // It's important that we use `TFunction` to parse args so overloads still return the correct types
  TFunction extends AbiFunction & { type: 'function' },
> = TFunction['inputs'] extends infer TInputs extends readonly AbiParameter[]
  ? // Check if valid ABI. If `TInputs` is `never` or `TAbi` does not have the same shape as `Abi`, then return optional `readonly unknown[]` args.
    Or<IsNever<TInputs>, NotEqual<TAbi, Abi>> extends true
    ? {
        /**
         * Arguments to pass contract method
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
         */
        args?: readonly unknown[]
      }
    : // If there are no inputs, do not include `args` in the return type.
    TInputs['length'] extends 0
    ? { args?: never }
    : // Convert `TInputs` to primitive TypeScript types
      {
        /** Arguments to pass contract method */
        args: AbiParametersToPrimitiveTypes<TInputs>
      }
  : never

export type ContractConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TFunction extends AbiFunction & { type: 'function' } = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : never,
> = {
  /** Contract address */
  address: Address
  /** Contract ABI */
  abi: TAbi
  /** Function to invoke on the contract */
  // If `TFunctionName` is `never`, then ABI was not parsable. Fall back to `string`.
  functionName: IsNever<TFunctionName> extends true ? string : TFunctionName
} & GetArgs<TAbi, TFunction>

export type GetConfig<
  TContract = unknown,
  TAbiStateMutibility extends AbiStateMutability = AbiStateMutability,
> = TContract extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? ContractConfig<
      TAbi,
      ExtractAbiFunctionNames<TAbi, TAbiStateMutibility>,
      ExtractAbiFunction<TAbi, TFunctionName>
    >
  : TContract extends {
      abi: infer TAbi extends readonly unknown[]
      functionName: infer TFunctionName extends string
    }
  ? ContractConfig<TAbi, TFunctionName>
  : ContractConfig

type GetResult<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TFunction extends AbiFunction & { type: 'function' } = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : never,
> =
  // Save `TOutputs` to local variable
  TFunction['outputs'] extends infer TOutputs extends readonly AbiParameter[]
    ? // Check if valid ABI. If `TOutputs` is `never` or `TAbi` does not have the same shape as `Abi`, then return `unknown` as result.
      Or<IsNever<TOutputs>, NotEqual<TAbi, Abi>> extends true
      ? unknown
      : // Save `TLength` to local variable for comparisons
      TOutputs['length'] extends infer TLength
      ? TLength extends 0
        ? void // If there are no outputs, return `void`
        : TLength extends 1
        ? AbiParameterToPrimitiveType<TOutputs[0]> // If there is one output, return the primitive type
        : // If outputs are inferrable, must be a known type. Convert to TypeScript primitives.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        TOutputs extends readonly [...infer _]
        ? /**
           * Return output as array assigned to an object with named keys
           *
           * | Outputs                                                               | Result                                                     |
           * | --------------------------------------------------------------------- | ---------------------------------------------------------- |
           * | `[{ name: 'foo', type: 'uint256' }, { name: 'bar', type: 'string' }]` | `readonly [bigint, string] & { foo: bigint; bar: string }` |
           * | `[{ name: 'foo', type: 'uint256' }, { name: '', type: 'string' }]`    | `readonly [bigint, string] & { foo: bigint }`              |
           */
          {
            [Output in TOutputs[number] as Output['name'] extends ''
              ? never
              : Output['name']]: AbiParameterToPrimitiveType<Output>
          } & AbiParametersToPrimitiveTypes<TOutputs>
        : unknown
      : never
    : never

export type GetReturnType<TContract = unknown> = TContract extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? GetResult<TAbi, TFunctionName, ExtractAbiFunction<TAbi, TFunctionName>>
  : TContract extends {
      abi: infer TAbi extends readonly unknown[]
      functionName: infer TFunctionName extends string
    }
  ? GetResult<TAbi, TFunctionName>
  : GetResult
