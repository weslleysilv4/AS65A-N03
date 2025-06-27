import { BaseError } from './BaseError';

export class InternalServerError extends BaseError {
  constructor(error: Error, message?: string) {
    super(500, 'internal', message);

    console.log({
      message: error.message,
      stackTrace: error.stack,
      level: 'fatal',
    });
  }
}
