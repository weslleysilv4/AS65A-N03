import { RequestHandler } from 'express';
import * as authService from './auth.service';

/**
 * Handles user registration requests.
 *
 * @param {Request} req - Express request object containing user registration data
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a JSON response with registration status
 *
 * @throws {409} When email is already registered
 * @throws {500} When an internal server error occurs
 *
 * Expected request body:
 * - email: string (valid email format)
 * - password: string (minimum 8 characters)
 *
 * Success response (201):
 * - message: string
 * - user: object (user data from Supabase)
 */
export const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      message:
        'Usuário cadastrado com sucesso, verifique seu email para ativar sua conta',
      user,
    });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Handles user login requests.
 *
 * @param {Request} req - Express request object containing login credentials
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a JSON response with login status
 *
 * @throws {500} When an internal server error occurs
 *
 * Expected request body:
 * - email: string (valid email format)
 * - password: string (minimum 8 characters)
 *
 * Success response (200):
 * - user: object (user data from Supabase)
 */
export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const user = await authService.loginUser(req.body);
    res.status(200).json({ user });
  } catch (error: any) {
    next(error);
  }
};

/**
 * Handles user logout requests.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>} Returns a JSON response with logout status
 *
 * @throws {401} When an internal server error occurs
 *
 * Success response (200):
 * - message: string
 */
export const logoutHandler: RequestHandler = async (req, res, next) => {
  try {
    const success = await authService.logoutUser();
    res.status(200).json({ message: 'Usuário deslogado com sucesso' });
  } catch (error: any) {
    next(error);
  }
};
