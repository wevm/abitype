---
description: 'How to configure ABIType in userland or as a library author.'
title: 'Configuration'
---

# Configuration

How to configure ABIType in userland or as a library author.

## Overview

ABIType's types are customizable using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). Just install `abitype` (make sure versions match) and extend the `Config` interface either directly in your code or in a `d.ts` file (e.g. `abi.d.ts`):

```ts twoslash
declare module 'abitype' {
  export interface Config {
    BigIntType: bigint & { foo: 'bar' }
  }
}

import { ResolvedConfig } from 'abitype'
type Result = ResolvedConfig['BigIntType']
//   ^?
```

::: info Extending Config from third-party packages
If you are using ABIType via another package (e.g. [`wagmi`](https://wagmi.sh)), you can customize the ABIType's types by targeting the package's `abitype` module:

```ts
declare module 'wagmi/node_modules/abitype' {
  export interface Config {
    BigIntType: MyCustomBigIntType
  }
}
```
:::

## Options

ABIType tries to strike a balance between type exhaustiveness and speed with sensible defaults. In some cases, you might want to tune your configuration (e.g. use a custom `bigint` type). To do this, the following configuration options are available:

::: warning
When configuring `ArrayMaxDepth`, `FixedArrayMinLength`, and `FixedArrayMaxLength`, there are trade-offs. For example, choosing a non-false value for `ArrayMaxDepth` and increasing the range between `FixedArrayMinLength` and `FixedArrayMaxLength` will make your types more exhaustive, but will also slow down the compiler for type checking, autocomplete, etc.
:::

### `AddressType`

TypeScript type to use for `address` values.

- Type `any`
- Default `` `0x${string}` ``

```ts twoslash
declare module 'abitype' {
  export interface Config {
    AddressType: `0x${string}`
  }
}
```

### `ArrayMaxDepth`

Maximum depth for nested array types (e.g. `string[][]`). When `false`, there is no maximum array depth.

- Type `number | false`
- Default `false`

```ts twoslash
declare module 'abitype' {
  export interface Config {
    ArrayMaxDepth: false
  }
}
```

### `BigIntType`

TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48`.

- Type `any`
- Default `bigint`

```ts twoslash
declare module 'abitype' {
  export interface Config {
    BigIntType: bigint
  }
}
```

### `BytesType`

TypeScript type to use for `bytes<M>` values.

- Type `{ inputs: any; outputs: any }`
- Default `` { inputs: `0x${string}` | Uint8Array; outputs: `0x${string}` } ``

```ts twoslash
declare module 'abitype' {
  export interface Config {
    BytesType: {
      inputs: `0x${string}` | Uint8Array
      outputs: `0x${string}`
    }
  }
}
```

### `FixedArrayMinLength`

Lower bound for fixed-length arrays.

- Type `number`
- Default `1`

```ts twoslash
declare module 'abitype' {
  export interface Config {
    FixedArrayMinLength: 1
  }
}
```

### `FixedArrayMaxLength`

Upper bound for fixed-length arrays.

- Type `number`
- Default `99`

```ts twoslash
declare module 'abitype' {
  export interface Config {
    FixedArrayMinLength: 99
  }
}
```

### `IntType`

TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48`.

- Type `any`
- Default `number`

```ts twoslash
declare module 'abitype' {
  export interface Config {
    IntType: number
  }
}
```

### `StrictAbiType`

When set, validates `AbiParameter`'s `type` against `AbiType`.

- Type `boolean`
- Default `false`

```ts twoslash
declare module 'abitype' {
  export interface Config {
    StrictAbiType: false
  }
}
```

::: warning
You probably only want to set this to `true` if parsed types are returning as `unknown` and you want to figure out why. This will slow down type checking significantly.
:::
