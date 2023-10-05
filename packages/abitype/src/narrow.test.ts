import { expect, test } from 'vitest'

import { narrow } from './narrow.js'

test('narrow', () => {
  expect(narrow('foo')).toMatchInlineSnapshot('"foo"')
})
