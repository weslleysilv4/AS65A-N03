import get from 'lodash/get';

import errorCodes from './errorCodes.json';
import errorMessages from './errorMessages.json';

export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(statusCode: number, errorPath: string, message?: string) {
    super(message || get(errorMessages, errorPath));
    this.statusCode = statusCode;
    this.errorCode = get(errorCodes, errorPath, 'internal.unexpected');
  }

  getBody() {
    return {
      message: this.message,
      errorCode: this.errorCode,
    };
  }
}
