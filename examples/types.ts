import type {
  Abi,
  AbiFunction,
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  AbiStateMutability,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
  Narrow,
} from 'abitype'

export type InferOptional<TType, TKeys extends keyof TType> = Partial<
  Pick<TType, TKeys>
> &
  Omit<TType, TKeys>

export type Contract<
  TAbi extends Abi | readonly unknown[] = Abi | readonly unknown[],
  TFunctionName extends string = string,
> = { abi: TAbi; functionName: TFunctionName }

export type GetConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = {
  /** Contract ABI */
  abi: Narrow<TAbi> // infer `TAbi` type for inline usage
  /** Contract address */
  address: Address
  /** Function to invoke on the contract */
  functionName: GetFunctionName<TAbi, TFunctionName, TAbiStateMutability>
} & GetArgs<TAbi, TFunctionName>

export type GetFunctionName<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiStateMutability extends AbiStateMutability = AbiStateMutability,
> = TAbi extends Abi
  ? ExtractAbiFunctionNames<
      TAbi,
      TAbiStateMutability
    > extends infer AbiFunctionNames
    ?
        | AbiFunctionNames
        | (TFunctionName extends AbiFunctionNames ? TFunctionName : never)
        | (Abi extends TAbi ? string : never)
    : never
  : TFunctionName

export type GetArgs<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TAbiFunction extends AbiFunction = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : AbiFunction,
  TArgs = AbiParametersToPrimitiveTypes<TAbiFunction['inputs'], 'inputs'>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? {
      /**
       * Arguments to pass contract method
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
       */
      args?: readonly unknown[]
    }
  : TArgs extends readonly []
  ? { args?: never }
  : {
      /** Arguments to pass contract method */ args: TArgs
    }

export type GetReturnType<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  TAbiFunction extends AbiFunction & {
    type: 'function'
  } = TAbi extends Abi ? ExtractAbiFunction<TAbi, TFunctionName> : AbiFunction,
  TArgs = AbiParametersToPrimitiveTypes<TAbiFunction['outputs'], 'outputs'>,
  FailedToParseArgs =
    | ([TArgs] extends [never] ? true : false)
    | (readonly unknown[] extends TArgs ? true : false),
> = true extends FailedToParseArgs
  ? unknown
  : TArgs extends readonly []
  ? void
  : TArgs extends readonly [infer Arg]
  ? Arg
  : TArgs & {
      // Construct ethers hybrid array-objects for named outputs.
      [Output in
        TAbiFunction['outputs'][number] as Output extends {
          name: infer Name extends string
        }
          ? Name extends ''
            ? never
            : Name
          : never]: AbiParameterToPrimitiveType<Output, 'outputs'>
    }

export type DeepPartial<
  T,
  MaxDepth extends number,
  Depth extends ReadonlyArray<number> = [],
> = Depth['length'] extends MaxDepth
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P], MaxDepth, [...Depth, 1]> }
  : T
