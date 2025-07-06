import { Router } from 'express';
import { listPublishedNewsQuerySchema } from './news.schemas';
import { validate } from '../../shared/middleware/validate.middleware';
import { getPublishedNewsHandler, getPublishedNewsByIdHandler, registerNewsViewHandler } from './news.controller';

const router = Router();

router.get('/', validate(listPublishedNewsQuerySchema), getPublishedNewsHandler);
router.get('/:id', getPublishedNewsByIdHandler);
router.post('/:id/view', registerNewsViewHandler);

export default router; 