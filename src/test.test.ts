import { expect, it } from 'vitest'

import * as Exports from './test.js'

it('should expose correct exports', () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
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
      "wethBytecode",
      "uniswapBytecode",
      "seaportBytecode",
      "zeroAddress",
    ]
  `)
})
