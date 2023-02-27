# What is ABIType?

Strict TypeScript types for Ethereum ABIs. ABIType provides utilities and type definitions for ABI properties and values, covering the [Contract ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html), as well as [EIP-712](https://eips.ethereum.org/EIPS/eip-712) Typed Data.

```ts
import { ExtractAbiFunctions } from 'abitype'

const erc721Abi = [...] as const

type Result = ExtractAbiFunctions<typeof erc721Abi, 'payable'>
```

Works great for adding blazing fast [autocomplete](https://twitter.com/awkweb/status/1555678944770367493) and type checking to functions, variables, or your own types ([examples](/examples)). No need to generate types with third-party tools – just use your ABI and let TypeScript do the rest!

## TL;DR

ABIType might be a good option for your project if:

- You want to typecheck your ABIs or EIP-712 Typed Data.
- You want to add type inference and autocomplete to your library based on user-provided ABIs or EIP-712 Typed Data.
- You need to convert ABI types (e.g. `'string'`) to TypeScript types (e.g. `string`) or other type transformations.
- You need to validate ABIs at [runtime](#zod) (e.g. after fetching from external resource).
- You don’t want to set up a build process to generate types (e.g. TypeChain).