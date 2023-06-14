import { expectTypeOf, test } from 'vitest'

import type { AbiParameter } from '../abi.js'
import type { Flatten } from '../types.js'
import type {
  ParseAbiParameters,
  ValidateAbiParameters,
} from './parseAbiParameters.js'
import { parseAbiParameters } from './parseAbiParameters.js'

test('ValidateAbiParameters', () => {
  expectTypeOf<ValidateAbiParameters<['address']>>().toEqualTypeOf<
    [
      'Error: No Struct signature found. Please provide valid struct signatures.',
    ]
  >()
  expectTypeOf<
    ValidateAbiParameters<['struct Foo { string name; }', 'address']>
  >().toEqualTypeOf<[]>()
  expectTypeOf<
    Flatten<ValidateAbiParameters<['struct Foo { string name; }', 'address']>>
  >().toEqualTypeOf<[]>()
  // expectTypeOf<
  //   Flatten<ValidateAbiParameters<["struct Foo { string name; }", "Bar"]>>
  // >().toEqualTypeOf<["Error: Invalid Parameter \"Bar\". No valid type."]>();
})
test('ParseAbiParameters', () => {
  expectTypeOf<ParseAbiParameters<''>>().toEqualTypeOf<never>()
  expectTypeOf<ParseAbiParameters<[]>>().toEqualTypeOf<never>()
  expectTypeOf<
    ParseAbiParameters<['struct Foo { string name; }']>
  >().toEqualTypeOf<never>()

  // string
  expectTypeOf<
    ParseAbiParameters<'address from, address to, uint256 amount'>
  >().toEqualTypeOf<
    readonly [
      {
        readonly type: 'address'
        readonly name: 'from'
      },
      {
        readonly type: 'address'
        readonly name: 'to'
      },
      {
        readonly type: 'uint256'
        readonly name: 'amount'
      },
    ]
  >()
  expectTypeOf<
    ParseAbiParameters<'address indexed from, address indexed to, uint256 indexed amount'>
  >().toEqualTypeOf<
    readonly [
      {
        readonly type: 'address'
        readonly name: 'from'
        readonly indexed: true
      },
      {
        readonly type: 'address'
        readonly name: 'to'
        readonly indexed: true
      },
      {
        readonly type: 'uint256'
        readonly name: 'amount'
        readonly indexed: true
      },
    ]
  >()
  expectTypeOf<
    ParseAbiParameters<'address[] calldata foo, address[] memory bar, uint256[] storage baz'>
  >().toEqualTypeOf<
    readonly [
      {
        readonly type: 'address[]'
        readonly name: 'foo'
      },
      {
        readonly type: 'address[]'
        readonly name: 'bar'
      },
      {
        readonly type: 'uint256[]'
        readonly name: 'baz'
      },
    ]
  >()

  // Array
  expectTypeOf<
    ParseAbiParameters<['Foo, bytes32', 'struct Foo { string name; }']>
  >().toEqualTypeOf<
    readonly [
      {
        readonly type: 'tuple'
        readonly components: readonly [
          {
            readonly name: 'name'
            readonly type: 'string'
          },
        ]
      },
      { readonly type: 'bytes32' },
    ]
  >()
})

test('parseAbiParameters', () => {
  // @ts-expect-error empty array not allowed
  expectTypeOf(parseAbiParameters([])).toEqualTypeOf<never>()
  expectTypeOf(
    // @ts-expect-error invalid no parameter given
    parseAbiParameters(['struct Foo { string name; }']),
  ).toEqualTypeOf<never>()

  expectTypeOf(
    parseAbiParameters(['struct Foo { string name; }', 'address']),
  ).toEqualTypeOf<readonly [{ readonly type: 'address' }]>()

  expectTypeOf(
    // This will fail in strict mode
    parseAbiParameters(['struct Foo { string name; }', 'Bar']),
  ).toEqualTypeOf<readonly [{ readonly type: 'Bar' }]>()

  // expectTypeOf(
  //   // @ts-expect-error not a valid type
  //   parseAbiParameters(["struct Foo { string name; }", "Bar"])
  // ).toEqualTypeOf<never>();

  expectTypeOf(parseAbiParameters('(string)')).toEqualTypeOf<
    readonly [
      {
        readonly type: 'tuple'
        readonly components: readonly [{ readonly type: 'string' }]
      },
    ]
  >()

  const param: string = 'address, string'
  expectTypeOf(parseAbiParameters(param)).toEqualTypeOf<
    readonly AbiParameter[]
  >()
})
