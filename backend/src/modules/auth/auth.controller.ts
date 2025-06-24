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
export const registerHandler: RequestHandler = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      message:
        'Usuário cadastrado com sucesso, verifique seu email para ativar sua conta',
      user,
    });
  } catch (error: any) {
    if (error.message === 'Este email já está cadastrado') {
      res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
