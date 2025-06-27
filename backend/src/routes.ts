import { Router } from 'express';
import categoryRoutes from './modules/categories/categories.router';
import authRoutes from './modules/auth/auth.router';

const router = Router();

router.use('/categories', categoryRoutes);
router.use('/auth', authRoutes);

export default router;
