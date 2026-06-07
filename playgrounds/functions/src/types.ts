import type * as a from 'abitype'

export type ContractParameters<
  abi extends a.abi | readonly unknown[] = a.abi, // `readonly unknown[]` allows for non-const asserted types
  functionName extends string = string,
  abiStateMutability extends a.abi.stateMutability = a.abi.stateMutability,
  args extends readonly unknown[] | undefined = readonly [],
  ///
  functionNames extends string = abi extends a.abi
    ? a.abi.functions.names<abi, abiStateMutability>
    : string,
> = {
  functionName:
    | functionNames // show all values
    | (functionName extends functionNames ? functionName : never) // infer value (if valid)
    | (a.abi extends abi ? string : never) // fallback if `abi` is declared as `Abi`
} & GetArgs<abi, functionName, args>

type GetArgs<
  abi extends a.abi | readonly unknown[] = a.abi, // `readonly unknown[]` allows for non-const asserted types
  functionName extends string = string,
  args extends readonly unknown[] | undefined = readonly [],
  ///
  abiFunction extends a.abi.functions.item = abi extends a.abi
    ? a.abi.functions.extract<abi, functionName>
    : a.abi.functions.item,
  primitiveTypes = a.abi.parameters.infer<
    abiFunction['inputs'],
    'inputs',
    true
  >,
  args_ =
    | primitiveTypes // show all values
    | (abi extends a.abi
        ? args extends primitiveTypes // infer value (if valid)
          ? primitiveTypes extends args // make sure `args` exactly matches `primitiveTypes` (e.g. avoid `args: readonly [{ foo: string; bar: number; }] | readonly [{ foo: string; }]`)
            ? // make inferred value of `args` match `primitiveTypes` (e.g. avoid union `args: readonly [123n] | readonly [bigint]`)
              ReadonlyWiden<args>
            : never
          : never
        : never)
    | (a.abi extends abi ? readonly unknown[] : never), // fallback if `abi` is declared as `Abi`
> = MaybePartialBy<
  { args: args_ },
  readonly [] extends primitiveTypes
    ? 'args'
    : a.abi extends abi
      ? 'args'
      : string
>

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ContractReturnType<
  abi extends a.abi | readonly unknown[] = a.abi,
  functionName extends string = string,
  args extends readonly unknown[] | undefined = readonly unknown[] | undefined,
  ///
  abiFunction extends a.abi.functions.item = (
    abi extends a.abi
      ? a.abi.functions.extract<abi, functionName>
      : a.abi.functions.item
  ) extends infer abiFunction_ extends a.abi.functions.item
    ? IsUnion<abiFunction_> extends true // narrow overloads by `args` by converting to tuple and filtering out overloads that don't match
      ? UnionToTuple<abiFunction_> extends infer abiFunctions extends
          readonly a.abi.functions.item[]
        ? {
            [K in keyof abiFunctions]: (
              readonly unknown[] | undefined extends args // for functions that don't have inputs, `args` can be `undefined` so fallback to `readonly []`
                ? readonly []
                : args
            ) extends a.abi.parameters.infer<
              abiFunctions[K]['inputs'],
              'inputs'
            >
              ? abiFunctions[K]
              : never
          }[number] // convert back to union (removes `never` tuple entries: `['foo', never, 'bar'][number]` => `'foo' | 'bar'`)
        : never
      : abiFunction_
    : never,
  outputs extends a.abi.parameters.root = abiFunction['outputs'],
  primitiveTypes extends readonly unknown[] = a.abi.parameters.infer<
    outputs,
    'outputs',
    true
  >,
> = [abiFunction] extends [never]
  ? unknown // `abiFunction` was not inferrable (e.g. `abi` declared as `Abi`)
  : readonly unknown[] extends primitiveTypes
    ? unknown // `abiFunction` was not inferrable (e.g. `abi` not const-asserted)
    : primitiveTypes extends readonly [] // unwrap `primitiveTypes`
      ? // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
        void // no outputs
      : primitiveTypes extends readonly [infer primitiveType]
        ? primitiveType // single output
        : primitiveTypes

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type IsUnion<T, C = T> = T extends C ? ([C] extends [T] ? false : true) : never

type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last]
type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never
type UnionToIntersection<U> = (
  U extends unknown
    ? (arg: U) => 0
    : never
) extends (arg: infer I) => 0
  ? I
  : never

type PartialBy<TType, TKeys extends keyof TType> = ExactPartial<
  Pick<TType, TKeys>
> &
  Omit<TType, TKeys>
type ExactPartial<T> = { [K in keyof T]?: T[K] | undefined }

type MaybePartialBy<TType, TKeys extends string> = TKeys extends keyof TType
  ? PartialBy<TType, TKeys>
  : TType

type ReadonlyWiden<TType> =
  | (TType extends Function ? TType : never)
  | (TType extends a.resolvedRegister['bigIntType'] ? bigint : never)
  | (TType extends boolean ? boolean : never)
  | (TType extends a.resolvedRegister['intType'] ? number : never)
  | (TType extends string
      ? TType extends a.abi.address
        ? a.abi.address
        : TType extends a.resolvedRegister['bytesType']['inputs']
          ? a.resolvedRegister['bytesType']
          : string
      : never)
  | (TType extends readonly [] ? readonly [] : never)
  | (TType extends Record<string, unknown>
      ? { [K in keyof TType]: ReadonlyWiden<TType[K]> }
      : never)
  | (TType extends { length: number }
      ? {
          [K in keyof TType]: ReadonlyWiden<TType[K]>
        } extends infer Val extends unknown[]
        ? readonly [...Val]
        : never
      : never)

export type DeepPartial<
  T,
  MaxDepth extends number,
  Depth extends readonly number[] = [],
> = Depth['length'] extends MaxDepth
  ? T
  : T extends object
    ? {
        [P in keyof T]?: DeepPartial<T[P], MaxDepth, [...Depth, 1]> | undefined
      }
    : T
