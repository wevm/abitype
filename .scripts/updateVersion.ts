import path from 'node:path'

// Updates package version.ts file (so you can use the version in code without importing package.json).

console.log('Updating version file.')

const packagePath = 'package.json'

type Package = {
  name?: string | undefined
  private?: boolean | undefined
  version?: string | undefined
}
const file = Bun.file(packagePath)
const packageJson = (await file.json()) as Package

const versionFilePath = path.resolve(
  path.dirname(packagePath),
  'src',
  'version.ts',
)
await Bun.write(
  versionFilePath,
  `export const version = '${packageJson.version}'\n`,
)
