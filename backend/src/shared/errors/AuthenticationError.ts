import { BaseError } from './BaseError';
import errorCodes from './errorCodes.json';

type AuthCause = keyof typeof errorCodes.auth;

export class AuthenticationError extends BaseError {
  constructor(cause: AuthCause, message?: string) {
    super(401, `auth.${cause}`, message);
  }
}
