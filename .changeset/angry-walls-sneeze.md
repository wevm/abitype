---
"abitype": minor
---

**Breaking**: Renamed `'abitype/test`' entrypoint to `'abitype/abis'`.

```diff
- import { erc20Abi } from 'abitype/test'
+ import { erc20Abi } from 'abitype/abis'
```

**Breaking**: Removed `zeroAddress` export from `'abitype/abis'`. You can copy it directly into your project if you still need to use it.

```diff
- import { zeroAddress } from 'abitype/abis'
+ export const zeroAddress = '0x0000000000000000000000000000000000000000' as const
```

**Breaking**: Renamed `Config`, `DefaultConfig`, and `ResolvedConfig` to `Register`, `DefaultRegister`, and `ResolvedRegister` respectively.

```diff
- import { Config, DefaultConfig, ResolvedConfig } from 'abitype'
+ import { Register, DefaultRegister, ResolvedRegister } from 'abitype'
``` 

To configure ABIType, target `Register` instead of `Config`:

```diff
declare module 'abitype' {
- export interface Config {
+ export interface Register {
    BigIntType: bigint & { foo: 'bar' }
  }
}
```