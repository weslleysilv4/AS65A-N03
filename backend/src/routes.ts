import { Router } from 'express';
import categoryRoutes from './modules/categories/categories.router';

const router = Router();

router.use('/categories', categoryRoutes);

export default router;
