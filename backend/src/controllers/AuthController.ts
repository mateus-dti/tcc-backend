import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginData, CreateUserData } from '../models/User';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserData = req.body;

      // Validações básicas
      if (!userData.name || !userData.email || !userData.password) {
        res.status(400).json({
          success: false,
          error: 'Nome, email e senha são obrigatórios'
        });
        return;
      }

      if (userData.password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'A senha deve ter pelo menos 6 caracteres'
        });
        return;
      }

      const result = await this.authService.register(userData);

      res.status(201).json({
        success: true,
        data: result,
        message: 'Usuário registrado com sucesso'
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        next(error);
      }
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginData = req.body;

      // Validações básicas
      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          error: 'Email e senha são obrigatórios'
        });
        return;
      }

      const result = await this.authService.login(loginData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login realizado com sucesso'
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          error: error.message
        });
      } else {
        next(error);
      }
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Usuário não autenticado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: req.user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'Token é obrigatório'
        });
        return;
      }

      const newToken = await this.authService.refreshToken(token);

      if (!newToken) {
        res.status(401).json({
          success: false,
          error: 'Token inválido ou expirado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          token: newToken
        },
        message: 'Token renovado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  };
}
