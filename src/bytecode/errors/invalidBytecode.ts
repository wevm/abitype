import { BaseError } from '../../errors.js'

export class InvalidBytecodeError extends BaseError {
  override name = 'InvalidBytecodeError'

  constructor() {
    super('Invalid bytecode', {
      metaMessages: [
        'Cannot infer any values from the provided bytecode string.',
      ],
    })
  }
}
