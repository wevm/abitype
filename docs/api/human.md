# Human-Readable ABI

Human-Readable ABIs compress [JSON ABIs](https://docs.soliditylang.org/en/latest/abi-spec.html#json) into signatures that are nicer to read and less verbose to write. For example:

```ts
const abi = [
  'constructor()',
  'function balanceOf(address owner) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 amount)',
  'error ApprovalCallerNotOwnerNorApproved()',
] as const
```

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

export type {
ParseAbi,
ParseAbiItem,
ParseAbiParameter,
ParseAbiParameters,
} from './human-readable'

## Utilities

export {
parseAbiParameter,
parseAbiParameters,
} from './human-readable'

### `parseAbi`

Parses human-readable ABI into JSON [`Abi`](/api/types#abi).

| Name         | Description                    | Type              |
| ------------ | ------------------------------ | ----------------- |
| `signatures` | Human-Readable ABI.            | `string[]`        |
| returns      | Parsed [`Abi`](/api/types#abi) | `TAbi` (inferred) |

#### Example

[TypeScript Playground]()

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

| Name         | Description              | Type                  |
| ------------ | ------------------------ | --------------------- |
| `signatures` | Human-Readable ABI item. | `string \| string[]`  |
| returns      | Parsed ABI item          | `TAbiItem` (inferred) |

#### Example

[TypeScript Playground]()

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

Parses human-readable ABI parameter into [`AbiParameter`](/api/types#abi-parameter).

| Name         | Description                                       | Type                       |
| ------------ | ------------------------------------------------- | -------------------------- |
| `signatures` | Human-Readable ABI parameter.                     | `string \| string[]`       |
| returns      | Parsed [`AbiParameter`](/api/types#abi-parameter) | `TAbiParameter` (inferred) |

#### Example

[TypeScript Playground]()

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

Parses human-readable ABI parameters into [`AbiParameter`s](/api/types#abi-parameter).

| Name         | Description                                        | Type                         |
| ------------ | -------------------------------------------------- | ---------------------------- |
| `signatures` | Human-Readable ABI parameters.                     | `string \| string[]`         |
| returns      | Parsed [`AbiParameter`s](/api/types#abi-parameter) | `TAbiParameter`[] (inferred) |

#### Example

[TypeScript Playground]()

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
