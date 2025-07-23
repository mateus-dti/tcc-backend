import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Estender o tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  console.log('🔐 Auth middleware:', {
    authHeader: authHeader ? `${authHeader.substring(0, 20)}...` : 'Not provided',
    token: token ? `${token.substring(0, 20)}...` : 'Not provided',
    path: req.path,
    method: req.method
  });

  if (!token) {
    console.log('❌ No token provided');
    res.status(401).json({
      success: false,
      error: 'Token de acesso requerido'
    });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  
  console.log('🔍 Verificando token com secret:', jwtSecret.substring(0, 10) + '...');
  console.log('🔍 Full JWT_SECRET from env:', process.env.JWT_SECRET);
  console.log('🔍 Auth middleware jwtSecret:', jwtSecret);

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      name: string;
    };

    console.log('✅ Token válido para usuário:', decoded.email);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('❌ Token inválido:', err instanceof Error ? err.message : 'Unknown error');
    res.status(403).json({
      success: false,
      error: 'Token inválido ou expirado'
    });
    return;
  }
};

// Middleware opcional - não falha se não houver token
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
      name: string;
    };
    req.user = decoded;
  } catch (err) {
    // Silently fail for optional auth
  }
  
  next();
};
