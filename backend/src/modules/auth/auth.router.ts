import { Router } from 'express';
import { validate } from '../../shared/middleware/validate.middleware';
import * as authController from './auth.controller';
import { registerSchema, loginSchema } from './auth.schemas';

const router = Router();

router.post('/register', validate(registerSchema), authController.registerHandler);