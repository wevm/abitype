# ABIType

[![npm](https://img.shields.io/npm/v/abitype.svg?colorA=21262d&colorB=161b22&style=flat)](https://www.npmjs.com/package/abitype)
[![Downloads per month](https://img.shields.io/npm/dm/abitype?colorA=21262d&colorB=161b22&style=flat)](https://www.npmjs.com/package/abitype)

Strict TypeScript types for Ethereum ABIs. It provides utilities and type checking for ABI properties and values, covering the entire [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html).

```ts
import { ExtractAbiFunctions } from 'abitype'

const erc721Abi = [...] as const

type Functions = ExtractAbiFunctions<typeof erc721Abi, 'view'>
```

## Installation

```bash
npm install abitype
```

## Usage

Since ABIs can contain deeply nested arrays, objects, and other types, you must assert ABIs to constants using [`const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions). This allows TypeScript to take the most specific types for expressions and avoid type widening (e.g. no going from "hello" to string).

```ts
const erc721Abi = [...] as const
```

```ts
const erc721Abi = <const>[...]
```

## Utilities

### AbiParameterToPrimitiveType

Converts `AbiParameter` to corresponding TypeScript primitive type.

```ts
import { AbiParameterToPrimitiveType } from 'abitype'

type Result = AbiParameterToPrimitiveType<{
  internalType: 'address'
  name: 'owner'
  type: 'address'
}>
```

### AbiParametersToPrimitiveTypes

Converts array of `AbiParameter` to corresponding TypeScript primitive type.

```ts
import { AbiParametersToPrimitiveTypes } from 'abitype'

type Result = AbiParametersToPrimitiveTypes<
  [
    {
      internalType: 'address'
      name: 'to'
      type: 'address'
    },
    {
      internalType: 'uint256'
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
> Does not include full array or tuple conversion. Use `AbiParameterToPrimitiveType` to fully convert arrays and tuples.

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

### ExtractAbiErrorParameters

Extracts `AbiParameter` types for error name from `Abi`

```ts
import { ExtractAbiErrorParameters } from 'abitype'

type Result = ExtractAbiErrorParameters<typeof erc721Abi, 'SomeError'>
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

### ExtractAbiEventParameters

Extracts `AbiParameter` types for event name from `Abi`

```ts
import { ExtractAbiEventParameters } from 'abitype'

type Result = ExtractAbiEventParameters<typeof erc721Abi, 'Transfer'>
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

### ExtractAbiFunctionParameters

Extracts `AbiParameter` types for function name from `Abi`

```ts
import { ExtractAbiFunctionParameters } from 'abitype'

type Result = ExtractAbiFunctionParameters<
  typeof erc721Abi,
  'balanceOf',
  'inputs'
>
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

## Support

If you find abitype useful, please consider supporting development. Thank you 🙏

- [GitHub Sponsors](https://github.com/sponsors/wagmi-dev?metadata_campaign=gh_readme_support)
- [Gitcoin Grant](https://gitcoin.co/grants/4493/wagmi-react-hooks-library-for-ethereum)
- [wagmi-dev.eth](https://etherscan.io/enslookup-search?search=wagmi-dev.eth)

## Contributing

If you're interested in contributing, please read the [contributing docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Authors

- awkweb.eth ([@awkweb](https://twitter.com/awkweb)) – [Mirror](https://mirror.xyz)

## Thanks

- indreams.eth ([@strollinghome](https://twitter.com/strollinghome)) for answering Solidity questions!

## License

[WAGMIT](/LICENSE) License
