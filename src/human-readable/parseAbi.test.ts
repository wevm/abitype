import { expect, test } from 'vitest'

import {
  wagmiMintExampleAbi,
  wagmiMintExampleHumanReadableAbi,
} from '../../test'
import { parseAbi } from './parseAbi'

test('parseAbi', () => {
  const res = parseAbi(wagmiMintExampleHumanReadableAbi)
  expect(res).toEqual(wagmiMintExampleAbi)
})
