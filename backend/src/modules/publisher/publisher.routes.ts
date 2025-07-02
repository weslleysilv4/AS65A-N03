import { Router } from 'express';
import {
  getPublishedNewsHandler,
  getPendingChangesHandler,
  requestNewsCreationHandler,
  requestNewsUpdateHandler,
} from './publisher.controller';
import { authMiddleware } from '../../shared/middleware/auth.middleware';
import { validate } from '../../shared/middleware/validate.middleware';
import { createNewsSchema, updateNewsSchema } from './publisher.schemas';

const router = Router();

router.get('/news', authMiddleware, getPublishedNewsHandler);
router.get('/changes', authMiddleware, getPendingChangesHandler);
router.post(
  '/changes',
  authMiddleware,
  validate(createNewsSchema),
  requestNewsCreationHandler
);
router.put(
  '/changes/:id',
  authMiddleware,
  validate(updateNewsSchema),
  requestNewsUpdateHandler
);

export default router;
