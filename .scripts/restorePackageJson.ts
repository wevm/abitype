import fs from 'node:fs/promises'

// Restores package.json files from package.json.tmp files.

console.log('Restoring package.json.')

const packagePath = 'package.json'

type Package = { name?: string | undefined } & Record<string, unknown>
const file = Bun.file(packagePath)
const packageJson = (await file.json()) as Package

await Bun.write(
  packagePath.replace('.tmp', ''),
  `${JSON.stringify(packageJson, undefined, 2)}\n`,
)
await fs.rm(packagePath)
