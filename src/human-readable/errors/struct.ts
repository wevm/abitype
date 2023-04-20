import { BaseError } from '../../errors'

export class CircularReferenceError extends BaseError {
  override name = 'CircularReferenceError'

  constructor({ type }: { type: string }) {
    super('Circular reference detected.', {
      metaMessages: [`Struct "${type}" is a circular reference.`],
    })
  }
}
