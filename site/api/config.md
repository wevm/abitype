# Configuration

ABIType tries to strike a balance between type exhaustiveness and speed with sensible defaults. In some cases, you might want to tune your configuration (e.g. use a custom bigint type). To do this, the following configuration options are available:

| Option                | Type                            | Default                                                               | Description                                                                                              |
| --------------------- | ------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `AddressType`         | `any`                           | `` `0x${string}` ``                                                   | TypeScript type to use for `address` values.                                                             |
| `ArrayMaxDepth`       | `number \| false`               | `false`                                                               | Maximum depth for nested array types (e.g. `string[][]`). When `false`, there is no maximum array depth. |
| `BigIntType`          | `any`                           | `bigint`                                                              | TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48`.                                |
| `BytesType`           | `{ inputs: any; outputs: any }` | `` { inputs: `0x${string}` \| Uint8Array; outputs: `0x${string}` } `` | TypeScript type to use for `bytes<M>` values.                                                            |
| `FixedArrayMinLength` | `number`                        | `1`                                                                   | Lower bound for fixed-length arrays                                                                      |
| `FixedArrayMaxLength` | `number`                        | `99`                                                                  | Upper bound for fixed-length arrays                                                                      |
| `IntType`             | `any`                           | `number`                                                              | TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48`.                               |
| `StrictAbiType`       | `boolean`                       | `false`                                                               | When set, validates `AbiParameter`'s `type` against `AbiType`.                                           |

> **Warning**
>
> When configuring `ArrayMaxDepth`, `FixedArrayMinLength`, and `FixedArrayMaxLength`, there are trade-offs. For example, choosing a non-false value for `ArrayMaxDepth` and increasing the range between `FixedArrayMinLength` and `FixedArrayMaxLength` will make your types more exhaustive, but will also slow down the compiler for type checking, autocomplete, etc.

Configuration options are customizable using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). Just install `abitype` (make sure versions match) and extend the `Config` interface either directly in your code or in a `d.ts` file (e.g. `abi.d.ts`):

```ts
declare module 'abitype' {
  export interface Config {
    BigIntType: MyCustomBigIntType
  }
}
```

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgJQKYGcIBsBuqAmAwhAHYBmwA5nAL5xlQQhwDkAhgEbAwCeYqLAFCDe-OAFkehAK7oYTAEJUAkiRgAVPqjgBeOF0rA1cAGSJ6ECAC5WHNlBa1h+VAGMs97SAj5pWbexcogKIgnBwqAAekLBwRjCoUGRsrtrE5FSh4eFKlKoaWjaSMnKKKmqa-GFONMLBKBh+8HpomLgE6RSUANosufmVAgC6ggD0o9kAegD8gkA)
