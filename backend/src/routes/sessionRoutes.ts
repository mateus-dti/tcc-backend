import { Router } from 'express';
import { SessionController } from '../controllers/SessionController';

const router = Router();
const sessionController = new SessionController();

// Health check (deve vir antes das rotas com parâmetros)
router.get('/sessions/health', sessionController.healthCheck);

// Session management routes
router.post('/sessions', sessionController.createSession);
router.get('/sessions/:sessionId', sessionController.getSession);
router.delete('/sessions/:sessionId', sessionController.deleteSession);
router.put('/sessions/:sessionId/extend', sessionController.extendSession);

// User sessions
router.get('/users/:userId/sessions', sessionController.getUserSessions);

// Message management within sessions
router.get('/sessions/:sessionId/messages', sessionController.getSessionMessages);
router.post('/sessions/:sessionId/messages', sessionController.addMessage);

export default router;
