# Getting Started

## Install

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

::: info TypeScript Version
ABIType requires `typescript@>=4.9.4`.
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

Once your ABIs are set up correctly, you can use the exported [types](/api/types) and [utilities](/api/utilities) to work with them. You can also import already set-up ABIs from the `abitype/test` entrypoint to get started quickly.

```ts
import { ExtractAbiFunctions } from 'abitype'
import { erc20Abi } from 'abitype/test'

type Result = ExtractAbiFunctionNames<typeof erc20Abi, 'view'>
//   ^? type Result = "symbol" | "name" | "allowance" | "balanceOf" | "decimals" | "totalSupply"
```

## Community

If you have questions or need help, reach out to the community at [GitHub Discussions](https://github.com/wagmi-dev/abitype).