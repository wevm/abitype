import { Address, TypedData, TypedDataDomain } from '../abi'
import { TypedDataToPrimitiveTypes } from '../utils'

type GetValue<TSchema = unknown> = TSchema[keyof TSchema] extends infer TValue
  ? // Check if we were able to infer the shape of typed data
    { [key: string]: any } extends TValue
    ? {
        /**
         * Data to sign
         *
         * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link types} for type inference.
         */
        value: Record<string, unknown>
      }
    : {
        /** Data to sign */
        value: TValue
      }
  : never

type SignTypedDataConfig<TTypedData = TypedData, TSchema = unknown> = {
  /** Domain info */
  domain: TypedDataDomain
  /** Named list of all type definitions */
  types: TTypedData
} & GetValue<TSchema>

export function signTypedData<
  TTypedData extends TypedData,
  TSchema extends TypedDataToPrimitiveTypes<TTypedData>,
>(_config: SignTypedDataConfig<TTypedData, TSchema>) {
  return {} as Address
}
