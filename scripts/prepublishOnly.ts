import { readJsonSync, writeJsonSync } from 'fs-extra'

import path from 'path'

// Generates a package.json to be published to NPM with only the necessary fields.
;(function generatePackageJson() {
  const packageJsonPath = path.join(__dirname, '../package.json')
  const tmpPackageJson = readJsonSync(packageJsonPath)

  writeJsonSync(`${packageJsonPath}.tmp`, tmpPackageJson, { spaces: 2 })
  writeJsonSync(
    packageJsonPath,
    {
      name: tmpPackageJson.name,
      description: tmpPackageJson.description,
      license: tmpPackageJson.license,
      version: tmpPackageJson.version,
      repository: tmpPackageJson.repository,
      authors: tmpPackageJson.authors,
      ethereum: tmpPackageJson.ethereum,
      type: tmpPackageJson.type,
      types: tmpPackageJson.types,
      main: tmpPackageJson.main,
      module: tmpPackageJson.module,
      exports: tmpPackageJson.exports,
      files: tmpPackageJson.files,
      sideEffects: tmpPackageJson.sideEffects,
      peerDependencies: tmpPackageJson.peerDependencies,
      peerDependenciesMeta: tmpPackageJson.peerDependenciesMeta,
      keywords: tmpPackageJson.keywords,
    },
    { spaces: 2 },
  )
})()
