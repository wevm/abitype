import { readJsonSync, writeJsonSync } from 'fs-extra'
import path from 'path'

// Generates a package.json to be published to NPM with only the necessary fields.
const packageJsonPath = path.join(__dirname, '../package.json')
const tmpPackageJson = readJsonSync(packageJsonPath)

writeJsonSync(`${packageJsonPath}.tmp`, tmpPackageJson, { spaces: 2 })

const {
  name,
  description,
  dependencies,
  peerDependencies,
  peerDependenciesMeta,
  version,
  files,
  exports: exports_,
  // NOTE: We explicitly don't want to publish the type field. We create a separate package.json for `dist/cjs` and `dist/esm` that has the type field.
  // type,
  main,
  module,
  types,
  typings,
  typesVersions,
  sideEffects,
  license,
  repository,
  authors,
  keywords,
} = tmpPackageJson
writeJsonSync(
  packageJsonPath,
  {
    name,
    description,
    dependencies,
    peerDependencies,
    peerDependenciesMeta,
    version,
    files,
    exports: exports_,
    // type,
    main,
    module,
    types,
    typings,
    typesVersions,
    sideEffects,
    license,
    repository,
    authors,
    keywords,
  },
  { spaces: 2 },
)
