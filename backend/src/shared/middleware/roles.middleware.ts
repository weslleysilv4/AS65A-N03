import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export const roleMiddleware = (allowedRoles: Role[]) => {
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
