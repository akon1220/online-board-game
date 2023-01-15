export class BaseError {
  constructor() {
    // eslint-disable-next-line prefer-rest-params
    Error.apply(this, arguments as never)
  }
}

BaseError.prototype = new Error()
