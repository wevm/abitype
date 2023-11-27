import type {
  Abi,
  AbiEvent,
  AbiFunction,
  AbiParameter,
  AbiParameterToPrimitiveType,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiEvent,
  ExtractAbiEventNames,
  ResolvedRegister,
} from 'abitype'

import type {
  ContractInterface,
  ContractTransaction,
  EventFilter,
  EventLog,
  FunctionFragment,
  InterfaceAbi,
  Provider,
  Signer,
} from 'ethers'

import { Contract as EthersContract } from 'ethers'

import type { IsUnknown, UnionToIntersection } from './types.js'
import type {
  AbiItemName,
  CountOccurrences,
  Event,
  GetOverridesForAbiStateMutability,
} from './utils.js'

export function getContract<const abi extends Abi | readonly unknown[]>({
  address,
  abi,
  signerOrProvider,
}: GetContractArgs<abi>): GetContractResult<abi> {
  return new EthersContract(
    address,
    abi as unknown as InterfaceAbi,
    signerOrProvider,
  ) as GetContractResult<abi>
}

export type GetContractResult<TAbi = unknown> = TAbi extends Abi
  ? Contract<TAbi> & EthersContract
  : EthersContract

export type GetContractArgs<abi extends Abi | readonly unknown[]> = {
  address: Address

  abi: abi

  signerOrProvider?: Signer | Provider
}

type PropertyKeys =
  | 'address'
  | 'attach'
  | 'connect'
  | 'deployed'
  | 'interface'
  | 'resolvedAddress'
type FunctionKeys =
  | 'callStatic'
  | 'estimateGas'
  | 'functions'
  | 'populateTransaction'
type EventKeys =
  | 'emit'
  | 'filters'
  | 'listenerCount'
  | 'listeners'
  | 'off'
  | 'on'
  | 'once'
  | 'queryFilter'
  | 'removeAllListeners'
  | 'removeListener'

type BaseContract<
  TContract extends Record<
    keyof Pick<EthersContract, PropertyKeys | FunctionKeys | EventKeys>,
    unknown
  >,
> = Omit<EthersContract, PropertyKeys | FunctionKeys | EventKeys> & TContract

type InterfaceKeys = 'events' | 'functions'
// Create new `Interface` and remove keys we are going to type
type BaseInterface<
  Interface extends Record<
    keyof Pick<ContractInterface, InterfaceKeys>,
    unknown
  >,
> = Omit<ContractInterface, InterfaceKeys> & Interface

type Contract<TAbi extends Abi, _Functions = Functions<TAbi>> = _Functions &
  BaseContract<{
    address: Address
    resolvedAddress: Promise<Address>
    attach(addressOrName: Address | string): Contract<TAbi>
    connect(signerOrProvider: Signer | Provider | string): Contract<TAbi>
    deployed(): Promise<Contract<TAbi>>
    interface: BaseInterface<{
      events: InterfaceEvents<TAbi>
      functions: InterfaceFunctions<TAbi>
    }>

    callStatic: _Functions
    estimateGas: Functions<TAbi, { ReturnType: ResolvedRegister['BigIntType'] }>
    functions: Functions<TAbi, { ReturnTypeAsArray: true }>
    populateTransaction: Functions<TAbi, { ReturnType: ContractTransaction }>

    emit<TEventName extends ExtractAbiEventNames<TAbi> | EventFilter>(
      eventName: TEventName,
      ...args: AbiParametersToPrimitiveTypes<
        ExtractAbiEvent<
          TAbi,
          TEventName extends string ? TEventName : ExtractAbiEventNames<TAbi>
        >['inputs']
      > extends infer TArgs extends readonly unknown[]
        ? TArgs
        : never
    ): boolean
    filters: Filters<TAbi>
    listenerCount(): number
    listenerCount<TEventName extends ExtractAbiEventNames<TAbi>>(
      eventName: TEventName,
    ): number
    // TODO: Improve `eventFilter` type
    listenerCount(eventFilter: EventFilter): number
    listeners(): Array<(...args: any[]) => void>
    listeners<TEventName extends ExtractAbiEventNames<TAbi>>(
      eventName: TEventName,
    ): Listener<TAbi, TEventName>[]
    listeners(
      // TODO: Improve `eventFilter` and return types
      eventFilter: EventFilter,
    ): Listener<TAbi, ExtractAbiEventNames<TAbi>>[]
    off: EventListener<TAbi>
    on: EventListener<TAbi>
    once: EventListener<TAbi>
    queryFilter<TEventName extends ExtractAbiEventNames<TAbi>>(
      event: TEventName,
      fromBlockOrBlockhash?: string | number,
      toBlock?: string | number,
    ): Promise<EventLog[]>
    // TODO: Improve `eventFilter` and return types
    queryFilter(
      eventFilter: EventFilter,
      fromBlockOrBlockhash?: string | number,
      toBlock?: string | number,
    ): Promise<EventLog[]>
    removeAllListeners(eventName?: ExtractAbiEventNames<TAbi>): Contract<TAbi>
    // TODO: Improve `eventFilter` type
    removeAllListeners(eventFilter: EventFilter): Contract<TAbi>
    removeListener: EventListener<TAbi>
  }>

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions

