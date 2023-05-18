---
description: 'Types covering the Contract ABI and EIP-712 Typed Data Specifications.'
title: 'Types'
---

# Types

Types covering the [Contract ABI](https://docs.soliditylang.org/en/latest/abi-spec.html#json) and [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Specifications.

## `Abi`

Type matching the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

```ts twoslash noplayground
import { Abi } from 'abitype'
```

## `AbiConstructor`

ABI [Constructor](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

```ts twoslash noplayground
import { AbiConstructor } from 'abitype'
```

## `AbiError`

ABI [Error](https://docs.soliditylang.org/en/latest/abi-spec.html#errors) type

```ts twoslash noplayground
import { AbiError } from 'abitype'
```

## `AbiEvent`

ABI [Event](https://docs.soliditylang.org/en/latest/abi-spec.html#events) type

```ts twoslash noplayground
import { AbiEvent } from 'abitype'
```

## `AbiFallback`

ABI [Fallback](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

```ts twoslash noplayground
import { AbiFallback } from 'abitype'
```

## `AbiFunction`

ABI [Function](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

```ts twoslash noplayground
import { AbiFunction } from 'abitype'
```

## `AbiInternalType`

Representation used by Solidity compiler (e.g. `'string'`, `'int256'`, `'struct Foo'`)

```ts twoslash noplayground
import { AbiInternalType } from 'abitype'
```

## `AbiItemType`

`"type"` name for [`Abi`](#abi) items (e.g. `'type': 'function'` for [`AbiFunction`](#abifunction))

```ts twoslash noplayground
import { AbiInternalType } from 'abitype'
```

## `AbiParameter`

`inputs` and `ouputs` item for ABI functions, errors, and constructors

```ts twoslash noplayground
import { AbiParameter } from 'abitype'
```

## `AbiEventParameter`

`inputs` for ABI events

```ts twoslash noplayground
import { AbiEventParameter } from 'abitype'
```

## `AbiParameterKind`

Kind of ABI parameter: `'inputs' | 'outputs'`

```ts twoslash noplayground
import { AbiParameterKind } from 'abitype'
```

## `AbiReceive`

ABI [Receive](https://docs.soliditylang.org/en/latest/contracts.html#receive-ether-function) type

```ts twoslash noplayground
import { AbiReceive } from 'abitype'
```

## `AbiStateMutability`

ABI Function behavior

```ts twoslash noplayground
import { AbiStateMutability } from 'abitype'
```

## `AbiType`

ABI canonical [types](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

```ts twoslash noplayground
import { AbiType } from 'abitype'
```

## Solidity types

[Solidity types](https://docs.soliditylang.org/en/latest/abi-spec.html#types) as template strings

```ts twoslash noplayground
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

## `TypedData`

[EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Typed Data Specification

```ts twoslash noplayground
import { TypedData } from 'abitype'
```

## `TypedDataDomain`

[EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator) Domain

```ts twoslash noplayground
import { TypedDataDomain } from 'abitype'
```

## `TypedDataParameter`

Entry in `TypedData` type items

```ts twoslash noplayground
import { TypedDataParameter } from 'abitype'
```

## `TypedDataType`

Subset of `AbiType` that excludes `tuple` and `function`

```ts twoslash noplayground
import { TypedDataType } from 'abitype'
```
