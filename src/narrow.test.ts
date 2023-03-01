import { expect, test } from 'vitest'

import { narrow } from './narrow'

test('narrow', () => {
  expect(narrow('foo')).toMatchInlineSnapshot('"foo"')
})
