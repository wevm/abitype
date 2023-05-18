import type {
  Abi,
  AbiFunction,
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
  functionName: InferFunctionName<TAbi, TFunctionName, TAbiStateMutability>
} & GetArgs<TAbi, TFunctionName>

export type InferFunctionName<
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
  _AbiFunction extends AbiFunction = TAbi extends Abi
    ? ExtractAbiFunction<TAbi, TFunctionName>
    : AbiFunction,
  _Args = AbiParametersToPrimitiveTypes<_AbiFunction['inputs'], 'inputs'>,
  FailedToParseArgs =
    | ([_Args] extends [never] ? true : false)
    | (readonly unknown[] extends _Args ? true : false),
> = true extends FailedToParseArgs
  ? {
      /**
       * Arguments to pass contract method
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
       */
      args?: readonly unknown[]
    }
  : _Args extends readonly []
  ? { args?: never }
  : {
      /** Arguments to pass contract method */ args: _Args
    }

export type GetReturnType<
  TAbi extends Abi | readonly unknown[] = Abi,
  TFunctionName extends string = string,
  _AbiFunction extends AbiFunction & {
    type: 'function'
  } = TAbi extends Abi ? ExtractAbiFunction<TAbi, TFunctionName> : AbiFunction,
  _Args = AbiParametersToPrimitiveTypes<_AbiFunction['outputs'], 'outputs'>,
  FailedToParseArgs =
    | ([_Args] extends [never] ? true : false)
    | (readonly unknown[] extends _Args ? true : false),
> = true extends FailedToParseArgs
  ? unknown
  : _Args extends readonly []
  ? void
  : _Args extends readonly [infer Arg]
  ? Arg
  : _Args

export type DeepPartial<
  T,
  MaxDepth extends number,
  Depth extends readonly number[] = [],
> = Depth['length'] extends MaxDepth
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P], MaxDepth, [...Depth, 1]> }
  : T

/**
 * Checks if {@link T} can be narrowed further than {@link U}
 * @param T - Type to check
 * @param U - Type to against
 * @example
 * type Result = IsNarrowable<'foo', string>
 * //   ^? true
 */
export type IsNarrowable<T, U> = IsNever<
  (T extends U ? true : false) & (U extends T ? false : true)
> extends true
  ? false
  : true

/**
 * Checks if {@link T} is `never`
 * @param T - Type to check
 * @example
 * type Result = IsNever<never>
 * //   ^? type Result = true
 */
export type IsNever<T> = [T] extends [never] ? true : false
