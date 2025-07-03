import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.user_metadata?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res
        .status(403)
        .json({ message: 'Acesso negado: Permissão insuficiente' });
      return;
    }

    next();
  };
};
