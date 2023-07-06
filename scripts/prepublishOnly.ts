import { readJsonSync, writeJsonSync } from 'fs-extra'
import path from 'path'

// Generates a package.json to be published to NPM with only the necessary fields.
const packageJsonPath = path.join(__dirname, '../package.json')
const tmpPackageJson = readJsonSync(packageJsonPath)

writeJsonSync(`${packageJsonPath}.tmp`, tmpPackageJson, { spaces: 2 })

const {
  ['simple-git-hooks']: _sgh,
  devDependencies: _dD,
  packageManager: _pM,
  pnpm: _p,
  scripts: _s,
  // NOTE: We explicitly don't want to publish the type field. We create a separate package.json for `dist/cjs` and `dist/esm` that has the type field.
  type: _t,
  ...rest
} = tmpPackageJson
writeJsonSync(packageJsonPath, rest, { spaces: 2 })
