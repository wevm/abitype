---
description: "Comparisons between ABIType's features and features from similar libraries."
title: 'Comparisons'
---

<script setup>
window.addEventListener('click', (e) => {
      const el = e.target 

      if (el.matches('.vp-code-group input')) {
        // input <- .tabs <- .vp-code-group
        const group = el.parentElement?.parentElement
        const i = Array.from(group?.querySelectorAll('input') || []).indexOf(el)

        
        const filtered = Array.from(
          group?.querySelectorAll('div[class*="language-"]') || []
        ).filter((val) => !val.className.match('language-id'))

        const current = group?.querySelector('div[class*="language-"].active')
        const next = filtered?.[i]

        if (current && next && current !== next) {
          current.classList.remove('active')
          next.classList.add('active')
        }
      }
    })
</script>
# Comparisons

No other library does what ABIType does (inferring TypeScript types from ABIs and EIP-712 Typed Data), but there are some similarities with other libraries. This page compares ABIType to other libraries that are similar in some way.

Comparisons strive to be as accurate and as unbiased as possible. If you use any of these libraries and feel the information could be improved, feel free to suggest changes.

## TypeChain

[**TypeChain**](https://github.com/dethcrypto/TypeChain) is a command-line tool that generates types and runtime wrappers for popular libraries at build time. People often use the generated types to cast values (e.g. `new Contract(…) as TypeChainType`). **ABIType** is a TypeScript library that infers static types from any ABI using type-level programming.

Below is a comparison of the libraries's type-level features:

|                 | TypeChain                                | ABIType                    |
| --------------- | ---------------------------------------- | -------------------------- |
| Lifecycle Step  | Generated at build time                  | Inferred at compile time   |
| ABI Source      | Path(s) to CLI command                   | Directly reference in code |
| Type Generation | Iterates through ABIs and builds strings | Static from type-level     |

::: info OPINION
If you are a library author looking to support type inference and autocomplete based on ABIs and EIP-721 Typed Data, you are better off writing your code using ABIType so users don't need to set up anything to get type-safety (e.g. install TypeChain, set up build step).
:::

## ethers.js

[ethers.js](https://github.com/ethers-io/ethers.js) is a JavaScript library for interacting with Ethereum. Among other features, it has utilities for working with human-readable ABIs. In addition to runtime functions, ABIType also has type utilities for working with [human-readable ABIs](/api/human).

Below is a comparison of the runtime functions from ethers.js and ABIType for parsing human-readable ABIs.

### `Interface` versus `parseAbi`

Parses a human-readable ABI into a JSON ABI.

::: code-group

```ts twoslash [abitype]
import { parseAbi } from 'abitype'

const abi = parseAbi([
  //  ^? 
  'function name((string name, uint256 age) foo, uint256 tokenId)',
  'event Foo(address indexed bar)',
])
```

```ts twoslash [abitype (struct)]
import { parseAbi } from 'abitype'

const abi = parseAbi([
  //  ^? 
  'struct Foo { string name; uint256 age }',
  'function name((string name, uint256 age) foo, uint256 tokenId)',
  'event Foo(address indexed bar)',
])
```

```ts twoslash [ethers@5]
import { FormatTypes, Interface } from '@ethersproject/abi'

const iface = new Interface([
  'function name(tuple(string name, uint256 age) foo, uint256 tokenId)',
  'event Foo(address indexed bar)',
])
const abi = iface.fragments
//    ^? 
```

```ts twoslash [ethers@6]
import { Interface } from 'ethers'

const iface = new Interface([
  'function name(tuple(string name, uint256 age) foo, uint256 tokenId)',
  'event Foo(address indexed bar)',
])
const abi = iface.fragments
//    ^? 
```

:::

- ABIType returns inferred ABI, while ethers.js just returns `readonly Fragment[]`
- ABIType supports [structs](/api/human.html#structs) as signatures and inline tuples (e.g. `(string name, uint256 age)`).
- ethers.js does not support struct signatures, but does support inline tuples with the optional `tuple` prefix keyword.
- ABIType supports mixed named and unnamed parameters, while ethers.js only supports either all named or all unnamed parameters.

#### Benchmarks

```bash
❯ pnpm bench src/human-readable/parseAbi.bench.ts

✓ Parse ABI (4) 2235ms
  name                      hz     min     max    mean     p75     p99    p995    p999     rme  samples
· abitype           383,316.98  0.0024  0.2804  0.0026  0.0026  0.0030  0.0032  0.0094  ±0.54%   191659   fastest
· abitype (struct)  344,133.32  0.0026  0.2467  0.0029  0.0029  0.0034  0.0035  0.0103  ±0.54%   172067  
· ethers@5           53,438.95  0.0175  1.7082  0.0187  0.0183  0.0242  0.0307  0.1916  ±0.82%    26720  
· ethers@6           22,431.26  0.0424  0.3683  0.0446  0.0438  0.0577  0.0691  0.2512  ±0.45%    11216   slowest

Summary
abitype - src/human-readable/parseAbi.bench.ts > Parse ABI
  1.11x faster than abitype (struct)
  7.17x faster than ethers@5
  17.09x faster than ethers@6
```

### `Fragment` versus `parseAbiItem`

Parses a human-readable ABI item into a JSON ABI item.

::: code-group

```ts twoslash [abitype]
import { parseAbiItem } from 'abitype'

const abiItem = parseAbiItem('function name((string name, uint256 age) foo, uint256 tokenId)')
//    ^? 
```

```ts twoslash [ethers@5]
import { Fragment } from '@ethersproject/abi'

const abiItem = Fragment.from('function name(tuple(string name, uint256 age) foo, uint256 tokenId)')
//    ^? 
```

```ts twoslash [ethers@6]
import { Fragment } from 'ethers'

const abiItem = Fragment.from('function name(tuple(string name, uint256 age) foo, uint256 tokenId)')
//    ^? 
```

:::

- ABIType returns inferred ABI item, while ethers.js just returns `Fragment`
- Rest same as [`Fragment` versus `parseAbiItem`](#fragment-versus-parseabiitem)

#### Benchmarks

```bash
❯ pnpm bench src/human-readable/parseAbiItem.bench.ts

✓ Parse ABI item (3) 1716ms
  name              hz     min     max    mean     p75     p99    p995    p999     rme  samples
· abitype   597,815.38  0.0015  0.3760  0.0017  0.0016  0.0022  0.0022  0.0031  ±0.58%   298908   fastest
· ethers@5   83,313.74  0.0114  0.2662  0.0120  0.0119  0.0130  0.0141  0.0401  ±0.45%    41657  
· ethers@6   39,887.50  0.0233  0.3942  0.0251  0.0248  0.0308  0.0365  0.1979  ±0.43%    19944   slowest

Summary
abitype - src/human-readable/parseAbiItem.bench.ts > comparison
  7.18x faster than ethers@5
  14.99x faster than ethers@6
```

### `ParamType` versus `parseAbiParameter`

Parses a human-readable ABI parameter into a JSON ABI parameter.

::: code-group

```ts twoslash [abitype]
import { parseAbiParameter } from 'abitype'

const abiParameter = parseAbiParameter('string foo')
//    ^? 
```

```ts twoslash [ethers@5]
import { ParamType } from '@ethersproject/abi'

const abiItem = ParamType.from('string foo')
//    ^? 
```

```ts twoslash [ethers@6]
import { ParamType } from 'ethers'

const abiItem = ParamType.from('string foo')
//    ^? 
```

:::

- ABIType returns inferred ABI parameter, while ethers.js just returns `ParamType`
- Rest same as [`Fragment` versus `parseAbiItem`](#fragment-versus-parseabiitem)

#### Benchmarks

```bash
❯ pnpm bench src/human-readable/parseAbiParameter.bench.ts

✓ Parse basic ABI Parameter (3) 2358ms
  name                hz     min     max    mean     p75     p99    p995    p999     rme  samples
· abitype   4,073,274.42  0.0001  1.0815  0.0002  0.0003  0.0003  0.0003  0.0005  ±0.52%  2036638   fastest
· ethers@6    288,007.56  0.0032  1.5593  0.0035  0.0034  0.0039  0.0058  0.0082  ±0.75%   144004   slowest
· ethers@5    507,627.43  0.0018  0.6730  0.0020  0.0020  0.0022  0.0023  0.0027  ±0.43%   253814  

Summary
abitype - src/human-readable/parseAbiParameter.bench.ts > Parse basic ABI Parameter
  8.02x faster than ethers@5
  14.14x faster than ethers@6
```
