export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Opcional para não retornar em responses
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface UserResponse extends Omit<User, 'password'> {}

// Utility function to remove password from user object
export const sanitizeUser = (user: User): UserResponse => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};
