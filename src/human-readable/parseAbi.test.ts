import { expect, test } from 'vitest'

import { seaportHumanReadableAbi } from '../test'
import { parseAbi } from './parseAbi'

test('parseAbi', () => {
  expect(parseAbi(seaportHumanReadableAbi)).toMatchSnapshot()
})
