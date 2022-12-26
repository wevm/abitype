import type {
  Abi,
  AbiFunction,
  AbiParameter,
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiStateMutability,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  Narrow,
} from '../index'

export type Contract<
  TAbi extends Abi | readonly unknown[] = Abi | readonly unknown[],
  TFunctionName extends string = string,
> = { abi: TAbi; functionName: TFunctionName }

type GetArgs<TAbiFunction extends AbiFunction & { type: 'function' }> =
  TAbiFunction['inputs']['length'] extends 0
    ? object
    : readonly AbiParameter[] extends TAbiFunction['inputs']
    ? // Not able to parse `inputs` from `AbiFunction`, return catch-all type
      {
        /**
         * Arguments to pass contract method
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
         */
        args?: readonly unknown[]
      }
    : {
        /** Arguments to pass contract method */
        args: AbiParametersToPrimitiveTypes<TAbiFunction['inputs']>
      }

export type Config<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiFunction extends AbiFunction & { type: 'function' } = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : AbiFunction & { type: 'function' },
> = {
  /** Contract ABI */
  abi: Narrow<TAbi> // infer `TAbi` type for inline usage
  /** Contract address */
  address: Address
  /** Function to invoke on the contract */
  functionName: TFunctionName
} & GetArgs<TAbiFunction>

// Allows us to infer `functionName` while also typing it to the full union of function names.
export type GetConfig<
  TContract extends Contract = Contract,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = TContract extends {
  abi: infer TAbi extends Abi
  functionName: infer TFunctionName extends string
}
  ? Abi extends TAbi
    ? // Not able to parse `TAbi`, return catch-all type.
      // Can happen when `abi` is declared as `Abi` directly (e.g. `const abi: Abi = […]`)
      Config
    : Config<
        TAbi,
        ExtractAbiFunctionNames<TAbi, TAbiStateMutability>,
        ExtractAbiFunction<TAbi, TFunctionName>
      >
  : TContract extends {
      abi: infer TAbi extends readonly unknown[]
      functionName: infer TFunctionName extends string
    }
  ? Config<TAbi, TFunctionName>
  : Config

export type GetReturnType<
  TContract extends Contract = Contract,
  TAbiFunction extends AbiFunction & {
    type: 'function'
  } = TContract['abi'] extends Abi
    ? ExtractAbiFunction<TContract['abi'], TContract['functionName']>
    : AbiFunction & { type: 'function' },
  TOutputsLength = TAbiFunction['outputs']['length'],
> =
  | (TOutputsLength extends 0
      ? void
      : TOutputsLength extends 1
      ? AbiParameterToPrimitiveType<TAbiFunction['outputs'][0]>
      : readonly AbiParameter[] extends TAbiFunction['outputs']
      ? unknown
      : AbiParametersToPrimitiveTypes<TAbiFunction['outputs']> &
          _GetNamedOutputs<TAbiFunction>)
  // Return `unknown` when not able to parse `TAbi`
  // Can happen when `abi` is declared as `Abi` directly (e.g. `const abi: Abi = […]`)
  | (Abi extends TContract['abi'] ? unknown : never)

// ethers returns hybrid array-objects for named outputs.
// This constructs the an object type from outputs if keys are named.
type _GetNamedOutputs<
  TAbiFunction extends AbiFunction & {
    type: 'function'
  },
> = {
  [Output in TAbiFunction['outputs'][number] as Output extends {
    name: infer Name extends string
  }
    ? Name extends ''
      ? never
      : Name
    : never]: AbiParameterToPrimitiveType<Output>
}
