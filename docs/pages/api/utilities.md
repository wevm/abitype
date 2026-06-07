---
description: 'Utility types for working with ABIs and EIP-712 Typed Data.'
---


# Utilities

Utility types for working with ABIs and EIP-712 Typed Data.

## `AbiParameterToPrimitiveType`

Converts `AbiParameter` to corresponding TypeScript primitive type.

| Name                | Description                                        | Type                          |
| ------------------- | -------------------------------------------------- | ----------------------------- |
| `abiParameter`      | Parameter to convert to TypeScript representation. | `AbiParameter`                |
| `abiParameterKind`  | Kind to narrow by parameter type.                  | `AbiParameterKind` (optional) |
| returns             | TypeScript primitive type.                         | `type`  (inferred)            |

#### Example

```ts twoslash
import type * as a from 'abitype'

type Result = a.abi.parameter.infer<{
  // ^?

  
  name: 'owner'
  type: 'address'
}>
```

## `AbiParametersToPrimitiveTypes`

Converts array of `AbiParameter` to corresponding TypeScript primitive types.

| Name                | Description                                          | Type                          |
| ------------------- | ---------------------------------------------------- | ----------------------------- |
| `abiParameters`     | Parameters to convert to TypeScript representations. | `readonly AbiParameter[]`     |
| `abiParameterKind`  | Kind to narrow by parameter type.                    | `AbiParameterKind` (optional) |
| returns             | TypeScript primitive types.                          | `type[]` (inferred)           |

#### Example

```ts twoslash
import type * as a from 'abitype'

type Result = a.abi.parameters.infer<
  // ^?

  [
    { name: 'to'; type: 'address'; },
    { name: 'tokenId'; type: 'uint256'; },
  ]
>
```

## `AbiTypeToPrimitiveType`

Converts `AbiType` to corresponding TypeScript primitive type.

| Name                | Description                                       | Type                          |
| ------------------- | ------------------------------------------------- | ----------------------------- |
| `abiType`           | ABI type to convert to TypeScript representation. | `AbiType`                     |
| `abiParameterKind`  | Kind to narrow by parameter type.                 | `AbiParameterKind` (optional) |
| returns             | TypeScript primitive type.                        | `type` (inferred)             |

:::info[NOTE]
Does not include full array or tuple conversion. Use [`AbiParameterToPrimitiveType`](#abiparametertoprimitivetype) to fully convert array and tuple types.
:::

#### Example

```ts twoslash
import type * as a from 'abitype'

type Result = a.abi.types.infer<'address'>
//   ^?

```

## `ExtractAbiError`

Extracts `AbiError` with name from `Abi`.

| Name         | Description    | Type                |
| ------------ | -------------- | ------------------- |
| `abi`        | ABI.           | `Abi`               |
| `errorName`  | Name of error. | `string` (inferred) |
| returns      | ABI Error.     | `AbiError`          |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  { name: 'BarError', type: 'error', inputs: [] },
  { name: 'FooError', type: 'error', inputs: [] },
] as const

type Result = a.abi.errors.extract<typeof abi, 'FooError'>
  //   ^?





```

## `ExtractAbiErrorNames`

Extracts all `AbiError` names from `Abi`.

| Name    | Description      | Type                |
| ------- | ---------------- | ------------------- |
| `abi`   | ABI.             | `Abi`               |
| returns | ABI Error names. | `string` (inferred) |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  { name: 'FooError', type: 'error', inputs: [] },
  { name: 'BarError', type: 'error', inputs: [] },
] as const

type Result = a.abi.errors.names<typeof abi>
//   ^?

```

## `ExtractAbiErrors`

Extracts all `AbiError` types from `Abi`.

| Name    | Description | Type               |
| ------- | ----------- | ------------------ |
| `abi`   | ABI.        | `Abi`              |
| returns | ABI Errors. | `AbiError` (union) |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  { name: 'FooError', type: 'error', inputs: [] },
  { name: 'BarError', type: 'error', inputs: [] },
] as const

type Result = a.abi.errors.items<typeof abi>
//   ^?









```

## `ExtractAbiEvent`

Extracts `AbiEvent` with name from `Abi`.

| Name         | Description    | Type                |
| ------------ | -------------- | ------------------- |
| `abi`        | ABI.           | `Abi`               |
| `eventName`  | Name of event. | `string` (inferred) |
| returns      | ABI Event.     | `AbiEvent`          |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  {
    name: 'Approval',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'approved', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
  {
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const

type Result = a.abi.events.extract<typeof abi, 'Transfer'>
//   ^?















```

