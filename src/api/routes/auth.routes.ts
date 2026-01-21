import { Router } from 'express';
import { loginController } from '../controllers/auth.controller';

const router = Router();

/**
 * Auth Routes
 */
router.post('/login', loginController);


export default router;