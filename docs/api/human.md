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

ABIType contains [type-level](/api/human#types) and [runtime](/api/human#utilities) utilities for parsing human-readable ABIs, ABI items, and parameters.

## Signature Types

For the most part, human-readable signatures match their Solidity counterparts and support function, event, error, struct, constructor, fallback, and receive types.

### Functions

Function signatures match the following format:

```ts
function name(inputs) scope mutability returns (outputs)
```

- `name` function name.
- `inputs` function input parameters (optional).
- `scope` function scope (optional). Only supports `"public" | "external"`.
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
- `inputs` event input parameters (optional). Parameters support the `indexed` keyword.

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
constructor(parameters)
```

- `parameters` constructor parameters (optional).

#### Examples

```ts
'constructor()' // empty parameters
'constructor(address conduitController)' // name, parameters
```

### Fallback

Fallback signatures match the following format:

```ts
fallback()
```

#### Examples

```ts
'fallback()' // only fallback
```

### Receive

Receive signatures match the following format:

```ts
receive() external payable
```

#### Examples

```ts
'receive() external payable' // only receive
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

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBQIZQM4FMCCAjYOAXzgDMoIQ4ByVAmATzC2oChXHm4AlLDAVwA28ALwp02fMAA8rOHAD0CuAD0A-HE5YefIaLhQsqACYQAdoIZwA2kjOoQWAFxwARHlSDUZgMZYA8qSuANyaTM5upPy+MMDmIXAYMKgwWACy-MkEgsCMTgB0hXI2xfLUUTFxZnAeXr4BpAAUJsaGGBhwEADuZlhQAJRwAG7AWF0GWDD8UGYdjfzAZjAATACsAGz91AA0pTRYQ1hLcAAqUN4YpH3Nxq18HYvGWAAeWMZkFCDbcC1tD2ZPV7vGAQb4LJZrdY-EAQaIwLa7eQAXVYAD4gA)

```ts
import { ParseAbi } from 'abitype'

type Result = ParseAbi<
  // ^? type Result = readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  [
    'function balanceOf(address owner) view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 amount)',
  ]
>
```

### `ParseAbiItem`

Parses human-readable ABI item (e.g. error, event, function) into ABI item.

| Name         | Description              | Type                  |
| ------------ | ------------------------ | --------------------- |
| `TSignature` | Human-Readable ABI item. | `string[]`            |
| returns      | Parsed ABI item          | `TAbiItem` (inferred) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBQIZQM4FMCCAjYASRixDgF84AzKCMgclQJgE8wt6AoT19uAJSwYArgBt4AXk5w4AellwAegH44vLAKFjJiOADtUILAC44AIjypRqPQGMsAeSpmA3GrYnzVYXZjAIeq5wGDCoJACywqEEosCspmYAbsBYAO6uAHRZ0ijo2PhEJCAAPPTevv56cJbWdo5UABSoACbNUEIYcBCpelhQAJRwyWlw7TDCUHqdDcLAejAATACsAGz99AB83OqaIuJwErmYuATEpMU58kqqO4J7OkgGRglUEBBB6i8+tn4BQSFhLCRaLAWLxczDdJuOZgKIYYxZDI5ADaZW+vyqrwgDQAQqgAF7VdCDSGjLDjSbTEJQOYAc3WABo4PRqcIfnA8YSkNS6fpDFg3OR6ABdTgbIA)

```ts
import { ParseAbiItem } from 'abitype'

type Result =
  // ^? type Result = { name: "balanceOf"; type: "function"; stateMutability: "view";...
  ParseAbiItem<'function balanceOf(address owner) view returns (uint256)'>

type Result = ParseAbiItem<
  // ^? type Result = { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
  ['function foo(Baz bar) view returns (string)', 'struct Baz { string name; }']
>
```

### `ParseAbiParameter`

