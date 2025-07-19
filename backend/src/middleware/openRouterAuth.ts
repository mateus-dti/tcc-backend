import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  apiKey?: string;
}

/**
 * Middleware para validar API key do OpenRouter
 * Opcional - use apenas se quiser proteger os endpoints
 */
export const validateOpenRouterKey = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-openrouter-key'] as string || req.body.apiKey;
  
  if (!apiKey && !process.env.OPENROUTER_API_KEY) {
    res.status(400).json({
      success: false,
      error: 'OpenRouter API key is required. Provide via X-OpenRouter-Key header or apiKey in body.'
    });
    return;
  }
  
  req.apiKey = apiKey;
  next();
};

/**
 * Middleware para rate limiting básico
 * Implementação simples - em produção use Redis ou similar
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitMiddleware = (requestsPerMinute: number = 60) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minuto
    
    const clientData = requestCounts.get(clientIp);
    
    if (!clientData || now > clientData.resetTime) {
      requestCounts.set(clientIp, {
        count: 1,
        resetTime: now + windowMs
      });
      next();
      return;
    }
    
    if (clientData.count >= requestsPerMinute) {
      res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
      });
      return;
    }
    
    clientData.count++;
    next();
  };
};
