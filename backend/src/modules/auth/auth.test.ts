import { Request, Response } from 'express';
import { registerHandler } from './auth.controller';
import * as authService from './auth.service';

// Helper to create mock Request object
const mockRequest = (body: any): Partial<Request> => ({ body });

// Helper to create mock Response object with chainable methods
const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

jest.mock('./auth.service');

describe('Auth Controller - registerHandler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 and user data on successful registration', async () => {
    const userData = { id: '123', email: 'test@example.com' } as any;
    (authService.registerUser as jest.Mock).mockResolvedValueOnce(userData);

    const req = mockRequest({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
    const res = mockResponse();

    await registerHandler(req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message:
        'Usuário cadastrado com sucesso, verifique seu email para ativar sua conta',
      user: userData,
    });
  });

  it('should return 409 when email is already registered', async () => {
    (authService.registerUser as jest.Mock).mockRejectedValueOnce(
      new Error('Este email já está cadastrado')
    );

    const req = mockRequest({
      email: 'duplicate@example.com',
      password: 'password123',
      name: 'Duplicate User',
    });
    const res = mockResponse();

    await registerHandler(req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Este email já está cadastrado',
    });
  });

  it('should return 500 on internal server errors', async () => {
    (authService.registerUser as jest.Mock).mockRejectedValueOnce(
      new Error('Unexpected error')
    );

    const req = mockRequest({
      email: 'error@example.com',
      password: 'password123',
      name: 'Error User',
    });
    const res = mockResponse();

    await registerHandler(req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erro interno do servidor',
    });
  });

  it('should call registerUser with the provided request body', async () => {
    const body = {
      email: 'calltest@example.com',
      password: 'password123',
      name: 'Call Test',
    };
    (authService.registerUser as jest.Mock).mockResolvedValueOnce({ id: '1' });

    const req = mockRequest(body);
    const res = mockResponse();

    await registerHandler(req as Request, res as Response, jest.fn());

    expect(authService.registerUser).toHaveBeenCalledWith(body);
  });

  it('should return 201 even if registerUser returns null user data', async () => {
    (authService.registerUser as jest.Mock).mockResolvedValueOnce(null);

    const req = mockRequest({
      email: 'nulluser@example.com',
      password: 'password123',
      name: 'Null User',
    });
    const res = mockResponse();

    await registerHandler(req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message:
        'Usuário cadastrado com sucesso, verifique seu email para ativar sua conta',
      user: null,
    });
  });

  it('should return 500 if an error without a message property is thrown', async () => {
    (authService.registerUser as jest.Mock).mockRejectedValueOnce({});

    const req = mockRequest({
      email: 'nomessage@example.com',
      password: 'password123',
      name: 'No Message',
    });
    const res = mockResponse();

    await registerHandler(req as Request, res as Response, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erro interno do servidor',
    });
  });
});
