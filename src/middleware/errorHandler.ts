import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  console.error(err);

  if (err.name === 'ValidationError') {
    const message = 'Dados inválidos fornecidos';
    error = createError(message, 400);
  }

  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = createError(message, 404);
  }

  if (err.message.includes('duplicate key')) {
    const message = 'Recurso já existe';
    error = createError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const createError = (message: string, statusCode: number): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
