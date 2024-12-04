import { execSync } from 'node:child_process'
import path from 'node:path'
import { glob } from 'glob'

// Updates package version.ts files (so you can use the version in code without importing package.json).

console.log('Updating version files.')

// Get all package.json files
const packagePaths = await glob('**/package.json', {
  ignore: ['**/dist/**', '**/node_modules/**'],
})

let count = 0
for (const packagePath of packagePaths) {
  type Package = {
    name?: string | undefined
    private?: boolean | undefined
    version?: string | undefined
  }
  const file = Bun.file(packagePath)
  const packageJson = (await file.json()) as Package

  // Skip private packages
  if (packageJson.private) continue

  const version = (() => {
    if (Bun.env.PKG_PR_NEW) {
      const gitHash = execSync('git rev-parse --short HEAD').toString().trim()
      const branch = execSync('git branch --show-current')
        .toString()
        .trim()
        .replace(/[^a-zA-Z0-9]/g, '_')
      return `0.0.0-${branch}.${gitHash}`
    }
    return packageJson.version
  })()

  count += 1
  console.log(`${packageJson.name} — ${version}`)

  const versionFilePath = path.resolve(
    path.dirname(packagePath),
    'src',
    'version.ts',
  )
  await Bun.write(versionFilePath, `export const version = '${version}'\n`)

  const jsrFilePath = path.resolve(path.dirname(packagePath), 'jsr.json')
  const jsrJson = await Bun.file(jsrFilePath).json()
  jsrJson.version = version
  Bun.write(jsrFilePath, JSON.stringify(jsrJson, null, 2))
}

console.log(
  `Done. Updated version file for ${count} ${
    count === 1 ? 'package' : 'packages'
  }.`,
)
