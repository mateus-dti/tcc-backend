import { User, CreateUserData, UpdateUserData } from '../models/User';

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.nextId = 3;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id);
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
