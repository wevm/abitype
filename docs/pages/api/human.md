# Human-Readable ABI [Type-level and runtime utilities for parsing human-readable ABIs]

Human-Readable ABIs compress [JSON ABIs](https://docs.soliditylang.org/en/latest/abi-spec.html#json) into signatures that are nicer to read and less verbose to write. For example:

:::code-group
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

ABIType contains parallel [type-level](/api/human#types) and [runtime](/api/human#utilities) utilities for parsing and formatting human-readable ABIs, ABI items, and ABI parameters.

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

Types for parsing and formatting human-readable ABIs.

### `ParseAbi`

Parses human-readable ABI into JSON [`Abi`](/api/types#abi).

| Name         | Description                    | Type             |
| ------------ | ------------------------------ | ---------------- |
| `signatures` | Human-Readable ABI.            | `string[]`       |
| returns      | Parsed [`Abi`](/api/types#abi) | `abi` (inferred) |

#### Example

```ts twoslash
import { ParseAbi } from 'abitype'

type Result = ParseAbi<[
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
]>
let result: Result
//  ^? 














```

### `ParseAbiItem`

Parses human-readable ABI item (e.g. error, event, function) into ABI item.

| Name        | Description              | Type                 |
| ----------- | ------------------------ | -------------------- |
| `signature` | Human-Readable ABI item. | `string[]`           |
| returns     | Parsed ABI item          | `abiItem` (inferred) |

#### Example

```ts twoslash
import { ParseAbiItem } from 'abitype'

type Result = ParseAbiItem<
  'function balanceOf(address owner) view returns (uint256)'
>
let result: Result
//  ^? 













type ResultStruct = ParseAbiItem<[
  'function foo(Baz bar) view returns (string)',
  'struct Baz { string name; }',
]>
let resultStruct: ResultStruct
//  ^? 














```

### `ParseAbiParameter`

Parses human-readable ABI parameter into [`AbiParameter`](/api/types#abiparameter).

| Name    | Description                                      | Type                      |
| ------- | ------------------------------------------------ | ------------------------- |
| `param` | Human-Readable ABI parameter.                    | `string \| string[]`      |
| returns | Parsed [`AbiParameter`](/api/types#abiparameter) | `abiParameter` (inferred) |

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

| Name     | Description                                       | Type                        |
| -------- | ------------------------------------------------- | --------------------------- |
| `params` | Human-Readable ABI parameters.                    | `string \| string[]`        |
| returns  | Parsed [`AbiParameter`s](/api/types#abiparameter) | `abiParameter[]` (inferred) |

#### Example

```ts twoslash
import { ParseAbiParameters } from 'abitype'

type Result = ParseAbiParameters<'address from, uint256 amount'>
//   ^? 










type ResultStruct = ParseAbiParameters<[
  // ^? 









  'Baz bar',
  'struct Baz { string name; }',
]>
```

### `FormatAbi`

Formats [`Abi`](/api/types#abi) into human-readable ABI.

| Name    | Description         | Type                    |
| ------- | ------------------- | ----------------------- |
| `abi`   | ABI                 | [`Abi`](/api/types#abi) |
| returns | Human-Readable ABI. | `string[]` (inferred)   |

#### Example

```ts twoslash
import { FormatAbi } from 'abitype'

type Result = FormatAbi<[
//   ^? 



  {
    name: 'balanceOf'
    type: 'function'
    stateMutability: 'view'
    inputs: [{ type: 'address'; name: 'owner' }]
    outputs: [{ type: 'uint256' }]
  },
  {
    name: 'Transfer'
    type: 'event'
    inputs: [
      { type: 'address'; name: 'from'; indexed: true },
      { type: 'address'; name: 'to'; indexed: true },
      { type: 'uint256'; name: 'amount' },
    ]
  },
]>
```

### `FormatAbiItem`

Formats Abi item (e.g. error, event, function) into human-readable ABI parameter.

| Name      | Description              | Type                            |
| --------- | ------------------------ | ------------------------------- |
| `abiItem` | ABI item                 | [`Abi[number]`](/api/types#abi) |
| returns   | Human-Readable ABI item. | `string` (inferred)             |

#### Example

```ts twoslash
import { FormatAbiItem } from 'abitype'

type Result = FormatAbiItem<{
//   ^? 



  name: 'balanceOf'
  type: 'function'
  stateMutability: 'view'
  inputs: [{ type: 'address'; name: 'owner' }]
  outputs: [{ type: 'uint256' }]
}>
```

### `FormatAbiParameter`

Formats [`AbiParameter`](/api/types#abiparameter) into human-readable ABI parameter.

| Name           | Description                    | Type                                      |
| -------------- | ------------------------------ | ----------------------------------------- |
| `abiParameter` | ABI parameter                  | [`AbiParameter`](/api/types#abiparameter) |
| returns        | Human-Readable ABI parameters. | `string[]` (inferred)                     |

#### Example

```ts twoslash
import { FormatAbiParameter } from 'abitype'

type Result = FormatAbiParameter<{ type: 'address'; name: 'from' }>
//   ^? 
```

### `FormatAbiParameters`

Formats [`AbiParameter`s](/api/types#abiparameter) into human-readable ABI parameters.

| Name            | Description                   | Type                                        |
| --------------- | ----------------------------- | ------------------------------------------- |
| `abiParameters` | ABI parameters                | [`AbiParameter[]`](/api/types#abiparameter) |
| returns         | Human-Readable ABI parameter. | `string` (inferred)                         |

#### Example

```ts twoslash
import { FormatAbiParameters } from 'abitype'

type Result = FormatAbiParameters<[
//   ^? 


  { type: 'address'; name: 'from' },
  { type: 'uint256'; name: 'tokenId' },
]>
```

## Utilities

Runtime functions for parsing and formatting human-readable ABIs.

:::warning
These functions throw [errors](#errors-1) for invalid inputs. Make sure you handle errors appropriately.
:::

### `signatureAbiItem`

Formats [`Abi`](/api/types#abi) into the corresponding signature used to create selectors for both [functions](https://docs.soliditylang.org/en/develop/abi-spec.html#function-selector) and [events](https://docs.soliditylang.org/en/develop/abi-spec.html#events).

| Name         | Description   | Type                        |
| ------------ | ------------- | ----------------------------|
| `abiItem`    | ABI item      | `AbiFunction` \| `AbiEvent` |
| returns      | signature     | `string` (inferred)         |

#### Example

```ts twoslash
import { signatureAbiItem } from 'abitype'

const result = signatureAbiItem({
//    ^? 



  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ type: 'address', name: 'owner' }],
  outputs: [{ type: 'uint256' }],
})
```

### `parseAbi`

Parses human-readable ABI into JSON [`Abi`](/api/types#abi).

| Name         | Description                    | Type             |
| ------------ | ------------------------------ | ---------------- |
| `signatures` | Human-Readable ABI.            | `string[]`       |
| returns      | Parsed [`Abi`](/api/types#abi) | `abi` (inferred) |

#### Example

```ts twoslash
import { parseAbi } from 'abitype'

const abi = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
])
abi
//^?













```

### `parseAbiItem`

Parses human-readable ABI item (e.g. error, event, function) into ABI item.

| Name        | Description              | Type                 |
| ----------- | ------------------------ | -------------------- |
| `signature` | Human-Readable ABI item. | `string \| string[]` |
| returns     | Parsed ABI item          | `abiItem` (inferred) |

#### Example

```ts twoslash
import { parseAbiItem } from 'abitype'

const abiItem = parseAbiItem(
  'function balanceOf(address owner) view returns (uint256)',
)
abiItem
// ^? 














const abiItemStruct = parseAbiItem([
  'function foo(Baz bar) view returns (string)',
  'struct Baz { string name; }',
])
abiItemStruct
// ^?














```

### `parseAbiParameter`

Parses human-readable ABI parameter into [`AbiParameter`](/api/types#abiparameter).

| Name    | Description                                      | Type                      |
| ------- | ------------------------------------------------ | ------------------------- |
| `param` | Human-Readable ABI parameter.                    | `string \| string[]`      |
| returns | Parsed [`AbiParameter`](/api/types#abiparameter) | `abiParameter` (inferred) |

#### Example

```ts twoslash
import { parseAbiParameter } from 'abitype'

const abiParameter = parseAbiParameter('address from')
//    ^? 





const abiParameterStruct = parseAbiParameter([
  'Baz bar',
  'struct Baz { string name; }',
])
abiParameterStruct
//  ^? 









```

### `parseAbiParameters`

Parses human-readable ABI parameters into [`AbiParameter`s](/api/types#abiparameter).

| Name     | Description                                       | Type                        |
| -------- | ------------------------------------------------- | --------------------------- |
| `params` | Human-Readable ABI parameters.                    | `string \| string[]`        |
| returns  | Parsed [`AbiParameter`s](/api/types#abiparameter) | `abiParameter[]` (inferred) |

#### Example

```ts twoslash
import { parseAbiParameters } from 'abitype'

const abiParameters = parseAbiParameters(
  'address from, address to, uint256 amount',
)
abiParameters
//  ^?











const abiParametersStruct = parseAbiParameters([
  'Baz bar',
  'struct Baz { string name; }',
])
abiParametersStruct
// ^?









```

### `formatAbi`

Formats [`Abi`](/api/types#abi) into human-readable ABI.

| Name        | Description         | Type                    |
| ----------- | ------------------- | ----------------------- |
| `abi`       | ABI                 | [`Abi`](/api/types#abi) |
| returns     | Human-Readable ABI. | `string[]` (inferred)   |

#### Example

```ts twoslash
import { formatAbi } from 'abitype'

const result = formatAbi([
//    ^? 



  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ type: 'address', name: 'owner' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'Transfer',
    type: 'event',
    inputs: [
      { type: 'address', name: 'from', indexed: true },
      { type: 'address', name: 'to', indexed: true },
      { type: 'uint256', name: 'amount' },
    ],
  },
])
```

### `formatAbiItem`

Formats Abi item (e.g. error, event, function) into human-readable ABI parameter.

| Name            | Description              | Type                            |
| --------------- | ------------------------ | ------------------------------- |
| `abiItem`       | ABI item                 | [`Abi[number]`](/api/types#abi) |
| returns         | Human-Readable ABI item. | `string` (inferred)             |

#### Example

```ts twoslash
import { formatAbiItem } from 'abitype'

const result = formatAbiItem({
//    ^? 



  name: 'balanceOf',
  type: 'function',
  stateMutability: 'view',
  inputs: [{ type: 'address', name: 'owner' }],
  outputs: [{ type: 'uint256' }],
})
```

### `formatAbiParameter`

Formats [`AbiParameter`](/api/types#abiparameter) into human-readable ABI parameter.

| Name           | Description                   | Type                                      |
| -------------- | ----------------------------- | ----------------------------------------- |
| `abiParameter` | ABI parameter                 | [`AbiParameter`](/api/types#abiparameter) |
| returns        | Human-Readable ABI parameter. | `string` (inferred)                       |

#### Example

```ts twoslash
import { formatAbiParameter } from 'abitype'

const result = formatAbiParameter({ type: 'address', name: 'from' })
//    ^? 
```

### `formatAbiParameters`

Formats [`AbiParameter`s](/api/types#abiparameter) into human-readable ABI parameters.

| Name             | Description                   | Type                                        |
| ---------------- | ----------------------------- | ------------------------------------------- |
| `abiParameters`  | ABI parameters                | [`AbiParameter[]`](/api/types#abiparameter) |
| returns          | Human-Readable ABI parameter. | `string` (inferred)                         |

#### Example

```ts twoslash
import { formatAbiParameters } from 'abitype'

const result = formatAbiParameters([
//    ^? 


  { type: 'address', name: 'from' },
  { type: 'uint256', name: 'tokenId' },
])
```


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
