import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../packages/abitype/package.json')

export const version = pkg.version
