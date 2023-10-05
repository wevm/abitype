// Generates package.json to be published to NPM with only the necessary fields.

console.log('Formatting package.json.')

const packagePath = 'package.json'

type Package = Record<string, unknown> & {
  name?: string | undefined
  private?: boolean | undefined
}

const file = Bun.file(packagePath)
const packageJson = (await file.json()) as Package

await Bun.write(
  `${packagePath}.tmp`,
  `${JSON.stringify(packageJson, undefined, 2)}\n`,
)

const {
  'simple-git-hooks': _sgh,
  devDependencies: _dD,
  packageManager: _pM,
  pnpm: _p,
  scripts: _s,
  type: _t,
  ...rest
} = packageJson
await Bun.write(packagePath, `${JSON.stringify(rest, undefined, 2)}\n`)

console.log('Done. Formatted package.json')
