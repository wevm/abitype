/**
 * Assert parameter is of a specific type.
 *
 * @param value - Value that should be identical to type `T`.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function expectType<T>(value: T): void {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function test(name: string, _callback: () => void) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}

export const address = '0x0000000000000000000000000000000000000000' as const

export {
  ensRegistryWithFallbackAbi,
  nestedTupleArrayAbi,
  nounsAuctionHouseAbi,
  wagmiMintExampleAbi,
  writingEditionsFactoryAbi,
} from './abis'
