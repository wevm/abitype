import { expect, it } from 'vitest'

import * as Exports from './abis.js'

it('exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "customSolidityErrorsHumanReadableAbi",
      "ensHumanReadableAbi",
      "ensRegistryWithFallbackHumanReadableAbi",
      "erc20HumanReadableAbi",
      "nestedTupleArrayHumanReadableAbi",
      "nounsAuctionHouseHumanReadableAbi",
      "seaportHumanReadableAbi",
      "wagmiMintExampleHumanReadableAbi",
      "wethHumanReadableAbi",
      "writingEditionsFactoryHumanReadableAbi",
      "eip165HumanReadableAbi",
      "customSolidityErrorsAbi",
      "ensAbi",
      "ensRegistryWithFallbackAbi",
      "erc20Abi",
      "nestedTupleArrayAbi",
      "nounsAuctionHouseAbi",
      "seaportAbi",
      "wagmiMintExampleAbi",
      "wethAbi",
      "writingEditionsFactoryAbi",
      "eip165Abi",
    ]
  `)
})
