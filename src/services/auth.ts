
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
    
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    console.log('User signed up and authenticated:', newUser);
    return newUser;
  },
  
  login: async (email: string, password: string): Promise<User> => {
    const { users } = getDatabase();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    setCurrentUser(user);
    
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
    
    console.log('User logged in:', user);
    return user;
  },
  
  logout: () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('selectedRole');
    console.log('User logged out');
  },
  
  getCurrentUser: (): User | null => {
    // First check memory
    let user = getCurrentUser();
    
    // If not in memory, check localStorage
    if (!user) {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        
        if (storedUser && isAuthenticated === 'true') {
          user = JSON.parse(storedUser);
          setCurrentUser(user); // Restore to memory
          console.log('User restored from localStorage:', user);
        }
      } catch (error) {
        console.error('Error restoring user from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
      }
    }
    
    return user;
  },
  
  isAuthenticated: (): boolean => {
    const user = authAPI.getCurrentUser();
    const isAuth = user !== null;
    console.log('Authentication check:', isAuth, user?.email || 'No user');
    return isAuth;
  }
};
