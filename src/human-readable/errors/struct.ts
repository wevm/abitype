import { BaseError } from '../../errors.js'

export class CircularReferenceError extends BaseError {
  override name = 'CircularReferenceError'

  constructor({ type }: { type: string }) {
    super('Circular reference detected.', {
      metaMessages: [`Struct "${type}" is a circular reference.`],
    })
  }
}

export class MissingNamedParameter extends BaseError {
  override name = 'MissingNamedParameter'

  constructor({ type }: { type: string }) {
    super('Missing named parameter for EIP-712 typed data.', {
      metaMessages: [`named parameter for type ${type} must be present.`],
    })
  }
}
