import { default as fse } from 'fs-extra'
import type { Options } from 'tsup'

import { exec } from 'child_process'
import path from 'path'

type GetConfig = Omit<
  Options,
  'bundle' | 'clean' | 'dts' | 'entry' | 'format' | 'target'
> & {
  entry?: string[]
  dev?: boolean
  noExport?: string[]
}

export function getConfig({ dev, noExport, ...options }: GetConfig): Options {
  if (!options.entry?.length) throw new Error('entry is required')
  const entry: string[] = options.entry ?? []

  // Hacks tsup to create Preconstruct-like linked packages for development
  // https://github.com/preconstruct/preconstruct
  if (dev) {
    const entry: string[] = options.entry ?? []
    return {
      clean: true,
      dts: false,
      // Only need to generate one file with tsup for development since we will create links in `onSuccess`
      entry: [entry[0] as string],
      format: ['esm', 'cjs'],
      silent: true,
      async onSuccess() {
        // remove all files in dist
        await fse.emptyDir('dist')
        // symlink files and type definitions
        for (const file of entry) {
          const filePath = path.resolve(file)
          const distSourceFile = filePath
            .replace(file, file.replace('src/', 'dist/'))
            .replace(/\.ts$/, '.js')
          // Make sure directory exists
          await fse.ensureDir(path.dirname(distSourceFile))
          // Create symlink between source and dist file
          await fse.symlink(filePath, distSourceFile, 'file')
          // Create file linking up type definitions
          const srcTypesFile = path
            .relative(path.dirname(distSourceFile), filePath)
            .replace(/\.ts$/, '')
          await fse.outputFile(
            distSourceFile.replace(/\.js$/, '.d.ts'),
            `export * from '${srcTypesFile}'`,
          )
          await fse.symlink(
            filePath,
            distSourceFile.replace('.js', '.mts'),
            'file',
          )
        }
        const exports = await generateExports(entry, { dev: true, noExport })
        await generateProxyPackages(exports, { dev: true })
      },
    }
  }

  return {
    bundle: true,
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
    splitting: true,
    target: 'es2021',
    async onSuccess() {
      if (typeof options.onSuccess === 'function') await options.onSuccess()
      else if (typeof options.onSuccess === 'string') exec(options.onSuccess)

      const exports = await generateExports(entry, { noExport })
      await generateProxyPackages(exports)
    },
    ...options,
  }
}

type Exports = {
  [key: string]: string | { types?: string; module: string; default: string }
}

/**
 * Generate exports from entry files
 */
async function generateExports(
  entry: string[],
  { dev, noExport }: { dev?: boolean; noExport?: string[] } = {},
) {
  const exports: Exports = {}
  for (const file of entry) {
    if (noExport?.includes(file)) continue
    const extension = path.extname(file)
    const fileWithoutExtension = file.replace(extension, '')
    const name = fileWithoutExtension
      .replace(/^src\//g, './')
      .replace(/\/index$/, '')
    const distCjsFile = `${fileWithoutExtension.replace(
      /^src\//g,
      './dist/',
    )}.js`
    const distEsmFile = `${fileWithoutExtension.replace(
      /^src\//g,
      './dist/',
    )}.${dev ? 'mts' : 'mjs'}`
    const distTypesFile = `${fileWithoutExtension.replace(
      /^src\//g,
      './dist/',
    )}.d.ts`
    exports[name] = {
      types: distTypesFile,
      module: distEsmFile,
      default: distCjsFile,
    }
  }

  exports['./package.json'] = './package.json'

  const packageJson = await fse.readJSON('package.json')
  packageJson.exports = exports
  await fse.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2) + '\n',
  )

  return exports
}

/**
 * Generate proxy packages files for each export
 */
async function generateProxyPackages(
  exports: Exports,
  { dev }: { dev?: boolean } = {},
) {
  const files = new Set<string>()
  for (const [key, value] of Object.entries(exports)) {
    if (typeof value === 'string') continue
    if (key === '.') continue
    if (!value.default) continue
    await fse.ensureDir(key)
    const entrypoint = path.relative(key, value.default)
    const fileExists = await fse.pathExists(value.default)
    if (!fileExists)
      throw new Error(
        `Proxy package "${key}" entrypoint "${entrypoint}" does not exist.`,
      )

    await fse.outputFile(
      `${key}/package.json`,
      JSON.stringify(
        {
          module: `${entrypoint.replace('.js', dev ? '.mts' : '.mjs')}`,
          main: entrypoint,
        },
        null,
        2,
      ),
    )
    const file = key.replace(/^\.\//g, '').split('/')[0]
    if (!file || files.has(file)) continue
    files.add(`/${file}`)
  }

  files.add('/dist')
  const packageJson = await fse.readJSON('package.json')
  packageJson.files = [...files.values()]
  await fse.writeFile(
    'package.json',
    JSON.stringify(packageJson, null, 2) + '\n',
  )
}
