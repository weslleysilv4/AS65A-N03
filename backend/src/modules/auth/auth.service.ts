import { AuthenticationError } from '../../shared/errors/AuthenticationError';
import { InternalServerError } from '../../shared/errors/InternalServerError';
import { supabase } from '../../shared/lib/supabase';

/**
 * Registers a new user in the system using Supabase authentication.
 *
 * @param {Object} input - The user registration data
 * @param {string} input.email - The user's email address (must be unique)
 * @param {string} input.password - The user's password (minimum 8 characters)
 * @param {string} input.name - The user's full name (minimum 3 characters)
 * @returns {Promise<Object>} Returns the user data from Supabase after successful registration
 * @throws {Error} Throws an error if the email is already registered or if registration fails
 *
 * @example
 * ```typescript
 * const userData = await registerUser({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   name: 'John Doe'
 * });
 * ```
 */
export const registerUser = async (input: {
  email: string;
  password: string;
  name: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: 'PUBLISHER',
      },
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new AuthenticationError('emailAlreadyExists');
    }
    if (error.message.includes('is invalid')) {
      throw new AuthenticationError('invalidCredentials');
    }
    throw new InternalServerError(error);
  }

  return data;
};

/**
 * Logs in a user using Supabase authentication.
 *
 * @param {Object} input - The login credentials
 * @param {string} input.email - The user's email address
 * @param {string} input.password - The user's password
 * @returns {Promise<Object>} Returns the user data from Supabase after successful login
 * @throws {Error} Throws an error if the email or password is invalid
 *
 * @example
 * ```typescript
 * const userData = await loginUser({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
export const loginUser = async (input: { email: string; password: string }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw new AuthenticationError('invalidCredentials');
  }

  return data;
};

/**
 * Logs out the current user using Supabase authentication.
 *
 * @returns {Promise<boolean>} Returns true if the logout is successful, otherwise throws an error
 * @throws {Error} Throws an error if the logout fails
 *
 * @example
 * ```typescript
 * const success = await logoutUser();
 * ```
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AuthenticationError('logoutFailed');
  }

  return true;
};

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new InternalServerError(error);
  }

  return data;
};
