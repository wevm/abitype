import type {
  Address,
  Narrow,
  TypedData,
  TypedDataDomain,
  TypedDataToPrimitiveTypes,
} from 'abitype'

export declare function signTypedData<
  TTypedData extends TypedData | { [key: string]: unknown },
>(config: SignTypedDataConfig<TTypedData>): Address

type SignTypedDataConfig<
  TTypedData extends TypedData | { [key: string]: unknown } = TypedData,
  TSchema = TTypedData extends TypedData
    ? TypedDataToPrimitiveTypes<TTypedData>
    : { [key: string]: any },
  TValue = TSchema[keyof TSchema],
> = {
  /** Domain info */
  domain: TypedDataDomain
  /** Named list of all type definitions */
  types: Narrow<TTypedData>
} & ({ [key: string]: any } extends TValue // Check if we were able to infer the shape of typed data
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
    })
