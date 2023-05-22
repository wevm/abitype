import { BaseError } from '../../errors.js'

export class CircularReferenceError extends BaseError {
  override name = 'CircularReferenceError'

  constructor({ type }: { type: string }) {
    super('Circular reference detected.', {
      metaMessages: [`Struct "${type}" is a circular reference.`],
    })
  }
}

export class MissingSemicolonError extends BaseError {
  override name = 'MissingSemicolonError'

  constructor({ props }: { props: string }) {
    super('Missing closing semicolon.', {
      metaMessages: [`Struct properties "${props}" <- is missing a semicolon.`],
    })
  }
}