Parses human-readable ABI parameter into [`AbiParameter`](/api/types#abiparameter).

| Name     | Description                                      | Type                       |
| -------- | ------------------------------------------------ | -------------------------- |
| `TParam` | Human-Readable ABI parameter.                    | `string \| string[]`       |
| returns  | Parsed [`AbiParameter`](/api/types#abiparameter) | `TAbiParameter` (inferred) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBQIZQM4FMCCAjYNKVELGLKOAXzgDMoIQ4ByVAmATzC2YChfO3OACUsGAK4AbeAF4U6bPkLoSZCgB5WAEy1QxGOgxDMAfLwD05uNYB6AfjiCsIsVNmJHXLAC44AIlQdPQwMPwBuOAA7VV8-ekZw6n4nFwlpODkiRQIiVXIodV5rSzh7TyFRNPckJ1iYcTBJLESAY0ZISKxImAxfAG0ar1iMGChgSIBzROjSbwA6BaK4PuYAIVQALzg8dGYAGhYRqHEW+HWtpCPxiajVCKpmAF1eEyA)

```ts
import { ParseAbiParameter } from 'abitype'

type Result = ParseAbiParameter<'address from'>
//   ^? type Result = { type: "address"; name: "from"; }

type Result = ParseAbiParameter<
  // ^? type Result = { type: "tuple"; components: [{ type: "string"; name:...
  ['Baz bar', 'struct Baz { string name; }']
>
```

### `ParseAbiParameters`

Parses human-readable ABI parameters into [`AbiParameter`s](/api/types#abiparameter).

| Name      | Description                                       | Type                         |
| --------- | ------------------------------------------------- | ---------------------------- |
| `TParams` | Human-Readable ABI parameters.                    | `string \| string[]`         |
| returns   | Parsed [`AbiParameter`s](/api/types#abiparameter) | `TAbiParameter[]` (inferred) |

#### Example

[TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgBQIZQM4FMCCAjYNKVELGLTOAXzgDMoIQ4ByVAmATzC2YChfO3OACUsGAK4AbeAF4U6bPkLoSZChgA8rACbaoYjHQYgANHFS79GQzAhnxwAHYwATAFYAbOZARxz5gB8vAD0wXDhAHoA-HCCWCJiUjAAXHAA2khxqQBEFnoG2QDccI6qOfSMRdRmmVxYOXlWGEUAdG38cQkS0nByRIoERKrkmBq84aFw0bF1XUmpGTPcOTDiYJJYVQDGjJCOWM4YC7XLcNkYMFBOAOZVpaTJbS3j6cwAQqgAXnB46MxmzAuUHEW3gH2+SCBNxKqmKVGYAF1eAEgA)

```ts
import { ParseAbiParameters } from 'abitype'

type Result = ParseAbiParameters<'address from, address to, uint256 amount'>
//   ^? type Result: [{ type: "address"; name: "from"; }, { type: "address";...

type Result = ParseAbiParameters<
  // ^? type Result: [{ type: "tuple"; components: [{ type: "string"; name:...
  ['Baz bar', 'struct Baz { string name; }']
>
```

## Utilities

Runtime functions for parsing human-readable ABIs.

::: warning
These functions throw errors for invalid inputs. Make sure you handle errors appropriately.
:::

### `parseAbi`

Parses human-readable ABI into JSON [`Abi`](/api/types#abi).

| Name         | Description                    | Type              |
| ------------ | ------------------------------ | ----------------- |
| `signatures` | Human-Readable ABI.            | `string[]`        |
| returns      | Parsed [`Abi`](/api/types#abi) | `TAbi` (inferred) |

#### Example

```ts
import { parseAbi } from 'abitype'

const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
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

```ts
import { parseAbiItem } from 'abitype'

const abiItem = parseAbiItem(
  //  ^? const abiItem: { name: "balanceOf"; type: "function"; stateMutability: "view";...
  'function balanceOf(address owner) view returns (uint256)',
)

const abiItem = parseAbiItem([
  //  ^? const abiItem: { name: "foo"; type: "function"; stateMutability: "view"; inputs:...
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

```ts
import { parseAbiParameter } from 'abitype'

const abiParameter = parseAbiParameter('address from')
//    ^? const abiParameter: { type: "address"; name: "from"; }

const abiParameter = parseAbiParameter([
  //  ^? const abiParameter: { type: "tuple"; components: [{ type: "string"; name:...
  'Baz bar',
  'struct Baz { string name; }',
])
```

### `parseAbiParameters`

Parses human-readable ABI parameters into [`AbiParameter`s](/api/types#abiparameter).

| Name     | Description                                       | Type                         |
| -------- | ------------------------------------------------- | ---------------------------- |
| `params` | Human-Readable ABI parameters.                    | `string \| string[]`         |
| returns  | Parsed [`AbiParameter`s](/api/types#abiparameter) | `TAbiParameter[]` (inferred) |

#### Example

```ts
import { parseAbiParameters } from 'abitype'

const abiParameters = parseAbiParameters(
  //  ^? const abiParameters: [{ type: "address"; name: "from"; }, { type: "address";...
  'address from, address to, uint256 amount',
)

const abiParameters = parseAbiParameters([
  //  ^? const abiParameters: [{ type: "tuple"; components: [{ type: "string"; name:...
  'Baz bar',
  'struct Baz { string name; }',
])
```
