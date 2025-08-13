import { User } from '../shared/types';
import { mockData } from '../mockData/data';

export interface AuthService {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export class MockAuthService implements AuthService {
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<User> {
    // Mock authentication - in real app, this would validate against Firebase Auth
    const user = mockData.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // For demo purposes, accept any password
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to restore from localStorage
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }

    return null;
  }
}