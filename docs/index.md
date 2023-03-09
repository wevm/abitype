---
description: 'Utilities and type definitions for ABI properties and values, covering the Contract ABI Specification, as well as EIP-712 Typed Data.'
head:
  - - meta
    - name: keywords
      content: ethereum, abi, typescript, types, eip-712, typed data
title: 'ABIType: Strict TypeScript types for Ethereum ABIs'
titleTemplate: false
---

<p align="center" style="min-height:45px;">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/wagmi-dev/abitype/main/.github/logo-dark.svg">
    <img alt="ABIType" src="https://raw.githubusercontent.com/wagmi-dev/abitype/main/.github/logo-light.svg" width="auto" height="45">
  </picture>
</p>

<div style="margin-top:1rem;display:flex;gap:0.5rem;min-height:28px;max-width:350px;flex-wrap:wrap;margin-right:auto;margin-left:auto;justify-content:center;margin-bottom:3rem;">
  <a href="https://www.npmjs.com/package/abitype">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/abitype?colorA=2e2e33&colorB=2e2e33&style=flat">
      <img src="https://img.shields.io/npm/v/abitype?colorA=fafafa&colorB=fafafa&style=flat" alt="Version">
    </picture>
  </a>
  <a href="https://www.npmjs.com/package/abitype">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/dm/abitype?colorA=2e2e33&colorB=2e2e33&style=flat">
      <img src="https://img.shields.io/npm/dm/abitype?colorA=fafafa&colorB=fafafa&style=flat" alt="Downloads per month">
    </picture>
  </a>
  <a href="https://github.com/wagmi-dev/abitype/blob/main/LICENSE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/l/abitype?colorA=2e2e33&colorB=2e2e33&style=flat">
      <img src="https://img.shields.io/npm/l/abitype?colorA=fafafa&colorB=fafafa&style=flat" alt="MIT License">
    </picture>
  </a>
  <a href="https://github.com/wagmi-dev/abitype">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/stars/wagmi-dev/abitype?colorA=2e2e33&colorB=2e2e33&style=flat">
      <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/wagmi-dev/abitype?colorA=fafafa&colorB=fafafa&style=flat">
    </picture>
  </a>
  <a href="https://bestofjs.org/projects/abitype">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/endpoint?colorA=2e2e33&colorB=2e2e33&style=flat&url=https://bestofjs-serverless.now.sh/api/project-badge?fullName=wagmi-dev%2Fabitype%26since=daily">
      <img src="https://img.shields.io/endpoint?colorA=fafafa&colorB=fafafa&style=flat&url=https://bestofjs-serverless.now.sh/api/project-badge?fullName=wagmi-dev%2Fabitype%26since=daily" alt="Best of JS">
    </picture>
  </a>
</div>

Strict TypeScript types for Ethereum ABIs. ABIType provides utilities and type definitions for ABI properties and values, covering the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html), as well as [EIP-712](https://eips.ethereum.org/EIPS/eip-712) Typed Data.

```ts
import { ExtractAbiFunctions } from 'abitype'
import { erc20Abi } from 'abitype/test'

type FunctionNames = ExtractAbiFunctionNames<typeof erc20Abi, 'view'>
//   ^? type FunctionNames = "symbol" | "name" | "allowance" | "balanceOf" | "decimals" | "totalSupply"

type TransferInputTypes = AbiParametersToPrimitiveTypes<
  // ^? type TransferInputTypes = readonly [`0x${string}`, bigint]
  ExtractAbiFunction<typeof erc20Abi, 'transfer'>['inputs']
>
```

Works great for adding blazing fast [autocomplete](https://twitter.com/awkweb/status/1555678944770367493) and type checking to functions, variables, or your own types. No need to generate types with third-party tools – just use your ABI and let TypeScript do the rest!

## TL;DR

ABIType might be a good option for your project if:

- You want to [typecheck](/api/types) your ABIs or EIP-712 Typed Data.
- You want to add type inference and autocomplete to your library based on user-provided ABIs or EIP-712 Typed Data, like [wagmi](https://wagmi.sh) and [viem](https://viem.sh).
- You need to [convert ABI types](/api/utilities#abiparameterstoprimitivetypes) (e.g. `'string'`) to TypeScript types (e.g. `string`) or other type transformations.
- You need to validate ABIs at [runtime](/api/zod) (e.g. after fetching from external resource).
- You don’t want to set up a build process to generate types (e.g. TypeChain).

## Install

Read the [Getting Started](/guide/getting-started) guide to learn more how to use ABIType.

::: code-group
```bash [pnpm]
pnpm add abitype
```

```bash [npm]
npm i abitype
```

```bash [yarn]
yarn add abitype
```
:::

## Sponsor

If you find ABIType useful, please consider supporting development on [GitHub Sponsors](https://github.com/sponsors/wagmi-dev?metadata_campaign=abitype_docs) or sending crypto to `wagmi-dev.eth`. Thank you 🙏

## Community

If you have questions or need help, reach out to the community at the [ABIType GitHub Discussions](https://github.com/wagmi-dev/abitype/discussions).