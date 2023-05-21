---
description: 'Type-level and runtime utilities for parsing human-readable ABIs.'
title: 'Human-Readable ABI'
---

# Human-Readable ABI

Human-Readable ABIs compress [JSON ABIs](https://docs.soliditylang.org/en/latest/abi-spec.html#json) into signatures that are nicer to read and less verbose to write. For example:

::: code-group

```ts [human-readable.ts]
const abi = [
  'constructor()',
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
  'error ApprovalCallerNotOwnerNorApproved()',
] as const
```

```ts [abi.ts]
const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
      },
      { name: 'to', type: 'address', indexed: true },
      {
        name: 'tokenId',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  { inputs: [], name: 'ApprovalCallerNotOwnerNorApproved', type: 'error' },
] as const
```

:::

ABIType contains parallel [type-level](/api/human#types) and [runtime](/api/human#utilities) utilities for parsing human-readable ABIs, ABI items, and ABI parameters.

## Signature Types

For the most part, human-readable signatures match their Solidity counterparts and support function, event, error, struct, constructor, fallback, and receive types.

### Functions

Function signatures match the following format:

```ts
function name(inputs) scope mutability returns (outputs)
```

- `name` function name.
- `inputs` function input parameters (optional).
- `scope` function scope (optional). Only supports `'public' | 'external'`.
- `mutability` function state mutability (optional). Supports [`AbiStateMutability`](/api/types#abistatemutability).
- `outputs` function outputs (optional).

#### Examples

```ts
'function mint()' // name
'function withdraw(uint wad)' // name, inputs
'function activate() public' // name, scope
'function deposit() payable' // name, mutability
'function name() returns (string)' // name, outputs
'function tokenURI(uint256 tokenId) pure returns (string)' // name, inputs, mutability, outputs
```

### Events

Event signatures match the following format:

```ts
event name(inputs)
```

- `name` event name.
- `inputs` event input parameters (optional). Parameters support the `indexed` modifier.

#### Examples

```ts
'event Mint()' // name
'event Transfer(bytes32 indexed node, address owner)' // name, inputs
```

### Errors

Error signatures match the following format:

```ts
error name(inputs)
```

- `name` error name.
- `inputs` error input parameters (optional).

#### Examples

```ts
'event CriteriaNotEnabledForItem()' // name
'event InvalidRestrictedOrder(bytes32 orderHash)' // name, inputs
```

### Structs

Struct signatures match the following format:

```ts
struct Name { properties }
```

- `Name` struct name.
- `properties` struct properties (colon-separated).

#### Examples

```ts
'struct AdditionalRecipient { uint256; address; }' // unnamed properties
'struct AdditionalRecipient { uint256 amount; address recipient; }' // named properties
```

### Constructor

Constructor signatures match the following format:

```ts
constructor(parameters) mutability
```

- `parameters` constructor parameters (optional).
- `mutability` constructor state mutability (optional). Supports `'payable'`.

#### Examples

```ts
'constructor()' // empty parameters
'constructor(address conduitController)' // name, parameters
'constructor(address conduitController) payable' // name, parameters, mutability
```

### Fallback

Fallback signatures match the following format:

```ts
fallback() scope mutability
```

#### Examples

```ts
'fallback() external' // scope
'fallback() external payable' // scope, mutability
```

- `scope` fallback scope. Supports `'external'`.
- `mutability` fallback state mutability (optional). Supports `'payable'`.

### Receive

Receive signatures match the following format:

```ts
receive() external payable
```

#### Examples

```ts
'receive() external payable'
```

## Syntax Rules

Some additional rules that apply to human-readable ABIs:

- **Whitespace matters.** This allows us to infer TypeScript types at the type-level and make sure signatures are valid. For example, `'function name() returns (string)'` is valid, but `'function name()returns(string)'` is not.
- **No semi-colons.** This is a stylistic choice to make signatures more readable.
- **No recursive structs.** Structs can reference other structs, but not themselves or other structs in a circular way. For example, `['struct A { B; }', 'struct B { string; }']` is valid, but `'struct A { A; }'` and `['struct A { B; }', 'struct B { A; }']` are not valid.
- **Modifier keywords.** Modifier keywords like `'calldata'`, `'memory'`, and `'storage'` are ignored when parsing signatures. For example, `'function name(string calldata)'` is valid and `'calldata'` will be ignored when parsing the signature.
- **Inline tuples.** Inline tuples are supported for function inputs and outputs, error, event, and constructor inputs, and struct properties. For example, `'(uint256, string)'` is valid and corresponds to the following JSON ABI parameter: `{ type: 'tuple', components: [{ type: 'uint256' }, { type: 'string' }] }`. You can also nest inline tuples inside inline tuples.
- **Named and unnamed parameters**. Named and unnamed parameters/properties are both supported. For example, `'string foo'` is named and `'string'` is unnamed.

## Types

Types for parsing human-readable ABIs.

### `ParseAbi`

Parses human-readable ABI into JSON [`Abi`](/api/types#abi).

| Name          | Description                    | Type              |
| ------------- | ------------------------------ | ----------------- |
| `TSignatures` | Human-Readable ABI.            | `string[]`        |
| returns       | Parsed [`Abi`](/api/types#abi) | `TAbi` (inferred) |

#### Example

```ts twoslash
import { ParseAbi } from 'abitype'

type Result = ParseAbi<[
  // ^? 
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
]>
```

### `ParseAbiItem`

Parses human-readable ABI item (e.g. error, event, function) into ABI item.

| Name         | Description              | Type                  |
| ------------ | ------------------------ | --------------------- |
| `TSignature` | Human-Readable ABI item. | `string[]`            |
| returns      | Parsed ABI item          | `TAbiItem` (inferred) |

#### Example

```ts twoslash
import { ParseAbiItem } from 'abitype'

type Result = ParseAbiItem<
  // ^? 
  'function balanceOf(address owner) view returns (uint256)'
>


type ResultStruct = ParseAbiItem<[
  // ^? 
  'function foo(Baz bar) view returns (string)',
  'struct Baz { string name; }',
]>
```

### `ParseAbiParameter`

Parses human-readable ABI parameter into [`AbiParameter`](/api/types#abiparameter).

| Name     | Description                                      | Type                       |
| -------- | ------------------------------------------------ | -------------------------- |
| `TParam` | Human-Readable ABI parameter.                    | `string \| string[]`       |
| returns  | Parsed [`AbiParameter`](/api/types#abiparameter) | `TAbiParameter` (inferred) |

#### Example

```ts twoslash
import { ParseAbiParameter } from 'abitype'

type Result = ParseAbiParameter<'address from'>
//   ^? 

type ResultStruct = ParseAbiParameter<[
  // ^? 
  'Baz bar',
  'struct Baz { string name; }',
]>
```

### `ParseAbiParameters`

Parses human-readable ABI parameters into [`AbiParameter`s](/api/types#abiparameter).

| Name      | Description                                       | Type                         |
| --------- | ------------------------------------------------- | ---------------------------- |
| `TParams` | Human-Readable ABI parameters.                    | `string \| string[]`         |
| returns   | Parsed [`AbiParameter`s](/api/types#abiparameter) | `TAbiParameter[]` (inferred) |

#### Example

```ts twoslash
import { ParseAbiParameters } from 'abitype'

type Result = ParseAbiParameters<'address from, address to, uint256 amount'>
//   ^? 

type ResultStruct = ParseAbiParameters<[
  // ^? 
  'Baz bar',
  'struct Baz { string name; }',
]>
```

## Utilities

Runtime functions for parsing human-readable ABIs.

::: warning
These functions throw [errors](#errors-1) for invalid inputs. Make sure you handle errors appropriately.
:::

### `parseAbi`

Parses human-readable ABI into JSON [`Abi`](/api/types#abi).

| Name         | Description                    | Type              |
| ------------ | ------------------------------ | ----------------- |
| `signatures` | Human-Readable ABI.            | `string[]`        |
| returns      | Parsed [`Abi`](/api/types#abi) | `TAbi` (inferred) |

#### Example

```ts twoslash
import { parseAbi } from 'abitype'

const abi = parseAbi([
  //  ^? 
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
```

### `parseAbiItem`

Parses human-readable ABI item (e.g. error, event, function) into ABI item.

| Name        | Description              | Type                  |
| ----------- | ------------------------ | --------------------- |
| `signature` | Human-Readable ABI item. | `string \| string[]`  |
| returns     | Parsed ABI item          | `TAbiItem` (inferred) |

#### Example

```ts twoslash
import { parseAbiItem } from 'abitype'

const abiItem = parseAbiItem(
  //  ^? 
  'function balanceOf(address owner) view returns (uint256)',
)

const abiItemStruct = parseAbiItem([
  //  ^? 
  'function foo(Baz bar) view returns (string)',
  'struct Baz { string name; }',
])
```

### `parseAbiParameter`

Parses human-readable ABI parameter into [`AbiParameter`](/api/types#abiparameter).

| Name    | Description                                      | Type                       |
| ------- | ------------------------------------------------ | -------------------------- |
| `param` | Human-Readable ABI parameter.                    | `string \| string[]`       |
| returns | Parsed [`AbiParameter`](/api/types#abiparameter) | `TAbiParameter` (inferred) |

#### Example

```ts twoslash
import { parseAbiParameter } from 'abitype'

const abiParameter = parseAbiParameter('address from')
//    ^? 

const abiParameterStruct = parseAbiParameter([
  //  ^? 
  'Baz bar',
  'struct Baz { string name; }',
])
```

::: info PARAMETER VALIDATION
When passing a string array as an argument typescript will verify if the parameter strings are valid to safeguard you from the runtime behavior. When strict is disabled the type-checking will be more lax. If you enable strict it will check if the Solidity types are valid.
:::

### `parseAbiParameters`

Parses human-readable ABI parameters into [`AbiParameter`s](/api/types#abiparameter).

| Name     | Description                                       | Type                         |
| -------- | ------------------------------------------------- | ---------------------------- |
| `params` | Human-Readable ABI parameters.                    | `string \| string[]`         |
| returns  | Parsed [`AbiParameter`s](/api/types#abiparameter) | `TAbiParameter[]` (inferred) |

#### Example

```ts twoslash
import { parseAbiParameters } from 'abitype'

const abiParameters = parseAbiParameters(
  //  ^?
  'address from, address to, uint256 amount',
)

const abiParametersStruct = parseAbiParameters([
  //  ^? 
  'Baz bar',
  'struct Baz { string name; }',
])
```

::: info PARAMETER VALIDATION
When passing a string array as an argument typescript will verify if the parameter strings are valid to safeguard you from the runtime behavior. When strict is disabled the type-checking will be more lax. If you enable strict it will check if the Solidity types are valid.
:::

## Errors

```ts twoslash
import {
  CircularReferenceError,
  InvalidParenthesisError,
  UnknownSignatureError,
  InvalidSignatureError,
  InvalidStructSignatureError,
  InvalidAbiParameterError,
  InvalidAbiParametersError,
  InvalidParameterError,
  SolidityProtectedKeywordError,
  InvalidModifierError,
  InvalidFunctionModifierError,
  InvalidAbiTypeParameterError,
  InvalidAbiItemError,
  UnknownTypeError,
} from 'abitype'
```