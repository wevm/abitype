import type { Address, TypedData, TypedDataDomain } from '../abi'
import type { Narrow } from '../narrow'
import type { TypedDataToPrimitiveTypes } from '../utils'

type SignTypedDataConfig<TTypedData = unknown> = {
  /** Domain info */
  domain: TypedDataDomain
  /** Named list of all type definitions */
  types: Narrow<TTypedData>
} & (TTypedData extends TypedData
  ? TypedDataToPrimitiveTypes<TTypedData> extends infer TSchema
    ? TSchema[keyof TSchema] extends infer TValue
      ? // Check if we were able to infer the shape of typed data
        { [key: string]: any } extends TValue
        ? {
            /**
             * Data to sign
             *
             * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link types} for type inference.
             */
            value: { [key: string]: unknown }
          }
        : {
            /** Data to sign */
            value: TValue
          }
      : never
    : never
  : never)

export declare function signTypedData<
  TTypedData extends TypedData | { [key: string]: unknown },
>(config: SignTypedDataConfig<TTypedData>): Address
