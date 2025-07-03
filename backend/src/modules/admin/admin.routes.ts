import { Router } from "express";
import {
  getPendingChangesHandler,
  approveChangeHandler,
} from './admin.controller';
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { roleMiddleware } from "../../shared/middleware/roles.middleware";

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

export default router;