## `ExtractAbiEventNames`

Extracts all `AbiEvent` names from `Abi`.

| Name    | Description      | Type                |
| ------- | ---------------- | ------------------- |
| `abi`   | ABI.             | `Abi`               |
| returns | ABI Error names. | `string` (inferred) |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  {
    name: 'Approval',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'approved', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
  {
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const

type Result = a.abi.events.names<typeof abi>
//   ^?

```

## `ExtractAbiEvents`

Extracts all `AbiEvent` types from `Abi`.

| Name    | Description | Type               |
| ------- | ----------- | ------------------ |
| `abi`   | ABI.        | `Abi`              |
| returns | ABI Events. | `AbiEvent` (union) |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  {
    name: 'Approval',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'approved', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
  {
    name: 'Transfer',
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
    ],
  },
] as const

type Result = a.abi.events.items<typeof abi>
//   ^?













```

## `ExtractAbiFunction`

Extracts `AbiFunction` with name from `Abi`.

| Name                  | Description           | Type                            |
| --------------------- | --------------------- | ------------------------------- |
| `abi`                 | ABI.                  | `Abi`                           |
| `functionName`        | Name of function.     | `string` (inferred)             |
| `abiStateMutability`  | ABI state mutability. | `AbiStateMutability` (optional) |
| returns               | ABI Function.         | `AbiFunction`                   |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

type Result = a.abi.functions.extract<typeof abi, 'balanceOf'>
//   ^?












```

## `ExtractAbiFunctionNames`

Extracts all `AbiFunction` names from `Abi`.

| Name                  | Description           | Type                            |
| --------------------- | --------------------- | ------------------------------- |
| `abi`                 | ABI.                  | `Abi`                           |
| `abiStateMutability`  | ABI state mutability. | `AbiStateMutability` (optional) |
| returns               | ABI Event names.      | `string` (inferred)             |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

type Result = a.abi.functions.names<typeof abi>
//   ^?

```

## `ExtractAbiFunctions`

Extracts all `AbiFunction` types from `Abi`.

| Name    | Description    | Type                  |
| ------- | -------------- | --------------------- |
| `abi`   | ABI.           | `Abi`                 |
| returns | ABI Functions. | `AbiFunction` (union) |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

type Result = a.abi.functions.items<typeof abi>
//   ^?














```

By default, extracts all functions, but you can also filter by `AbiStateMutability`:

```ts
type Result = a.abi.functions.items<typeof erc721Abi, 'view'>
```

## `IsAbi`

Checks if type is `Abi`.

| Name    | Description                                           | Type      |
| ------- | ----------------------------------------------------- | --------- |
| `abi`   | ABI.                                                  | `Abi`     |
| returns | Boolean value. `true` if valid `Abi`, `false` if not. | `boolean` |

#### Example

```ts twoslash
import type * as a from 'abitype'

const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'safeTransferFrom',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

type Result = a.abi.valid<typeof abi>
//   ^?

```

## `IsTypedData`

Checks if type is `TypedData`.

| Name         | Description                                                 | Type        |
| ------------ | ----------------------------------------------------------- | ----------- |
| `typedData`  | EIP-712 Typed Data schema.                                  | `TypedData` |
| returns      | Boolean value. `true` if valid `TypedData`, `false` if not. | `boolean`   |

#### Example

```ts twoslash
import type * as a from 'abitype'

const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
} as const

type Result = a.typedData.valid<typeof types>
//   ^?

```

## `TypedDataToPrimitiveTypes`

Converts [EIP-712](https://eips.ethereum.org/EIPS/eip-712#definition-of-typed-structured-data-%F0%9D%95%8A) `TypedData` to corresponding TypeScript primitive type.

| Name         | Description                          | Type                                   |
| ------------ | ------------------------------------ | -------------------------------------- |
| `typedData`  | EIP-712 Typed Data schema.           | `TypedData`                            |
| returns      | TypeScript representation of schema. | `{ [name: string]: type }` (inferred)  |

#### Example

```ts twoslash
import type * as a from 'abitype'

const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
} as const

type Result = a.typedData.infer<typeof types>
//   ^?














```
