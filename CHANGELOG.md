# abitype

## 0.8.11

### Patch Changes

- [#156](https://github.com/wagmi-dev/abitype/pull/156) [`d577f3d`](https://github.com/wagmi-dev/abitype/commit/d577f3d533b2ef4477a4023ee077ffaf2b6a76d0) Thanks [@tmm](https://github.com/tmm)! - Switched `TypedData` from TypeScript object to Record.

## 0.8.10

### Patch Changes

- [`1d62393`](https://github.com/wagmi-dev/abitype/commit/1d62393d97ca927feeec8eacb4588952fd635ec0) Thanks [@tmm](https://github.com/tmm)! - Fixed `parseAbi` issue with `typescript@5.1.3`

## 0.8.9

### Patch Changes

- [#151](https://github.com/wagmi-dev/abitype/pull/151) [`482bc5f`](https://github.com/wagmi-dev/abitype/commit/482bc5f2258fb60fe52f252be599c98ef753b24c) Thanks [@tmm](https://github.com/tmm)! - Added human-readble ABI format utils.

## 0.8.8

### Patch Changes

- [#149](https://github.com/wagmi-dev/abitype/pull/149) [`ba21aae`](https://github.com/wagmi-dev/abitype/commit/ba21aae2460efe4ee6dae074c85e73d6c87a81d4) Thanks [@tmm](https://github.com/tmm)! - Removed internal barrel exports.

## 0.8.7

### Patch Changes

- [#147](https://github.com/wagmi-dev/abitype/pull/147) [`f9aa86e`](https://github.com/wagmi-dev/abitype/commit/f9aa86ea549bbefc471ec9921b6e8cb6ebfd985f) Thanks [@Raiden1411](https://github.com/Raiden1411)! - Fixed type-level issue with human-readable function signatures with no space returns.

## 0.8.6

### Patch Changes

- [#143](https://github.com/wagmi-dev/abitype/pull/143) [`84ce0d9`](https://github.com/wagmi-dev/abitype/commit/84ce0d98b4fe963bea37dfa17596898c30533281) Thanks [@Raiden1411](https://github.com/Raiden1411)! - Added Zod Address Schema

## 0.8.5

### Patch Changes

- [#144](https://github.com/wagmi-dev/abitype/pull/144) [`02ae52e`](https://github.com/wagmi-dev/abitype/commit/02ae52ea465df4c4682987f7a5ecc84a88c9b9cc) Thanks [@tmm](https://github.com/tmm)! - Fixed package.json Zod entrypoint ESM path.

## 0.8.4

### Patch Changes

- [#134](https://github.com/wagmi-dev/abitype/pull/134) [`ece6da6`](https://github.com/wagmi-dev/abitype/commit/ece6da6658a2c42e8a18316060d8fc133aa1c940) Thanks [@Raiden1411](https://github.com/Raiden1411)! - Added `AbiEventParameter` type.

## 0.8.3

### Patch Changes

- [#131](https://github.com/wagmi-dev/abitype/pull/131) [`3bc566a`](https://github.com/wagmi-dev/abitype/commit/3bc566a434b6d75745bc1c6359b3996669c85586) Thanks [@izayl](https://github.com/izayl)! - support no-space returns

## 0.8.2

### Patch Changes

- [#126](https://github.com/wagmi-dev/abitype/pull/126) [`7ccc347`](https://github.com/wagmi-dev/abitype/commit/7ccc347a7e53d1c08bd84d8f1876e3621e45398c) Thanks [@Raiden1411](https://github.com/Raiden1411)! - Switched from `tsup` to `tsc`.

## 0.8.1

### Patch Changes

- [#127](https://github.com/wagmi-dev/abitype/pull/127) [`a71c5ce`](https://github.com/wagmi-dev/abitype/commit/a71c5cec48aec8f08198cca861fda2ad7edee0fc) Thanks [@izayl](https://github.com/izayl)! - Added EIP-165 abi, and rename `address` to `zeroAddress`

## 0.8.0

### Minor Changes

- [#122](https://github.com/wagmi-dev/abitype/pull/122) [`0c38841`](https://github.com/wagmi-dev/abitype/commit/0c388413287ba565897ef9da5b5a22d1c5d9a300) Thanks [@Raiden1411](https://github.com/Raiden1411)! - Changed errors for `parseAbiItem`, `parseAbiParameter` and `parseAbiParameters` into to custom error classes.

## 0.7.1

### Patch Changes

- [#112](https://github.com/wagmi-dev/abitype/pull/112) [`1e347ca`](https://github.com/wagmi-dev/abitype/commit/1e347cab3f457a4325062c6c386aa0ed7bc9c6b7) Thanks [@tmm](https://github.com/tmm)! - Updated human-readable ABI parsing to convert dynamic integer alias types (e.g. `int` and `uint`) to fixed types (e.g. `int256` and `uint256`).

## 0.7.0

### Minor Changes

- [#111](https://github.com/wagmi-dev/abitype/pull/111) [`5d17c7c`](https://github.com/wagmi-dev/abitype/commit/5d17c7ce01c008a99c7de5d702641e555830c89a) Thanks [@tmm](https://github.com/tmm)! - Changed `TypedDataDomain['chainId']` to `number`.

- [#106](https://github.com/wagmi-dev/abitype/pull/106) [`355647b`](https://github.com/wagmi-dev/abitype/commit/355647bbb01698e7b3260facd237cd92d27bd371) Thanks [@tmm](https://github.com/tmm)! - Refactored `AbiFunction` into `AbiConstructor`, `AbiFallback`, `AbiFunction`, and `AbiReceive`.

  `AbiFunction` (e.g. `type: 'function'`) was frequently used and the only way to narrow that specific type from the others (e.g. `type: 'constructor' | 'fallback' | 'receive'`) was to add a bunch of `& { type: 'function' }` to the `AbiFunction` type.

  Changed default value of `BytesType['inputs']` back to `` `0x${string}` ``. This ends up being the most strict and sensible default so you can opt in to handling `Uint8Array` (or any other type) instead of opting out of it.

### Patch Changes

- [#110](https://github.com/wagmi-dev/abitype/pull/110) [`4544125`](https://github.com/wagmi-dev/abitype/commit/4544125f118208babfce02f0c03d47e9d2324b5d) Thanks [@tmm](https://github.com/tmm)! - Fixed constructor, fallback, and receive signature parsing.

## 0.6.8

### Patch Changes

- [#100](https://github.com/wagmi-dev/abitype/pull/100) [`4263277`](https://github.com/wagmi-dev/abitype/commit/4263277e0630af8fcaedefa084d754f607c588a4) Thanks [@Raiden1411](https://github.com/Raiden1411)! - Bug fixes:

  - Fixed `splitParameters` parsing behavior for tuples with too many closing or opening parentheses.
  - Fixed modifiers parsing for `error`, `event`, `struct` signatures.
  - Stopped allowing protected Solidity keywords as parameter names.
  - Stopped allowing `calldata`, `memory`, and `storage` on non-array types (or `string`, `bytes`, and `tuple`).

## 0.6.7

### Patch Changes

- [`228f083`](https://github.com/wagmi-dev/abitype/commit/228f083fda88f20de38af2a78da7043ec180b9bd) Thanks [@jxom](https://github.com/jxom)! - Updated published package.json attributes

## 0.6.6

### Patch Changes

- [#101](https://github.com/wagmi-dev/abitype/pull/101) [`3975ef5`](https://github.com/wagmi-dev/abitype/commit/3975ef5eab740712ab91f8f6bfa3822bcd95ec22) Thanks [@jxom](https://github.com/jxom)! - Added support for CJS.

## 0.6.5

### Patch Changes

- [`cc053a4`](https://github.com/wagmi-dev/abitype/commit/cc053a4fa89aea9b80ff2228a41b7a83e77f2740) Thanks [@tmm](https://github.com/tmm)! - Exported BaseError.

## 0.6.4

### Patch Changes

- [`387ad15`](https://github.com/wagmi-dev/abitype/commit/387ad154ce0d4d30dc8213ede8972a759fac100e) Thanks [@tmm](https://github.com/tmm)! - Fixed parse types for inline annotations.

## 0.6.3

### Patch Changes

- [#96](https://github.com/wagmi-dev/abitype/pull/96) [`c35cae8`](https://github.com/wagmi-dev/abitype/commit/c35cae8b697f7ed05525c4f27585aaf6b12d7e51) Thanks [@tmm](https://github.com/tmm)! - Updated internal parse types.

- [#93](https://github.com/wagmi-dev/abitype/pull/93) [`32daf7c`](https://github.com/wagmi-dev/abitype/commit/32daf7cf26b0816b9874486f2940fc8ef9277ae4) Thanks [@Raiden1411](https://github.com/Raiden1411)! - Fixed a bug, where Solidity types were not validated when parsing ABI parameters, and added a base cache with well-known Solidity parameters.

## 0.6.2

### Patch Changes

- [#91](https://github.com/wagmi-dev/abitype/pull/91) [`fc4d4f7`](https://github.com/wagmi-dev/abitype/commit/fc4d4f7941e119868c25f88112aa90fe48085889) Thanks [@Raiden1411](https://github.com/Raiden1411)! - Fixed constructor signature not supporting "payable" mutability

## 0.6.1

### Patch Changes

- [`1597a8f`](https://github.com/wagmi-dev/abitype/commit/1597a8f454e199f2cd4c3c8c6f6613768a90e968) Thanks [@tmm](https://github.com/tmm)! - Added peerDependenciesMeta to package.json

## 0.6.0

### Minor Changes

- [#84](https://github.com/wagmi-dev/abitype/pull/84) [`e1fa871`](https://github.com/wagmi-dev/abitype/commit/e1fa871dbc4319e5a7aeec25c2b8ed50f5225e81) Thanks [@tmm](https://github.com/tmm)! - Added human-readable ABI type-level and runtime parse utilities.

## 0.5.0

### Minor Changes

- [#85](https://github.com/wagmi-dev/abitype/pull/85) [`7042ee8`](https://github.com/wagmi-dev/abitype/commit/7042ee8068be1ca36a21f20a34c9d32c5d51389a) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** `uint` and `int` types now cast to `ResolvedConfig['BigIntType']` instead of `ResolvedConfig['IntType'] | ResolvedConfig['BigIntType']`.

### Patch Changes

- [#87](https://github.com/wagmi-dev/abitype/pull/87) [`00e5bd0`](https://github.com/wagmi-dev/abitype/commit/00e5bd05175f1f5f6ff4f4772a6db325c3462b16) Thanks [@jxom](https://github.com/jxom)! - Fixed derived type of `AbiParameterToPrimitiveType` for tuples that have all unnamed components.

## 0.4.1

### Patch Changes

- [#81](https://github.com/wagmi-dev/abitype/pull/81) [`9c437a4`](https://github.com/wagmi-dev/abitype/commit/9c437a45e0b4802a62e5eea2c48430ea3b4c8d8a) Thanks [@tmm](https://github.com/tmm)! - Removed `uint` and `int` from `TypedDataType` (not allowed in spec).

## 0.4.0

### Minor Changes

- [#78](https://github.com/wagmi-dev/abitype/pull/78) [`0df9b94`](https://github.com/wagmi-dev/abitype/commit/0df9b9473cefa6ad0d0227eb9d8ed805e15c4ea6) Thanks [@Raiden1411](https://github.com/Raiden1411)! - **Breaking**: Changed `BytesType` configuration property to support ABI item inputs and outputs types. To keep the previous behavior set `BytesType` to the following:

  ```ts
  declare module "abitype" {
    BytesType: {
      inputs: `0x${string}`;
      outputs: `0x${string}`;
    }
  }
  ```

  `BytesType['inputs']` default is now `` `0x${string}` | Uint8Array `` instead of just `` `0x${string}` ``.

## 0.3.0

### Minor Changes

- [#71](https://github.com/wagmi-dev/abitype/pull/71) [`a3880d9`](https://github.com/wagmi-dev/abitype/commit/a3880d9497a4ad6124f4776a7f0a5d1200b93008) Thanks [@tmm](https://github.com/tmm)! - Bumped minimum TypeScript version to 4.9.4.

## 0.2.5

### Patch Changes

- [#65](https://github.com/wagmi-dev/abitype/pull/65) [`a542514`](https://github.com/wagmi-dev/abitype/commit/a54251412f343d706c0a7903948b8744c87a39c3) Thanks [@Bind](https://github.com/Bind)! - Fixed `abitype/zod` support for legacy contracts, like WETH, by making `inputs` optional for `type: 'fallback'` and `AbiError` `type` from `"event"` to `"error"`.

## 0.2.4

### Patch Changes

- [#63](https://github.com/wagmi-dev/abitype/pull/63) [`db3d249`](https://github.com/wagmi-dev/abitype/commit/db3d2491a165351151de69feb02829e03ea7f191) Thanks [@tmm](https://github.com/tmm)! - Added `stateMutability` calculation for older contracts that only use deprecated `constant` and `payable` fields.

## 0.2.3

### Patch Changes

- [`75fbeb2`](https://github.com/wagmi-dev/abitype/commit/75fbeb2012b103a291e1d0fc9968db26929411c1) Thanks [@tmm](https://github.com/tmm)! - Fixed zod entrypoint

## 0.2.2

### Patch Changes

- [`f2a07ad`](https://github.com/wagmi-dev/abitype/commit/f2a07ad327c9c54f93e65b9c527cbe549e084491) Thanks [@tmm](https://github.com/tmm)! - Fixed zod entrypoint

## 0.2.1

### Patch Changes

- [`bae62e5`](https://github.com/wagmi-dev/abitype/commit/bae62e5e8293f8f9a565ce9609f109ead4605ca4) Thanks [@github-actions[bot]](https://github.com/github-actions%5Bbot%5D)! - Added missing zod entrypoint package.json

## 0.2.0

### Minor Changes

- [#55](https://github.com/wagmi-dev/abitype/pull/55) [`7034511`](https://github.com/wagmi-dev/abitype/commit/70345115cbbb01c78a10ae132dbe581265052b50) Thanks [@tmm](https://github.com/tmm)! - Added `abitype/zod` entrypoint

## 0.1.8

### Patch Changes

- [#52](https://github.com/wagmi-dev/abitype/pull/52) [`e53dcda`](https://github.com/wagmi-dev/abitype/commit/e53dcda589c25351f38f8200f62e428d19cb1985) Thanks [@tmm](https://github.com/tmm)! - Made `AbiParameter['name']` optional

## 0.1.7

### Patch Changes

- [`402a410`](https://github.com/wagmi-dev/abitype/commit/402a4105f711e1a033d6e55c95b36a9ebe3d59dd) Thanks [@tmm](https://github.com/tmm)! - Removed `engines` from `package.json`.

## 0.1.6

### Patch Changes

- [#43](https://github.com/wagmi-dev/abitype/pull/43) [`6117996`](https://github.com/wagmi-dev/abitype/commit/61179967d112af3e0c1a9bd016cd7a377335956c) Thanks [@tmm](https://github.com/tmm)! - Added `Narrow` type

## 0.1.5

### Patch Changes

- [#41](https://github.com/wagmi-dev/abitype/pull/41) [`7147b07`](https://github.com/wagmi-dev/abitype/commit/7147b07decaa2f6071d33de688859bdac7ce4fdc) Thanks [@tmm](https://github.com/tmm)! - Set `ArrayMaxDepth` default to `false` so there is no maximum array depth. Added new configuration option `StrictAbiType` for validating `AbiParameter`'s `type`. Defaults to `false` so `AbiParameter['type']` is `string` instead of a large union.

## 0.1.4

### Patch Changes

- [#37](https://github.com/wagmi-dev/abitype/pull/37) [`2c67082`](https://github.com/wagmi-dev/abitype/commit/2c670823f5ac3ed882709af2c458fc90a8cc8169) Thanks [@tmm](https://github.com/tmm)! - Added filter on typed data to disallow self-referencing objects.

## 0.1.3

### Patch Changes

- [#35](https://github.com/wagmi-dev/abitype/pull/35) [`d733c67`](https://github.com/wagmi-dev/abitype/commit/d733c672c062fe67efda2b08955b4f039416cc37) Thanks [@tmm](https://github.com/tmm)! - Made array types immutable

## 0.1.2

### Patch Changes

- [#33](https://github.com/wagmi-dev/abitype/pull/33) [`0a2e8ee`](https://github.com/wagmi-dev/abitype/commit/0a2e8ee730956bb41415bb5c5cb37c5a3780c4b5) Thanks [@tmm](https://github.com/tmm)! - Added `TypedDataDomain`

## 0.1.1

### Patch Changes

- [#30](https://github.com/wagmi-dev/abitype/pull/30) [`6e56cc2`](https://github.com/wagmi-dev/abitype/commit/6e56cc27380c5886ef7aff96c87bb3564e7b56a8) Thanks [@tmm](https://github.com/tmm)! - Updated default config values and fixed check for unnamed tuples.

## 0.1.0

### Minor Changes

- [`cece4ca`](https://github.com/wagmi-dev/abitype/commit/cece4cada31c39036cce5b485dba1aaf23a5cefe) Thanks [@tmm](https://github.com/tmm)! - Initial release

## 0.0.17

### Patch Changes

- [`9e6557a`](https://github.com/wagmi-dev/abitype/commit/9e6557aee3dcd850bccb0f4bf06eea36a4072e02) Thanks [@tmm](https://github.com/tmm)! - Made `Address` resolve `AddressType` config option.

## 0.0.16

### Patch Changes

- [#25](https://github.com/wagmi-dev/abitype/pull/25) [`8d23291`](https://github.com/wagmi-dev/abitype/commit/8d23291f47f21dc40d5f407f78996856aa95e6c0) Thanks [@tmm](https://github.com/tmm)! - Parse out integer type.

## 0.0.15

### Patch Changes

- [`6f2d557`](https://github.com/wagmi-dev/abitype/commit/6f2d55743a7c18b59fb63afcb58c62c3ade83f4c) Thanks [@tmm](https://github.com/tmm)! - Removed signature utilties.

## 0.0.14

### Patch Changes

- [#22](https://github.com/wagmi-dev/abitype/pull/22) [`5307b1e`](https://github.com/wagmi-dev/abitype/commit/5307b1ec88afae6fd3b69a05777e0fc310db3111) Thanks [@tmm](https://github.com/tmm)! - Added `AddressType` and `BytesType` to configuration. Renamed `NumberType` to `IntType`.

## 0.0.13

### Patch Changes

- [#20](https://github.com/wagmi-dev/abitype/pull/20) [`a8cb964`](https://github.com/wagmi-dev/abitype/commit/a8cb96464d8caa77b1094cce3e20bde90ece3ad5) Thanks [@tmm](https://github.com/tmm)! - Added `NumberType` configuration option. `NumberType` sets the TypeScript type to use for `int` and `uint` values.

## 0.0.12

### Patch Changes

- [#18](https://github.com/wagmi-dev/abitype/pull/18) [`995674d`](https://github.com/wagmi-dev/abitype/commit/995674d6cf909124f7dc6f20587807ab349db7e2) Thanks [@tmm](https://github.com/tmm)! - Added support for tuples with unnamed parameters.

## 0.0.11

### Patch Changes

- [#17](https://github.com/wagmi-dev/abitype/pull/17) [`7d5976b`](https://github.com/wagmi-dev/abitype/commit/7d5976be1d01dc7f74095d6aa6501b48268e43aa) Thanks [@tmm](https://github.com/tmm)! - Added configuration option for disabling max array depth.

* [#15](https://github.com/wagmi-dev/abitype/pull/15) [`e00b2cd`](https://github.com/wagmi-dev/abitype/commit/e00b2cd92c3a62eb36c5883cb89abe7f80a7bbc1) Thanks [@tmm](https://github.com/tmm)! - Added support for nested structs.

## 0.0.10

### Patch Changes

- [#13](https://github.com/wagmi-dev/abitype/pull/13) [`1cd25fb`](https://github.com/wagmi-dev/abitype/commit/1cd25fb265d5d67e0bfdd3d93b54230cb4e18960) Thanks [@tmm](https://github.com/tmm)! - Add support for arbitrary nested array depth

## 0.0.9

### Patch Changes

- [`f573be2`](https://github.com/wagmi-dev/abitype/commit/f573be2f5cc826e9977ce21f2f9600c9cc8cf014) Thanks [@tmm](https://github.com/tmm)! - Export Solidity array subtypes

## 0.0.8

### Patch Changes

- [`dabf83d`](https://github.com/wagmi-dev/abitype/commit/dabf83d169a5bb8d86dad4b6afbae14c50f20c8d) Thanks [@tmm](https://github.com/tmm)! - Expose configuration options

## 0.0.7

### Patch Changes

- [`f4e77e7`](https://github.com/wagmi-dev/abitype/commit/f4e77e70dcc8b71141716a8847ef654008c2e36c) Thanks [@tmm](https://github.com/tmm)! - Add support for 2D arrays

## 0.0.6

### Patch Changes

- [`e683f81`](https://github.com/wagmi-dev/abitype/commit/e683f81605e1bab2201085c1e51ac67ce4223115) Thanks [@tmm](https://github.com/tmm)! - Update TSDoc for utils

## 0.0.5

### Patch Changes

- [`bc0e632`](https://github.com/wagmi-dev/abitype/commit/bc0e632cfac306170e221a9509a42b8937fe6426) Thanks [@tmm](https://github.com/tmm)! - Release candidate supporting functions, errors, and events.

## 0.0.4

### Patch Changes

- [`dd77b0c`](https://github.com/wagmi-dev/abitype/commit/dd77b0c84d9326c252a6f2929fca8a675e48383a) Thanks [@tmm](https://github.com/tmm)! - Deeply nested types

## 0.0.3

### Patch Changes

- [`8912b7f`](https://github.com/wagmi-dev/abitype/commit/8912b7fb3969a8103e21bc9230b670fd0ae39908) Thanks [@tmm](https://github.com/tmm)! - Support fixed-length arrays

## 0.0.2

### Patch Changes

- [`019dc3c`](https://github.com/wagmi-dev/abitype/commit/019dc3c42d7929cf571b013690e1082100b23b92) Thanks [@tmm](https://github.com/tmm)! - Initial release
