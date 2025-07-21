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

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Token de acesso requerido'
    });
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
    next();
  } catch (err) {
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
