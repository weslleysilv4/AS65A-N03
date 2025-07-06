import { Request, Response, NextFunction, RequestHandler } from 'express';
import { supabase } from '../lib/supabase';

export const authMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Acesso negado: Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    res
      .status(401)
      .json({ message: 'Acesso negado: Token inválido ou expirado' });
    return;
  }

  (req as any).user = user;
  next();
};
