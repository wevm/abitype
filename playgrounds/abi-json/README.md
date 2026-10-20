# ABI JSON content mapper prototype

**TypeScript 7.1.0-beta can infer ABI types from JSON content in `.abi` files,
but rejects `.abi.json` content mapper registrations.** This is a private
experiment, not a published package or support for ordinary JSON imports.

## Run

From the repository root:

```sh
pnpm install
pnpm --filter abi-json check:types
pnpm --filter abi-json test
```

The playground pins `typescript@7.1.0-beta` under the `typescript-beta` alias.
ABIType's existing compiler and supported TypeScript versions are unchanged.
The docs explicitly retain their existing TypeScript 5.9.3 dependency so pnpm
does not resolve their TypeScript peers to the new beta.

The type check executes the mapper with `--runExternalCode`. Only grant this
permission to trusted mapper packages: they run arbitrary external code.

## What works

[`token.abi`](./token.abi) contains an ordinary JSON ABI array. The mapper supplies
a virtual TypeScript module, leaving the original file unchanged (abbreviated):

```ts
const abi = [
  /* original ABI entries */
] as const
export default abi
```

The consumer needs no assertion or narrowing helper:

```ts
import type { ExtractAbiFunctionNames } from 'abitype'
import abi from './token.abi'

type Names = ExtractAbiFunctionNames<typeof abi>
// 'balanceOf' | 'transfer' | 'quote'
```

[`index.ts`](./index.ts) checks exact function names, mutability filtering,
readonly tuples, address/bigint/boolean parameters, nested structs, fixed-length
arrays, and a non-ASCII name. The mapper preserves the source text and supplies
a verbatim UTF-16 mapping, so diagnostics can refer to the original file.
Parentheses keep a trailing newline from separating the array and `as const`.

## Why `.abi.json` does not work

The integration test registers `.abi.json` and invokes the real beta compiler.
It requires this diagnostic:

```text
error TS18066: Content mapper file extension '.abi.json' is a built-in extension and cannot be registered by a content mapper.
```

The released beta uses a case-insensitive **suffix** check in
[`HasReservedSourceExtension`](https://github.com/microsoft/TypeScript/blob/3e9236361fa97a9e6c685f4833ac457ae2d8c50a/tsc/internal/contentmapper/contentmapper.go#L76-L86),
not the exact-extension check in the older archived `typescript-go` implementation.
Supporting `.abi.json` requires an upstream change or a different approach,
such as generated declaration sidecars. This prototype does not patch TypeScript.

## Limits

- The mapper accepts JSON arrays, not artifact objects containing an `abi` field.
  It checks JSON syntax and the array root, not ABI semantics; consumers can use
  `abi satisfies Abi` as in the example.
- Content mapping supplies types, not a runtime loader. Node cannot natively
  import `.abi`; a bundler/loader would need to load it as JSON. The tests confirm
  that `.json` and `.abi.json` load natively in Node, independently of TypeScript.
- Ordinary `.json` imports retain TypeScript's normal widened types.
- CLI behavior is tested. Editor completion, navigation, and watch-mode updates
  have not been verified. Editors need TypeScript 7.1 plus workspace trust and
  content mapper permissions.
- The mapper uses the compiler's JSON-RPC protocol over stdio, based on the
  [official sample](https://github.com/DanielRosenwasser/content-mapper-sample).
  This is intentionally a small prototype rather than a general RPC server.
