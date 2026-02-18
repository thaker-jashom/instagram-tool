import { Router } from 'express';
import { loginController, registerController, getMeController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * Auth Routes
 */
router.post('/register', registerController);
router.post('/login', loginController);
router.get('/me', authenticate, getMeController);


export default router;