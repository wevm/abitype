import { expect, it } from 'vitest'

import * as Exports from './'

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "address",
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
    ]
  `)
})
