import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { SessionService } from '../services/SessionService';

export class UserController {
  private userService: UserService;
  private sessionService: SessionService;

  constructor() {
    this.userService = new UserService();
    this.sessionService = new SessionService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const newUser = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        data: newUser,
        message: 'Usuário criado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const updatedUser = await this.userService.updateUser(id, userData);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'Usuário atualizado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedUser = await this.userService.deleteUser(id);
      
      if (!deletedUser) {
        res.status(404).json({
          success: false,
          error: 'Usuário não encontrado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Usuário deletado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  };

  getUserSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const sessions = await this.sessionService.getUserSessions(userId);
      
      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  };
}
