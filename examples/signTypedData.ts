import type {
  Address,
  TypedData,
  TypedDataDomain,
  TypedDataToPrimitiveTypes,
} from 'abitype'

export declare function signTypedData<
  const TTypedData extends TypedData | { [key: string]: unknown },
>(config: SignTypedDataConfig<TTypedData>): Address

type SignTypedDataConfig<
  TTypedData extends TypedData | { [key: string]: unknown } = TypedData,
  _Schema = TTypedData extends TypedData
    ? TypedDataToPrimitiveTypes<TTypedData>
    : { [_: string]: any },
  _Value = _Schema[keyof _Schema],
> = {
  /** Domain info */
  domain: TypedDataDomain
  /** Named list of all type definitions */
  types: TTypedData
} & ({ [__: string]: any } extends _Value // Check if we were able to infer the shape of typed data
  ? {
      /**
       * Data to sign
       *
       * Use a [const assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) on {@link types} for type inference.
       */
      value: { [___: string]: unknown }
    }
  : {
      /** Data to sign */
      value: _Value
    })
