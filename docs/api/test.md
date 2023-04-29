---
description: 'Entrypoint for test utilities and constants.'
title: 'Test'
---

# Test

ABIType exports some test utilities and constants to make playing around and testing your code easier via the `'abitype/test'` entrypoint.

## Constants

```ts twoslash
import { address } from 'abitype/test'
```

### ABIs

```ts twoslash
import {
  customSolidityErrorsAbi,
  ensAbi,
  ensRegistryWithFallbackAbi,
  erc20Abi,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  seaportAbi,
  wagmiMintExampleAbi,
  wethAbi,
  writingEditionsFactoryAbi,
  eip165Abi,
} from 'abitype/test'
```

### Human-Readable ABIs

```ts twoslash
import {
  customSolidityErrorsHumanReadableAbi,
  ensHumanReadableAbi,
  ensRegistryWithFallbackHumanReadableAbi,
  erc20HumanReadableAbi,
  nestedTupleArrayHumanReadableAbi,
  nounsAuctionHouseHumanReadableAbi,
  seaportHumanReadableAbi,
  wagmiMintExampleHumanReadableAbi,
  wethHumanReadableAbi,
  writingEditionsFactoryHumanReadableAbi,
} from 'abitype/test'
```
