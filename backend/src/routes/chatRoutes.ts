import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { rateLimitMiddleware } from '../middleware/openRouterAuth';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Aplicar rate limiting a todas as rotas de chat (60 requests por minuto)
router.use(rateLimitMiddleware(60));

// Rotas para gerenciamento de modelos (não requerem auth)
router.get('/models', ChatController.getModels);
router.get('/models/filtered', ChatController.getFilteredModels);

// Rotas para chat (não requerem auth - para testes simples)
router.post('/simple', ChatController.simpleChat);
router.post('/message', ChatController.sendMessage);
router.post('/conversation', ChatController.conversationChat);
router.post('/complete', ChatController.chatCompletion);

// Rotas para chat com sessões (requerem autenticação)
router.post('/session/start', authenticateToken, ChatController.startChatSession);
router.post('/session', authenticateToken, ChatController.sendSessionMessage);
// Rotas para chat com sessões (requerem autenticação)
router.post('/session/start', authenticateToken, ChatController.startChatSession);
router.post('/session', authenticateToken, ChatController.sendSessionMessage);
router.get('/session/:sessionId/history', authenticateToken, ChatController.getSessionHistory);

// Rotas utilitárias
router.post('/cost-estimate', ChatController.calculateCost);
router.get('/health', ChatController.healthCheck);

export default router;
