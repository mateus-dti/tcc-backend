import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from './UserService';
import { LoginData, AuthResponse, CreateUserData, sanitizeUser } from '../models/User';

export class AuthService {
  private userService: UserService;
  private jwtSecret: string;
  private jwtExpiresIn: string | number;

  constructor() {
    this.userService = new UserService();
    // Força a leitura do .env
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    console.log('🔧 AuthService constructor - JWT_SECRET from env:', process.env.JWT_SECRET);
    console.log('🔧 AuthService constructor - jwtSecret usado:', this.jwtSecret);
  }

  private generateToken(userId: string, email: string, name: string): string {
    // Sempre pega o secret mais atual do process.env
    const currentSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    const payload = { 
      id: userId, 
      email, 
      name 
    };
    
    console.log('🔑 Generating token with secret:', currentSecret.substring(0, 10) + '...');
    console.log('🔑 Full JWT_SECRET from env:', process.env.JWT_SECRET);
    console.log('🔑 AuthService using secret:', currentSecret);
    return jwt.sign(payload, currentSecret, { expiresIn: '7d' });
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async register(userData: CreateUserData): Promise<AuthResponse> {
    try {
      // Verificar se o usuário já existe
      const existingUser = await this.userService.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('Usuário com este email já existe');
      }

      // Hash da senha
      const hashedPassword = await this.hashPassword(userData.password);

      // Criar usuário
      const newUser = await this.userService.createUser({
        ...userData,
        password: hashedPassword
      });

      // Gerar token
      const token = this.generateToken(newUser.id, newUser.email, newUser.name);

      return {
        user: sanitizeUser(newUser),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      // Buscar usuário por email
      const user = await this.userService.getUserByEmail(loginData.email);
      if (!user || !user.password) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar senha
      const isPasswordValid = await this.comparePassword(loginData.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      // Gerar token
      const token = this.generateToken(user.id, user.email, user.name);

      return {
        user: sanitizeUser(user),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token: string): Promise<{ id: string; email: string; name: string } | null> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as {
        id: string;
        email: string;
        name: string;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async refreshToken(oldToken: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(oldToken, this.jwtSecret, { ignoreExpiration: true }) as {
        id: string;
        email: string;
        name: string;
      };

      // Verificar se o usuário ainda existe
      const user = await this.userService.getUserById(decoded.id);
      if (!user) {
        return null;
      }

      // Gerar novo token
      return this.generateToken(user.id, user.email, user.name);
    } catch (error) {
      return null;
    }
  }
}
