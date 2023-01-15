import { BaseError } from '@/base_error'

type ErrorTypes = 'no app' | 'already joined'

export class SocketAppException extends BaseError {
  type: ErrorTypes
  constructor(type: ErrorTypes) {
    super()
    this.type = type
  }
}
