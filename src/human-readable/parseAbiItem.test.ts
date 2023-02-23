import { expect, test } from 'vitest'

import { parseAbiItem } from './parseAbiItem'

test('parseAbiItem', () => {
  // @ts-expect-error invalid signature type
  expect(() => parseAbiItem('')).toThrowErrorMatchingInlineSnapshot(
    '"Unknown signature \\"\\""',
  )

  // @ts-expect-error invalid signature type
  expect(() => parseAbiItem([])).toThrowErrorMatchingInlineSnapshot(
    '"Failed to parse ABI item"',
  )

  expect(() =>
    parseAbiItem(['struct Foo { string name; }']),
  ).toThrowErrorMatchingInlineSnapshot('"Failed to parse ABI item"')
})
