# ABIType

[![npm](https://img.shields.io/npm/v/abitype.svg?colorA=21262d&colorB=161b22&style=flat)](https://www.npmjs.com/package/abitype)
[![Downloads per month](https://img.shields.io/npm/dm/abitype?colorA=21262d&colorB=161b22&style=flat)](https://www.npmjs.com/package/abitype)

Strict TypeScript types for Ethereum ABIs. ABIType provides utilities and type definitions for ABI properties and values, covering the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html), as well as [EIP-712](https://eips.ethereum.org/EIPS/eip-712) Typed Data.

```ts
import { ExtractAbiFunctions } from 'abitype'

const erc721Abi = [...] as const

type Result = ExtractAbiFunctions<typeof erc721Abi, 'payable'>
```

Works great for adding blazing fast [autocomplete](https://twitter.com/awkweb/status/1555678944770367493) and type checking to functions, variables, or your own types ([see examples](/src/examples/)). No need to generate types with third-party tools – just use your ABI and let TypeScript do the rest!

## Installation

```bash
npm install abitype
```

## Usage

Since ABIs can contain deeply nested arrays and objects, you must either assert ABIs to constants using [`const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) or use the built-in `narrow` function (works with JavaScript). This allows TypeScript to take the most specific types for expressions and avoid type widening (e.g. no going from `"hello"` to `string`).

```ts
const erc721Abi = [...] as const
const erc721Abi = <const>[...]
```

```ts
import { narrow } from 'abitype'
const erc721Abi = narrow([...])
```

## Utilities

### AbiParameterToPrimitiveType

Converts `AbiParameter` to corresponding TypeScript primitive type.

```ts
import { AbiParameterToPrimitiveType } from 'abitype'

type Result = AbiParameterToPrimitiveType<{
  name: 'owner'
  type: 'address'
}>
```

### AbiParametersToPrimitiveTypes

Converts array of `AbiParameter` to corresponding TypeScript primitive types.

```ts
import { AbiParametersToPrimitiveTypes } from 'abitype'

type Result = AbiParametersToPrimitiveTypes<
  [
    {
      name: 'to'
      type: 'address'
    },
    {
      name: 'tokenId'
      type: 'uint256'
    },
  ]
>
```

### AbiTypeToPrimitiveType

Converts `AbiType` to corresponding TypeScript primitive type.

```ts
import { AbiParametersToPrimitiveTypes } from 'abitype'

type Result = AbiTypeToPrimitiveType<'address'>
```

> **Note**
> Does not include full array or tuple conversion. Use `AbiParameterToPrimitiveType` to fully convert array and tuple types.

### ExtractAbiError

Extracts all `AbiError` types from `Abi`

```ts
import { ExtractAbiError } from 'abitype'

type Result = ExtractAbiError<typeof erc721Abi, 'SomeError'>
```

### ExtractAbiErrorNames

Extracts all `AbiError` names from `Abi`

```ts
import { ExtractAbiErrorNames } from 'abitype'

type Result = ExtractAbiErrorNames<typeof erc721Abi>
```

### ExtractAbiErrors

Extracts all `AbiError` types from `Abi`

```ts
import { ExtractAbiErrors } from 'abitype'

type Result = ExtractAbiErrors<typeof erc721Abi>
```

### ExtractAbiEvent

Extracts `AbiEvent` with name from `Abi`

```ts
import { ExtractAbiEvent } from 'abitype'

type Result = ExtractAbiEvent<typeof erc721Abi, 'Transfer'>
```

### ExtractAbiEventNames

Extracts all `AbiEvent` names from `Abi`

```ts
import { ExtractAbiEventNames } from 'abitype'

type Result = ExtractAbiEventNames<typeof erc721Abi>
```

### ExtractAbiEvents

Extracts all `AbiEvent` types from `Abi`

```ts
import { ExtractAbiEvents } from 'abitype'

type Result = ExtractAbiEvents<typeof erc721Abi>
```

### ExtractAbiFunction

Extracts `AbiFunction` with name from `Abi`

```ts
import { AbiFunction } from 'abitype'

type Result = ExtractAbiFunction<typeof erc721Abi, 'balanceOf'>
```

### ExtractAbiFunctionNames

Extracts all `AbiFunction` names from `Abi`

```ts
import { ExtractAbiFunctionNames } from 'abitype'

type Result = ExtractAbiFunctionNames<typeof erc721Abi>
```

### ExtractAbiFunctions

Extracts all `AbiFunction` types from `Abi`

```ts
import { ExtractAbiFunctions } from 'abitype'

type Result = ExtractAbiFunctions<typeof erc721Abi>
```

By default, extracts all functions, but you can also filter by `AbiStateMutability`:

```ts
type Result = ExtractAbiFunctions<typeof erc721Abi, 'view'>
```

### IsAbi

Checks if type is `Abi`

```ts
import { IsAbi } from 'abitype'

type Result = IsAbi<typeof erc721Abi>
```

### IsTypedData

Checks if type is `TypedData`

```ts
import { IsTypedData } from 'abitype'

type Result = IsTypedData<{
  Person: [
    { name: 'name'; type: 'string' },
    { name: 'wallet'; type: 'address' },
  ]
  Mail: [
    { name: 'from'; type: 'Person' },
    { name: 'to'; type: 'Person' },
    { name: 'contents'; type: 'string' },
  ]
}>
```

### TypedDataToPrimitiveTypes

Converts [EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) `TypedData` to corresponding TypeScript primitive type.

```ts
import { TypedDataToPrimitiveTypes } from 'abitype'

type Result = TypedDataToPrimitiveTypes<{
  Person: [
    { name: 'name'; type: 'string' },
    { name: 'wallet'; type: 'address' },
  ]
  Mail: [
    { name: 'from'; type: 'Person' },
    { name: 'to'; type: 'Person' },
    { name: 'contents'; type: 'string' },
  ]
}>
```

## Types

### Abi

Type matching the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

```ts
import { Abi } from 'abitype'
```

### AbiError

ABI [Error](https://docs.soliditylang.org/en/latest/abi-spec.html#errors) type

```ts
import { AbiError } from 'abitype'
```

### AbiEvent

ABI [Event](https://docs.soliditylang.org/en/latest/abi-spec.html#events) type

```ts
import { AbiEvent } from 'abitype'
```

### AbiFunction

ABI [Function](https://docs.soliditylang.org/en/latest/abi-spec.html#argument-encoding) type

```ts
import { AbiFunction } from 'abitype'
```

### AbiInternalType

Representation used by Solidity compiler (e.g. `'string'`, `'int256'`, `'struct Foo'`)

```ts
import { AbiInternalType } from 'abitype'
```

### AbiParameter

`inputs` and `ouputs` item for ABI functions, events, and errors

```ts
import { AbiParameter } from 'abitype'
```

### AbiParameterType

Type of ABI parameter: `'inputs' | 'outputs'`

```ts
import { AbiParameterType } from 'abitype'
```

### AbiStateMutability

ABI Function behavior

```ts
import { AbiStateMutability } from 'abitype'
```

### AbiType

ABI canonical [types](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

```ts
import { AbiType } from 'abitype'
```

### Solidity types

[Solidity types](https://docs.soliditylang.org/en/latest/abi-spec.html#types) as template strings

```ts
import {
  SolidityAddress,
  SolidityArray,
  SolidityBool,
  SolidityBytes,
  SolidityFunction,
  SolidityInt,
  SolidityString,
  SolidityTuple,
} from 'abitype'
```

### TypedData

[EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Typed Data Specification

```ts
import { TypedData } from 'abitype'
```

### TypedDataDomain

[EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator) Domain

```ts
import { TypedDataDomain } from 'abitype'
```

### TypedDataParameter

Entry in `TypedData` type items

```ts
import { TypedDataParameter } from 'abitype'
```

### TypedDataType

Subset of `AbiType` that excludes `tuple` and `function`

```ts
import { TypedDataType } from 'abitype'
```

## Configuration

ABIType tries to strike a balance between type exhaustiveness and speed with sensible defaults. In some cases, you might want to tune your configuration (e.g. use a custom bigint type). To do this, the following configuration options are available:

| Option                | Type              | Default             | Description                                                                                              |
| --------------------- | ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| `AddressType`         | `any`             | `` `0x${string}` `` | TypeScript type to use for `address` values.                                                             |
| `ArrayMaxDepth`       | `number \| false` | `false`             | Maximum depth for nested array types (e.g. `string[][]`). When `false`, there is no maximum array depth. |
| `BigIntType`          | `any`             | `bigint`            | TypeScript type to use for `int<M>` and `uint<M>` values, where `M > 48`.                                |
| `BytesType`           | `any`             | `` `0x${string}` `` | TypeScript type to use for `bytes<M>` values.                                                            |
| `FixedArrayMinLength` | `number`          | `1`                 | Lower bound for fixed-length arrays                                                                      |
| `FixedArrayMaxLength` | `number`          | `99`                | Upper bound for fixed-length arrays                                                                      |
| `IntType`             | `any`             | `number`            | TypeScript type to use for `int<M>` and `uint<M>` values, where `M <= 48`.                               |
| `StrictAbiType`       | `boolean`         | `false`             | When set, validates `AbiParameter`'s `type` against `AbiType`.                                           |

Configuration options are customizable using [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). Just extend the `Config` interface either directly in your code or in a `d.ts` file (e.g. `abi.d.ts`):

```ts
declare module 'abitype' {
  export interface Config {
    BigIntType: MyCustomBigIntType
  }
}
```

> **Warning**
> When configuring `ArrayMaxDepth`, `FixedArrayMinLength`, and `FixedArrayMaxLength`, there are trade-offs. For example, choosing a non-false value for `ArrayMaxDepth` and increasing the range between `FixedArrayMinLength` and `FixedArrayMaxLength` will make your types more exhaustive, but will also slow down the compiler for type checking, autocomplete, etc.

## Support

If you find ABIType useful, please consider supporting development. Thank you 🙏

- [GitHub Sponsors](https://github.com/sponsors/wagmi-dev?metadata_campaign=gh_readme_support)
- [Gitcoin Grant](https://gitcoin.co/grants/4493/wagmi-react-hooks-library-for-ethereum)
- [wagmi-dev.eth](https://etherscan.io/enslookup-search?search=wagmi-dev.eth)

## Contributing

If you're interested in contributing, please read the [contributing docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Authors

- awkweb.eth ([@awkweb](https://twitter.com/awkweb)) – [Mirror](https://mirror.xyz)

## License

[WAGMIT](/LICENSE) License
