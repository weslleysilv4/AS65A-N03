import { Router } from 'express';
import { listPublishedNewsQuerySchema } from './news.schemas';
import { validate } from '../../shared/middleware/validate.middleware';
import { getPublishedNewsHandler, getPublishedNewsByIdHandler } from './news.controller';

const router = Router();

router.get('/', validate(listPublishedNewsQuerySchema), getPublishedNewsHandler);
router.get('/:id', getPublishedNewsByIdHandler);

export default router; 