type Functions<
  TAbi extends Abi,
  Options extends {
    ReturnType?: any
    ReturnTypeAsArray?: boolean
  } = {
    ReturnTypeAsArray: false
  },
> = UnionToIntersection<
  {
    // 1. Iterate through all items in ABI
    // 2. Set non-functions to `never`
    // 3. Convert functions to TypeScript function signatures
    [K in
      keyof TAbi]: TAbi[K] extends infer TAbiFunction extends AbiFunction & {
      type: 'function'
    }
      ? {
          // If function name occurs more than once, it is overloaded. Grab full string signature as name (what ethers does).
          [_ in
            CountOccurrences<TAbi, { name: TAbiFunction['name'] }> extends 1
              ? AbiItemName<TAbiFunction>
              : AbiItemName<TAbiFunction, true>]: (
            ...args: [
              ...args: TAbiFunction['inputs'] extends infer TInputs extends readonly AbiParameter[]
                ? AbiParametersToPrimitiveTypes<TInputs>
                : never,
              // Tack `overrides` onto end
              // TODO: TypeScript doesn't preserve tuple labels when merging
              // https://github.com/microsoft/TypeScript/issues/43020
              overrides?: GetOverridesForAbiStateMutability<
                TAbiFunction['stateMutability']
              >,
            ]
          ) => Promise<
            // Return a custom return type if specified. Otherwise, calculate return type.
            IsUnknown<Options['ReturnType']> extends true
              ? AbiFunctionReturnType<TAbiFunction> extends infer TAbiFunctionReturnType
                ? Options['ReturnTypeAsArray'] extends true
                  ? [TAbiFunctionReturnType]
                  : TAbiFunctionReturnType
                : never
              : Options['ReturnType']
          >
        }
      : never
  }[number]
>

// Get return type for function based on `AbiStateMutability`
type AbiFunctionReturnType<
  TAbiFunction extends AbiFunction & {
    type: 'function'
  },
> = ({
  payable: ContractTransaction
  nonpayable: ContractTransaction
} & {
  [_ in
    'pure' | 'view']: TAbiFunction['outputs']['length'] extends infer TLength
    ? TLength extends 0
      ? void // If there are no outputs, return `void`
      : TLength extends 1
      ? AbiParameterToPrimitiveType<TAbiFunction['outputs'][0]>
      : {
          [Output in
            TAbiFunction['outputs'][number] as Output extends {
              name: string
            }
              ? Output['name'] extends ''
                ? never
                : Output['name']
              : never]: AbiParameterToPrimitiveType<Output>
        } & AbiParametersToPrimitiveTypes<TAbiFunction['outputs']>
    : never
})[TAbiFunction['stateMutability']]

type InterfaceFunctions<TAbi extends Abi> = UnionToIntersection<
  {
    [K in
      keyof TAbi]: TAbi[K] extends infer TAbiFunction extends AbiFunction & {
      type: 'function'
    }
      ? {
          [_ in AbiItemName<TAbiFunction, true>]: FunctionFragment // TODO: Infer `FunctionFragment` type
        }
      : never
  }[number]
>

type InterfaceEvents<TAbi extends Abi> = UnionToIntersection<
  {
    [K in keyof TAbi]: TAbi[K] extends infer TAbiEvent extends AbiEvent
      ? {
          [_ in AbiItemName<TAbiEvent, true>]: FunctionFragment // TODO: Infer `EventFragment` type
        }
      : never
  }[number]
>

////////////////////////////////////////////////////////////////////////////////////////////////////
// Events

export interface EventListener<TAbi extends Abi> {
  <TEventName extends ExtractAbiEventNames<TAbi>>(
    eventName: TEventName,
    listener: Listener<TAbi, TEventName>,
  ): Contract<TAbi>
  (
    // TODO: Improve `eventFilter` and `listener` types
    eventFilter: EventFilter,
    listener: Listener<TAbi, ExtractAbiEventNames<TAbi>>,
  ): Contract<TAbi>
}

type Listener<
  TAbi extends Abi,
  TEventName extends string,
  TAbiEvent extends AbiEvent = ExtractAbiEvent<TAbi, TEventName>,
> = AbiParametersToPrimitiveTypes<
  TAbiEvent['inputs']
> extends infer TArgs extends readonly unknown[]
  ? (...args: [...args: TArgs, event: Event<TAbiEvent>]) => void
  : never

type Filters<TAbi extends Abi> = UnionToIntersection<
  {
    [K in keyof TAbi]: TAbi[K] extends infer TAbiEvent extends AbiEvent
      ? {
          [_ in
            CountOccurrences<TAbi, { name: TAbiEvent['name'] }> extends 1
              ? AbiItemName<TAbiEvent>
              : AbiItemName<TAbiEvent, true>]: (
            ...args: TAbiEvent['inputs'] extends infer TAbiParameters extends readonly (AbiParameter & {
              indexed?: boolean
            })[]
              ? {
                  // Only indexed event parameters may be filtered.
                  [K in
                    keyof TAbiParameters]: TAbiParameters[K]['indexed'] extends true
                    ? AbiParameterToPrimitiveType<TAbiParameters[K]> | null
                    : null
                }
              : never
          ) => EventFilter
        }
      : never
  }[number]
>
