---
description: "Type-level and runtime utilities for parsing bytecode into ABIs."
title: "Bytecode To ABI"
---

# Parsing Bytecode

Sometimes working when working with smart contracts we won't have access to the smart contracts ABIs. This is where smart contract dissasemblers come into to play.

::: warning
This is not a full dissasembler because we also infer this at the Type-level and we are limited to what we can do within the Type-level.

For a full dissasembler you can look at [heimdall-rs](https://github.com/Jon-Becker/heimdall-rs) and [whatsabi](https://github.com/shazow/whatsabi)
:::

Our approach is to have something that is 1 to 1 from what you get at the Type-level and runtime. So we take a optimistic approach into to search well know patterns for finding `function`, `event` and `error` selectors.

```ts twoslash
import { parseBytecode } from "abitype";
import { wethBytecode } from "abitype/test";

const parsedBytecode = parseBytecode(wethBytecode);
//      ^?
```

As you can see above typescript will infer the selectors it can find. We can extend the config through declaration merging to resolve those selectors in typescript.

```ts twoslash
declare module "abitype" {
  export interface Selectors extends EventSelectors {}
}

import { parseBytecode, Selectors, EventSelectors } from "abitype";
import { wethBytecode } from "abitype/test";

const parsedBytecode = parseBytecode(wethBytecode);
//      ^?
```

By extending the Selectors interface typescript will be able to then infer the correct strong typed ABI spec. This also means that at the runtime level we don't do any 3rd party api calls to resolve the selectors.

::: tip
This follows all the requirements from human-readable ABIs. For more information you can go [here](/api/human). This means that if you pair a selector with a invalid signature it will throw an [Error](/api/human#errors-1) at runtime.
:::

To make sure that in runtime you will get the same values you can pass a optional argument into `parseBytecode` to make sure that typescript and the runtime are as close to 1 to 1 as possible.

```ts twoslash
declare module "abitype" {
  export interface Selectors extends EventSelectors {}
}

import {
  parseBytecode,
  Selectors,
  EventSelectors,
  resolvedEvents,
} from "abitype";
import { wethBytecode } from "abitype/test";

const parsedBytecode = parseBytecode(wethBytecode, resolvedEvents);
//      ^?
```

::: tip
You can use your own map with the resolved selectors and could also use the ones provided by ABIType so that you can extend the ones that you already have.
:::

## Types

Types for parsing bytecode.

### ParseBytecode

| Name        | Description                    | Type              |
| ----------- | ------------------------------ | ----------------- |
| `TBytecode` | Smart contract bytecode.       | `string`          |
| returns     | Parsed [`Abi`](/api/types#abi) | `TAbi` (inferred) |

### Example

```ts twoslash
import type { ParseBytecode } from "abitype";
import { wethBytecode } from "abitype/test";

type Result = ParseBytecode<typeof wethBytecode>;
//    ^?
```

In case it cannot infer anything from the provided string the resulting type will have an error message. This will also throw at runtime and typescript will let you know beforehand.

```ts twoslash
import type { ParseBytecode } from "abitype";

type Result = ParseBytecode<"invalid">;
//    ^?
```

Bellow are all the exported types, methods and errors that you can use for parsing smart contract bytecode.

```ts twoslash
import type {
  BytecodeSelectors,
  ErrorSelectors,
  EventSelectors,
  FunctionSelectors,
  ParseBytecode,
  Selectors,
  SelectorsByType,
} from "abitype";

import {
  parseBytecode,
  resolvedEvents,
  resolvedErrors,
  resolvedFunctions,
  resolvedSelectors,
} from "abitype";

import { wethBytecode, uniswapBytecode, seaportBytecode } from "abitype/test";
```

## Errors

```ts twoslash
import { InvalidBytecodeError } from "abitype";
```
