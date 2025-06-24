
import { User, UserRole } from '../models/types';
import { generateId } from './types';
import { getCurrentUser, setCurrentUser, getDatabase } from './database';

export const authAPI = {
  signupEmail: async (role: UserRole, email: string, password: string): Promise<User> => {
    const { users } = getDatabase();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: generateId(),
      email,
      role,
      createdAt: new Date()
    };
    
    users.push(newUser);
    setCurrentUser(newUser);
    
    return newUser;
  },
  
  login: async (email: string, password: string): Promise<User> => {
    const { users } = getDatabase();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    setCurrentUser(user);
    return user;
  },
  
  logout: () => {
    setCurrentUser(null);
  },
  
  getCurrentUser,
  
  isAuthenticated: (): boolean => {
    return getCurrentUser() !== null;
  }
};
