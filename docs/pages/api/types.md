---
description: 'Types covering the Contract ABI and EIP-712 Typed Data Specifications.'
---

# Types

Types covering the [Contract ABI](https://docs.soliditylang.org/en/latest/abi-spec.html#json) and [EIP-712 Typed Data](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Specifications.

## `Abi`

Type matching the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

```ts twoslash noplayground
import type * as a from 'abitype'
type Abi = a.abi
```

## `AbiConstructor`

ABI [Constructor](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiConstructor = a.abi.constructors.item
```

## `AbiError`

ABI [Error](https://docs.soliditylang.org/en/latest/abi-spec.html#errors) type

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiError = a.abi.errors.item
```

## `AbiEvent`

ABI [Event](https://docs.soliditylang.org/en/latest/abi-spec.html#events) type

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiEvent = a.abi.events.item
```

## `AbiFallback`

ABI [Fallback](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiFallback = a.abi.fallback.item
```

## `AbiFunction`

ABI [Function](https://docs.soliditylang.org/en/latest/abi-spec.html#json) type

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiFunction = a.abi.functions.item
```

## `AbiInternalType`

Representation used by Solidity compiler (e.g. `'string'`, `'int256'`, `'struct Foo'`)

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiInternalType = a.abi.types.internal
```

## `AbiItemType`

`"type"` name for [`Abi`](#abi) items (e.g. `'type': 'function'` for [`AbiFunction`](#abifunction))

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiItemType = a.abi.itemType
```

## `AbiParameter`

`inputs` and `outputs` item for ABI functions, errors, and constructors

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiParameter = a.abi.parameter.item
```

## `AbiEventParameter`

`inputs` for ABI events

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiEventParameter = a.abi.parameter.event
```

## `AbiParameterKind`

Kind of ABI parameter: `'inputs' | 'outputs'`

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiParameterKind = a.abi.parameter.kind
```

## `AbiReceive`

ABI [Receive](https://docs.soliditylang.org/en/latest/contracts.html#receive-ether-function) type

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiReceive = a.abi.receive.item
```

## `AbiStateMutability`

ABI Function behavior

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiStateMutability = a.abi.stateMutability
```

## `AbiType`

ABI canonical [types](https://docs.soliditylang.org/en/latest/abi-spec.html#json)

```ts twoslash noplayground
import type * as a from 'abitype'
type AbiType = a.abi.types.item
```

## Solidity types

[Solidity types](https://docs.soliditylang.org/en/latest/abi-spec.html#types) as template strings

```ts twoslash noplayground
import type * as a from 'abitype'

type SolidityAddress = a.abi.types.address
type SolidityArray = a.abi.types.array
type SolidityBool = a.abi.types.bool
type SolidityBytes = a.abi.types.bytes
type SolidityFunction = a.abi.types.function
type SolidityInt = a.abi.types.int
type SolidityString = a.abi.types.string
type SolidityTuple = a.abi.types.tuple
```

## `TypedData`

[EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) Typed Data Specification

```ts twoslash noplayground
import type * as a from 'abitype'
type TypedData = a.typedData.root
```

## `TypedDataDomain`

[EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator) Domain

```ts twoslash noplayground
import type * as a from 'abitype'
type TypedDataDomain = a.typedData.domain
```

## `TypedDataParameter`

Entry in `TypedData` type items

```ts twoslash noplayground
import type * as a from 'abitype'
type TypedDataParameter = a.typedData.field
```

## `TypedDataType`

Subset of `AbiType` that excludes `tuple` and `function`

```ts twoslash noplayground
import type * as a from 'abitype'
type TypedDataType = a.typedData.fieldType
```
