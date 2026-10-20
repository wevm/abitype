import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'
import { pathToFileURL } from 'node:url'

const root = import.meta.dirname
const compiler = join(root, 'node_modules/typescript-beta/bin/tsc')
const abi = readFileSync(join(root, 'token.abi'), 'utf8')

function compile(directory, args = []) {
  const result = spawnSync(
    process.execPath,
    [compiler, '--project', directory, '--pretty', 'false', ...args],
    { encoding: 'utf8', timeout: 30_000 },
  )
  assert.ifError(result.error)
  return { status: result.status, output: result.stdout + result.stderr }
}

test('ABIType infers literal names, mutability, and nested parameter tuples', () => {
  const result = compile(root, ['--runExternalCode'])
  assert.equal(result.status, 0, result.output)
})

test('executing a mapper requires explicit permission', () => {
  const result = compile(root)
  assert.notEqual(result.status, 0)
  assert.match(result.output, /require the.*runExternalCode/)
})

test('JSON controls and source diagnostics', async (t) => {
  const directory = mkdtempSync(join(root, '.test-'))
  t.after(() => rmSync(directory, { recursive: true, force: true }))
  const config = JSON.parse(readFileSync(join(root, 'tsconfig.json'), 'utf8'))
  const write = (file, content) => writeFileSync(join(directory, file), content)
  write('tsconfig.json', JSON.stringify(config))

  await t.test(
    'ordinary JSON remains widened and loads natively in Node',
    async () => {
      write('token.json', abi)
      write(
        'index.ts',
        `import abi from './token.json' with { type: 'json' }
const name: string = abi[0].name
// @ts-expect-error Ordinary JSON does not infer literal function names.
const literal: 'balanceOf' = abi[0].name
`,
      )
      const result = compile(directory, ['--runExternalCode'])
      assert.equal(result.status, 0, result.output)
      const { default: value } = await import(
        pathToFileURL(join(directory, 'token.json')).href,
        { with: { type: 'json' } }
      )
      assert.deepEqual(value, JSON.parse(abi))
    },
  )

  await t.test('.abi.json is rejected by TypeScript 7.1 beta', async () => {
    config.contentMappers[0].extensions = ['.abi.json']
    write('tsconfig.json', JSON.stringify(config))
    write('token.abi.json', abi)
    write(
      'index.ts',
      `import abi from './token.abi.json' with { type: 'json' }`,
    )
    const result = compile(directory, ['--runExternalCode'])
    assert.notEqual(result.status, 0)
    assert.match(result.output, /TS18066:.*'\.abi\.json'.*built-in extension/)
    // The filename is valid for Node; the restriction is in the compiler.
    const { default: value } = await import(
      pathToFileURL(join(directory, 'token.abi.json')).href,
      { with: { type: 'json' } }
    )
    assert.deepEqual(value, JSON.parse(abi))
    config.contentMappers[0].extensions = ['.abi']
    write('tsconfig.json', JSON.stringify(config))
  })

  await t.test('invalid JSON reports an error in the original file', () => {
    write('token.abi', '[invalid]')
    write('index.ts', `import abi from './token.abi'`)
    const result = compile(directory, ['--runExternalCode'])
    assert.notEqual(result.status, 0)
    assert.match(result.output, /token\.abi\(1,1\): error/)
    assert.match(result.output, /JSON/)
  })

  await t.test(
    'artifact objects are not silently treated as ABI arrays',
    () => {
      write('token.abi', JSON.stringify({ abi: JSON.parse(abi) }))
      const result = compile(directory, ['--runExternalCode'])
      assert.notEqual(result.status, 0)
      assert.match(result.output, /Expected a JSON ABI array/)
    },
  )

  await t.test('empty ABI arrays retain their tuple type', () => {
    write('token.abi', '[]\n')
    write(
      'index.ts',
      `import abi from './token.abi'
const empty: readonly [] = abi
`,
    )
    const result = compile(directory, ['--runExternalCode'])
    assert.equal(result.status, 0, result.output)
  })
})
