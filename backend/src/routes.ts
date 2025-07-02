import { Router } from 'express';
import categoryRoutes from './modules/categories/categories.router';
import authRoutes from './modules/auth/auth.router';
import publisherRoutes from './modules/publisher/publisher.routes';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

router.use('/categories', categoryRoutes);
router.use('/publisher', publisherRoutes);
router.use('/auth', authRoutes);

export default router;
