import type {
  Abi,
  AbiEvent,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiEvent,
  ExtractAbiEventNames,
} from 'abitype'

export declare function watchContractEvent<
  const TAbi extends Abi | readonly unknown[],
  TEventName extends string,
>(config: GetConfig<TAbi, TEventName>): void

type GetConfig<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string = string,
> = {
  /** Contract ABI */
  abi: TAbi
  /** Contract address */
  address: Address
  /** Function to invoke on the contract */
  eventName: GetEventName<TAbi, TEventName>
} & GetListener<TAbi, TEventName>

type GetEventName<
  TAbi extends Abi | readonly unknown[] = Abi,
  TEventName extends string = string,
> = TAbi extends Abi
  ? ExtractAbiEventNames<TAbi> extends infer AbiEventNames
    ?
        | AbiEventNames
        | (TEventName extends AbiEventNames ? TEventName : never)
        | (Abi extends TAbi ? string : never)
    : never
  : TEventName

type GetListener<
  TAbi extends Abi | readonly unknown[],
  TEventName extends string,
  _AbiEvent extends AbiEvent = TAbi extends Abi
    ? ExtractAbiEvent<TAbi, TEventName>
    : AbiEvent,
  _Args = AbiParametersToPrimitiveTypes<_AbiEvent['inputs'], 'inputs'>,
  FailedToParseArgs =
    | ([_Args] extends [never] ? true : false)
    | (readonly unknown[] extends _Args ? true : false),
> = true extends FailedToParseArgs
  ? {
      /**
       * Callback when event is emitted
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link abi} for type inference.
       */
      listener: (...args: unknown[]) => void
    }
  : {
      /** Callback when event is emitted */ listener: (
        ...args: _Args extends readonly unknown[] ? _Args : unknown[]
      ) => void
    }
