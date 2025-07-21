import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Rotas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Rotas protegidas
router.get('/me', authenticateToken, authController.me);

export default router;
