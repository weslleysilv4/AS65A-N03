import { BaseError } from './BaseError';
import errorCodes from './errorCodes.json';

type NotFoundCause = keyof typeof errorCodes.notFound;

export class NotFoundError extends BaseError {
  constructor(cause: NotFoundCause, message?: string) {
    super(404, `notFound.${cause}`, message);
  }
}

