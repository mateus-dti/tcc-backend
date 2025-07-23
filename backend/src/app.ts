import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import routes from './routes';
import { RedisConfig } from './config/redis';

dotenv.config();

console.log('🔧 Dotenv loaded - JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Initialize Redis connection
const initializeRedis = async () => {
  try {
    const redis = RedisConfig.getInstance();
    await redis.connect();
    console.log('✅ Redis initialized successfully');
  } catch (error) {
    console.warn('⚠️  Redis connection failed - session features will be disabled');
    console.warn('   Make sure Redis is running: docker-compose up -d');
    console.warn('   Error:', error instanceof Error ? error.message : String(error));
  }
};

// Initialize Redis on startup (non-blocking)
initializeRedis();

app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.CORS_ORIGIN || ''
  ].filter(origin => origin !== ''),
  credentials: true,
}));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Endpoint de debug para testar tokens
app.get('/debug/token', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  res.json({
    hasAuthHeader: !!authHeader,
    authHeaderPreview: authHeader ? authHeader.substring(0, 20) + '...' : null,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
    jwtSecret: process.env.JWT_SECRET?.substring(0, 10) + '...'
  });
});

// Debug endpoint para gerar novo token
app.post('/debug/new-token', (req, res) => {
  const jwt = require('jsonwebtoken');
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  const payload = {
    id: '3',
    email: 'mateus@email.com',
    name: 'Mateus Silveira Ribeiro'
  };
  
  const newToken = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
  
  res.json({
    success: true,
    token: newToken,
    message: 'Novo token gerado para debug'
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
