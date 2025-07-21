import { Router } from 'express';
import userRoutes from './userRoutes';
import chatRoutes from './chatRoutes';
import sessionRoutes from './sessionRoutes';
import authRoutes from './authRoutes';
// import modelRoutes from './modelRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/chat', chatRoutes);
router.use('/', sessionRoutes);
// router.use('/models', modelRoutes);

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API do TCC funcionando!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      chat: '/api/chat',
      sessions: '/api/sessions',
    },
  });
});

export default router;
