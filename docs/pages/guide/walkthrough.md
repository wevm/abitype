# Walkthrough

Let's use ABIType to create a type-safe function that calls "read" contract methods. We'll infer function names, argument types, and return types from a user-provided ABI, and make sure it works for function overloads.

You can spin up a [TypeScript Playground](https://www.typescriptlang.org/play) to code along.

## 1. Scaffolding `readContract`

First, we start off by declaring[^1] the function `readContract` with some basic types:

```ts twoslash
import { Abi } from 'abitype'

declare function readContract(config: {
  abi: Abi
  functionName: string
  args: readonly unknown[]
}): unknown
```

The function accepts a `config` object which includes the ABI, function name, and arguments. The return type is `unknown` since we don't know what the function will return quite yet.[^2] Next, let's call the function using the following values:

:::code-group

```ts [readContract.ts] twoslash
// @filename: abi.ts
export const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'collectionId', type: 'uint256' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'pure',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
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
// @filename: readContract.ts
import { Abi } from 'abitype'

declare function readContract(config: {
  abi: Abi
  functionName: string
  args: readonly unknown[]
}): unknown
// ---cut---
import { abi } from './abi'

const res = readContract({
  abi,
  functionName: 'balanceOf',
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
})
```

```ts [abi.ts]
export const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'collectionId', type: 'uint256' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'pure',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
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
```

:::

## 2. Adding inference to `functionName`

`functionName` and `args` types aren't inferred from the ABI yet so we can pass any value we want. Let's fix that! Often, you'll want to pull types into [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) when trying to infer parameters. We'll do the same here, starting with `functionName`:

```ts twoslash
// @filename: abi.ts
export const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'collectionId', type: 'uint256' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'pure',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
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

// @filename: readContract.ts
// ---cut---
import { Abi, ExtractAbiFunctionNames } from 'abitype'
import { abi } from './abi'

declare function readContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>(config: {
  abi: TAbi
  functionName: TFunctionName | ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
  args: readonly unknown[]
}): unknown

const res = readContract({
  abi,
  functionName: 'balanceOf',
  // ^?


  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
})
```

First, we create two generics `TAbi` and `TFunctionName`, and constrain their types. `TAbi` is set to the `config.abi` property and the `Abi` type. For `TFunctionName`, we import [`ExtractAbiFunctionNames`](/api/utilities#extractabifunctionnames) and use it to parse out all the read function names (state mutability `'pure' | 'view'`[^3]) from the ABI. Finally, `config.functionName` is set to the user-defined `TFunctionName` and another instance of `ExtractAbiFunctionNames`. This allows us to add the full union (not just the current value) to `functionName`'s scope.[^4]

If you are following along in a TypeScript Playground or editor, you can try various values for `functionName`. `functionName` will autocomplete and only accept `'balanceOf' | 'tokenURI'`. You can also try renaming the function names in `abi` and types will update as well.

```ts twoslash
// @noErrors
// @filename: abi.ts
export const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'collectionId', type: 'uint256' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'pure',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
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

// @filename: readContract.ts
import { Abi, ExtractAbiFunctionNames } from 'abitype'
import { abi } from './abi'

declare function readContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>(config: {
  abi: TAbi
  functionName: TFunctionName | ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
  args: readonly unknown[]
}): unknown

// ---cut---
const res = readContract({
  abi,
  functionName: ' 
//               ^|
})
```

## 3. Adding inference to `args`

With `functionName` complete, we can move on to `args`. This time we don't need to add a generic slot because `args` depends completely on `abi` and `functionName` and doesn't need to infer user input.

```ts twoslash
// @filename: abi.ts
export const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'collectionId', type: 'uint256' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'pure',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
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
// @filename: readContract.ts
// ---cut---
import {
  Abi,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import { abi } from './abi'

declare function readContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
>(config: {
  abi: TAbi
  functionName: TFunctionName | ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
  args: AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>['inputs'],
    'inputs'
  >
}): unknown

const res = readContract({
  abi,
  functionName: 'balanceOf',
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
  // ^?
})

```

Since `args`'s type can be completely defined inline, we import [`ExtractAbiFunction`](/api/utilities#extractabifunction) and [`AbiParametersToPrimitiveTypes`](/api/utilities#abiparameterstoprimitivetypes) and wire them up. First, we use `ExtractAbiFunction` to get the function from the ABI that matches `TFunctionName`. Then, we use `AbiParametersToPrimitiveTypes` to convert the function's inputs to their TypeScript primitive types.

For `abi`, you'll notice there are two `'balanceOf'` functions. This means `'balanceOf'` is overloaded on the contract. The cool thing about TypeScript is that we can still infer the correct types for overloaded functions (e.g. union like `` readonly [`0x${string}`] | readonly [`0x${string}`, bigint] ``)! This uses a TypeScript feature called [distributivity](https://jser.dev/typescript/2023/01/22/distributiveness-in-ts.html) and is worth learning more about if you're interested.

## 4. Adding the return type

Finally, we can add the return type:

```ts twoslash
// @filename: abi.ts
export const abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'collectionId', type: 'uint256' },
    ],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
  {
    name: 'tokenURI',
    type: 'function',
    stateMutability: 'pure',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: 'uri', type: 'string' }],
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
// @filename: readContract.ts
// ---cut---
import {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from 'abitype'
import { abi } from './abi'

declare function readContract<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>,
  TAbiFunction extends AbiFunction = ExtractAbiFunction<
    TAbi,
    TFunctionName
  >,
>(config: {
  abi: TAbi
  functionName: TFunctionName | ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>
  args: AbiParametersToPrimitiveTypes<TAbiFunction['inputs'], 'inputs'>
}): AbiParametersToPrimitiveTypes<TAbiFunction['outputs'], 'outputs'>

const res = readContract({
  //  ^?

  
  abi,
  functionName: 'balanceOf',
  args: ['0xA0Cf798816D4b9b9866b5330EEa46a18382f251e'],
})
```

We can refactor our `ExtractAbiFunction` call into a generic slot `TAbiFunction` (of type [`AbiFunction`](/api/types#abifunction)) and set the default to the result of `ExtractAbiFunction`. This allows us to use `TAbiFunction` in for `args` and the return type. Lastly, we wire up another `AbiParametersToPrimitiveTypes` call for the return type—this time using outputs.

## 5. Wrapping up

`readContract`'s types are starting to look solid! It infers the correct types for `functionName` and `args` based on the ABI (and works with overloaded functions). It also infers the correct return type based on the ABI and `functionName`. The only thing left is to implement the function itself.

There are a few other ways to improve the typing that are out of scope for this walkthrough, but are worth noting:

- `abi` requires a const assertion to ensure TypeScript takes the most specific type, but you can set things up so this is unnecessary for inline `abi` definitions.
- `args` can be an empty array if the function doesn't take any arguments, but you could conditionally add `args` to `config` if it's not empty.
- `readContract`'s return type is an array, but you could unwrap it if the function only has one output or transform it to another type depending on your implementation.

The preceding points are all implemented in throughout the [examples](https://github.com/wevm/abitype/tree/main/examples) in this directory so check them out if you're interested.

[^1]: We use the `declare` keyword so we don't need to worry about the implementation. In this case, the implementation would look something like encoding arguments and sending with the [`eth_call`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_call) RPC method.
[^2]: If this was a real function that read via RPC, we'd likely want to make it `async` and return a `Promise`, but we'll leave that out for simplicity.
[^3]: We could add or change this to `'nonpayable' | 'payable'` to allow write functions.
[^4]: Try removing `| ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>` from `functionName`, hover over `functionName` in your editor, and see what happens. You'll notice that the only `functionName` that shows up in the current value.
