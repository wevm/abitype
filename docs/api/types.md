---
description: 'Types covering the Contract ABI and EIP-712 Typed Data Specifications.'
title: 'Types'
---

# Types

Types covering the [Contract ABI](https://docs.soliditylang.org/en/latest/abi-spec.html#json) and [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Specifications.

## `Abi`

Type matching the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

```ts
import { Abi } from 'abitype'
```

## `AbiError`

ABI [Error](https://docs.soliditylang.org/en/latest/abi-spec.html#errors) type

```ts
import { AbiError } from 'abitype'
```

## `AbiEvent`

ABI [Event](https://docs.soliditylang.org/en/latest/abi-spec.html#events) type

```ts
import { AbiEvent } from 'abitype'
```

## `AbiFunction`

ABI [Function](https://docs.soliditylang.org/en/latest/abi-spec.html#argument-encoding) type

```ts
import { AbiFunction } from 'abitype'
```

## `AbiInternalType`

Representation used by Solidity compiler (e.g. `'string'`, `'int256'`, `'struct Foo'`)

```ts
import { AbiInternalType } from 'abitype'
```

## `AbiParameter`

`inputs` and `ouputs` item for ABI functions, events, and errors

```ts
import { AbiParameter } from 'abitype'
```

## `AbiParameterKind`

Kind of ABI parameter: `'inputs' | 'outputs'`

```ts
import { AbiParameterKind } from 'abitype'
```

## `AbiStateMutability`

ABI Function behavior

```ts
import { AbiStateMutability } from 'abitype'
```

## `AbiType`

ABI canonical [types](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

```ts
import { AbiType } from 'abitype'
```

## Solidity types

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

## `TypedData`

[EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Typed Data Specification

```ts
import { TypedData } from 'abitype'
```

## `TypedDataDomain`

[EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator) Domain

```ts
import { TypedDataDomain } from 'abitype'
```

## `TypedDataParameter`

Entry in `TypedData` type items

```ts
import { TypedDataParameter } from 'abitype'
```

## `TypedDataType`

Subset of `AbiType` that excludes `tuple` and `function`

```ts
import { TypedDataType } from 'abitype'
```
