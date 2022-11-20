import { describe, expect, it } from 'vitest'

import { Abi } from './zod'

describe('AbiSchema', () => {
  it('returns valid schema', () => {
    expect(
      Abi.parse([
        {
          inputs: [{ type: 'address' }],
          name: 'love',
          outputs: [{ type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "inputs": [
            {
              "type": "address",
            },
          ],
          "name": "love",
          "outputs": [
            {
              "type": "uint256",
            },
          ],
          "stateMutability": "view",
          "type": "function",
        },
      ]
    `)
  })

  it('throws error for invalid schema', async () => {
    await expect(
      Abi.parseAsync([
        {
          inputs: [{ type: 'notAValidType' }],
          name: 'love',
          outputs: [{ type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ]),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          \\"validation\\": \\"regex\\",
          \\"code\\": \\"invalid_string\\",
          \\"message\\": \\"Invalid\\",
          \\"path\\": [
            0,
            \\"inputs\\",
            0,
            \\"type\\"
          ]
        }
      ]"
    `)
  })
})
