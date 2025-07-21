import { User, CreateUserData, UpdateUserData, sanitizeUser } from '../models/User';
import bcrypt from 'bcryptjs';

export class UserService {
  private users: User[] = [];
  private nextId: number = 1;

  // Simular dados iniciais
  constructor() {
    this.users = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k8Y7tZO2', // senha: 123456
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj7.k8Y7tZO2', // senha: 123456
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.nextId = 3;
  }

  async getAllUsers(): Promise<User[]> {
    // Retornar usuários sem senhas
    return this.users.map(user => sanitizeUser(user));
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id);
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email);
    return user || null;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    // Verificar se o email já existe
    const existingUser = this.users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('Usuário com este email já existe');
    }

    const newUser: User = {
      id: this.nextId.toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // Já deve vir hasheada do AuthService
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    this.nextId++;

    return newUser;
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    // Verificar se o novo email já existe (se fornecido)
    if (userData.email) {
      const existingUser = this.users.find(user => user.email === userData.email && user.id !== id);
      if (existingUser) {
        throw new Error('Usuário com este email já existe');
      }
    }

    const updatedUser: User = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<User | null> {
    const userIndex = this.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    const deletedUser = this.users[userIndex];
    this.users.splice(userIndex, 1);
    
    return deletedUser;
  }
}
