import request from 'supertest';
import app from '../../app';
import { supabase } from '../../shared/lib/supabase';
import errorCodes from '../../shared/errors/errorCodes.json';
import errorMessages from '../../shared/errors/errorMessages.json';

jest.mock('../../shared/lib/supabase');

const mockedSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Auth Module', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully and return 201', async () => {
      (mockedSupabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
        data: {
          user: { id: 'some-uuid', email: 'test@example.com' } as any,
          session: {} as any,
        },
        error: null,
      });

      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(
        'Usuário cadastrado com sucesso, verifique seu email para ativar sua conta'
      );
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should return 401 if email is already registered', async () => {
      (mockedSupabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'User already registered',
          name: 'AuthApiError',
          status: 400,
        },
      });

      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(errorMessages.auth.emailAlreadyExists);
      expect(response.body.errorCode).toBe(errorCodes.auth.emailAlreadyExists);
    });

    it('should return 500 on unexpected error during registration', async () => {
      (mockedSupabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Unexpected error',
          name: 'UnknownError',
          status: 500,
        },
      });

      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'error@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Erro interno do servidor');
      expect(response.body.errorCode).toBe(errorCodes.internal);
    });

    it('should return 400 for invalid input data', async () => {
      const response = await request(app).post('/api/auth/register').send({
        // Missing email and password
        name: 'Test User',
      });

      expect(response.status).toBe(400);
      // The actual message and error code will depend on the validation middleware
      // which uses Zod. We expect some form of validation error.
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user successfully and return 200', async () => {
      (
        mockedSupabase.auth.signInWithPassword as jest.Mock
      ).mockResolvedValueOnce({
        data: {
          user: { id: 'some-uuid', email: 'test@example.com' } as any,
          session: { access_token: 'some-jwt' } as any,
        },
        error: null,
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.user.user.email).toBe('test@example.com');
      expect(response.body.user.session.access_token).toBe('some-jwt');
    });

    it('should return 401 for invalid credentials', async () => {
      (
        mockedSupabase.auth.signInWithPassword as jest.Mock
      ).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: {
          message: 'Invalid login credentials',
          name: 'AuthApiError',
          status: 400,
        },
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(errorMessages.auth.invalidCredentials);
      expect(response.body.errorCode).toBe(errorCodes.auth.invalidCredentials);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout a user successfully and return 200', async () => {
      (mockedSupabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
        error: null,
      });

      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuário deslogado com sucesso');
    });

    it('should return 401 if logout fails', async () => {
      (mockedSupabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
        error: {
          message: 'Logout failed',
          name: 'AuthApiError',
          status: 500,
        },
      });

      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe(errorMessages.auth.logoutFailed);
      expect(response.body.errorCode).toBe(errorCodes.auth.logoutFailed);
    });
  });
});
