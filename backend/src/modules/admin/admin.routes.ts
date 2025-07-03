import { Router } from "express";
import {
  getPendingChangesHandler,
  approveChangeHandler,
  rejectChangeHandler,
  getAllNewsHandler,
} from './admin.controller';
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { roleMiddleware } from "../../shared/middleware/roles.middleware";
import { validate } from "../../shared/middleware/validate.middleware";
import { 
  rejectChangeSchema, 
  listNewsQuerySchema 
} from './admin.schemas';

const router = Router();

// Rotas para gerenciamento de mudanças pendentes
router.get(
  '/changes/pending',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  getPendingChangesHandler
);

router.post(
  '/changes/:id/approve',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  approveChangeHandler
);

router.post(
  '/changes/:id/reject',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(rejectChangeSchema),
  rejectChangeHandler
);

// Rotas para gerenciamento de notícias
router.get(
  '/news',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  validate(listNewsQuerySchema),
  getAllNewsHandler
);

export default router;