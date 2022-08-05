/**
 * Assert parameter is of a specific type.
 *
 * @param value - Value that should be identical to type `T`.
 */
export function expectType<T>(_value: T): void {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}

export const address = '0x0000000000000000000000000000000000000000'

export {
  ensRegistryWithFallbackAbi,
  nestedTupleArrayAbi,
  nounsAuctionHouseProxyAbi,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from './abis'
