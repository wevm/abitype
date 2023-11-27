---
description: "Quickly add ABIType to your TypeScript project."
title: 'Getting Started'
---

# Getting Started

This section will help you start using ABIType in your TypeScript project. You can also try ABIType online in a [TypeScript Playground](https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgUQB4ygQwMYwIIBGwAYgK4B2uwE5ANCulroSRVTQHKYgCmAzvRYAFTFl4weUPgBUIQqKGAxgANx7SAnmH5wAvnABmUCCDgByTERhaeZgFChIsRHEnYATAAYWew8dMWVjYA9BJ8MPZ21tpwZJTKnNw6ALwMGDj4RHHs5Fy8fAA80TwQBq5QHt5E9GYqwDwA7mYAfHbBwXCdAHoA-HDFsWwJuUl8cKkARHwaIAQQADYTcAA+cBPkSUurE5jz8xANmJQ8W2sEu0fYPADyBqcTACY82KC7fPcwEDC7AMqkYGB5hoJnYojY4NIsOQ+AZJABJchgUgwTTaMapYSiJISKSyeSKZRqVH8Ap2TrtOC9frgyFHGHwxHI4nouBQHiYB40IFwADaAANPKgACQIcIKcgAc10fPoRAlwHIMAAumS0kxMqx4tRyEUbKVypUWDV0tDYVAWjyzAqkTA+GYVa0gA).

## Install

::: code-group
```bash [pnpm]
pnpm add abitype
```
```bash [bun]
bun add abitype
```
```bash [npm]
npm i abitype
```
```bash [yarn]
yarn add abitype
```
:::

::: info TypeScript Version
ABIType requires `typescript@>=5.0.4`.
:::

## Usage

Since ABIs can contain deeply nested arrays and objects, you must either assert ABIs to constants using [`const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) or use the built-in `narrow` function (works with JavaScript). This allows TypeScript to take the most specific type for expressions and avoid type widening (e.g. no going from `"hello"` to `string`).

```ts
const erc20Abi = [...] as const
const erc20Abi = <const>[...]
```

```ts
import { narrow } from 'abitype'
const erc20Abi = narrow([...])
```

Once your ABIs are set up correctly, you can use the exported [types](/api/types) and [utilities](/api/utilities) to work with them. You can also import already set-up ABIs from the `abitype/abis` entrypoint to get started quickly.

```ts twoslash
import { ExtractAbiFunctionNames } from 'abitype'
import { erc20Abi } from 'abitype/abis'

type Result = ExtractAbiFunctionNames<typeof erc20Abi, 'view'>
//   ^?
```

## What's next?

After setting up your project with ABIType, you are ready to dive in further! Here are some places to start:

- [Learn about the types](/api/types) and [utilities](/api/utilities) available in ABIType.
- Follow along with a [walkthrough](/guide/walkthrough) on building a type-safe `readContract` function.
- Check out comparisons between features in [ABIType and TypeChain](/guide/comparisons#typechain) as well as [ABIType and ethers.js](/guide/comparisons#ethers-js).
- Make reading and writing ABIs more human with [human-readable ABI support](/api/human).
- Checkout our own [playground](https://github.com/wevm/abitype/tree/main/playgrounds/functions/src) full of examples on how to apply it on your projects. Including creating a wrapper for ethers contracts.
