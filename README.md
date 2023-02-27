# ABIType

[![npm](https://img.shields.io/npm/v/abitype.svg?colorA=21262d&colorB=161b22&style=flat)](https://www.npmjs.com/package/abitype)
[![Downloads per month](https://img.shields.io/npm/dm/abitype?colorA=21262d&colorB=161b22&style=flat)](https://www.npmjs.com/package/abitype)

Strict TypeScript types for Ethereum ABIs. ABIType provides utilities and type definitions for ABI properties and values, covering the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html), as well as [EIP-712](https://eips.ethereum.org/EIPS/eip-712) Typed Data.

```ts
import { ExtractAbiFunctions } from 'abitype'

const erc721Abi = [...] as const

type Result = ExtractAbiFunctions<typeof erc721Abi, 'payable'>
```

Works great for adding blazing fast [autocomplete](https://twitter.com/awkweb/status/1555678944770367493) and type checking to functions, variables, or your own types ([examples](/examples)). No need to generate types with third-party tools – just use your ABI and let TypeScript do the rest!

## Install

```bash
npm install abitype
pnpm add abitype
yarn add abitype
```

ABIType requires `typescript@>=4.9.4`

## Usage

Since ABIs can contain deeply nested arrays and objects, you must either assert ABIs to constants using [`const` assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions) or use the built-in `narrow` function (works with JavaScript). This allows TypeScript to take the most specific types for expressions and avoid type widening (e.g. no going from `"hello"` to `string`).

```ts
const erc721Abi = [...] as const
const erc721Abi = <const>[...]
```

```ts
import { narrow } from 'abitype'
const erc721Abi = narrow([...])
```

## TL;DR

ABIType might be a good option for your project if:

- You want to typecheck your ABIs or EIP-712 Typed Data.
- You want to add type inference and autocomplete to your library based on user-provided ABIs or EIP-712 Typed Data.
- You need to convert ABI types (e.g. `'string'`) to TypeScript types (e.g. `string`) or other type transformations.
- You need to validate ABIs at [runtime](#zod) (e.g. after fetching from external resource).
- You don’t want to set up a build process to generate types (e.g. TypeChain).

## Support

If you find ABIType useful, please consider supporting development. Thank you 🙏

- [GitHub Sponsors](https://github.com/sponsors/wagmi-dev?metadata_campaign=gh_readme_support)
- [Gitcoin Grant](https://wagmi.sh/gitcoin)
- [wagmi-dev.eth](https://etherscan.io/enslookup-search?search=wagmi-dev.eth)

## Contributing

If you're interested in contributing, please read the [contributing docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Authors

- [@tmm](https://github.com/tmm) (awkweb.eth, [Twitter](https://twitter.com/awkweb))

## License

[MIT](/LICENSE) License
