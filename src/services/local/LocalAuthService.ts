import { IAuthService } from '../interfaces/IAuthService';
import { User, AuthSession } from '@/types';
import { localStorageService } from './LocalStorageService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Local Auth Service
 * Implements authentication using localStorage
 * Session duration: 30 days
 */
export class LocalAuthService implements IAuthService {
  private readonly USERS_KEY = 'users';
  private readonly SESSIONS_KEY = 'sessions';
  private readonly CURRENT_SESSION_KEY = 'current_session';
  private readonly SESSION_DURATION_DAYS = 30;

  async signUp(email: string, password: string, displayName?: string): Promise<{ user: User; session: AuthSession }> {
    const users = localStorageService.getItem<User[]>(this.USERS_KEY) || [];
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      displayName,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    users.push(newUser);
    localStorageService.setItem(this.USERS_KEY, users);

    // Store password (in production, this would be hashed)
    localStorageService.setItem(`password_${newUser.id}`, password);

    // Create session
    const session = this.createSession(newUser.id);

    return { user: newUser, session };
  }

  async signIn(email: string, password: string): Promise<{ user: User; session: AuthSession }> {
    const users = localStorageService.getItem<User[]>(this.USERS_KEY) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const storedPassword = localStorageService.getItem<string>(`password_${user.id}`);
    if (storedPassword !== password) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLoginAt = new Date();
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex] = user;
    localStorageService.setItem(this.USERS_KEY, users);

    // Create session
    const session = this.createSession(user.id);

    console.log('[Auth] User signed in successfully:', { userId: user.id, sessionExpiry: session.expiresAt });

    return { user, session };
  }

  async signOut(): Promise<void> {
    const currentSession = localStorageService.getItem<AuthSession>(this.CURRENT_SESSION_KEY);
    
    if (currentSession) {
      // Remove from sessions list
      const sessions = localStorageService.getItem<AuthSession[]>(this.SESSIONS_KEY) || [];
      const filteredSessions = sessions.filter(s => s.token !== currentSession.token);
      localStorageService.setItem(this.SESSIONS_KEY, filteredSessions);
    }

    // Clear current session
    localStorageService.removeItem(this.CURRENT_SESSION_KEY);
    console.log('[Auth] User signed out');
  }

  async getCurrentUser(): Promise<User | null> {
    const session = await this.getCurrentSession();
    if (!session) {
      return null;
    }

    const users = localStorageService.getItem<User[]>(this.USERS_KEY) || [];
    const user = users.find(u => u.id === session.userId);

    return user || null;
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const session = localStorageService.getItem<AuthSession>(this.CURRENT_SESSION_KEY);
    
    if (!session) {
      return null;
    }

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      console.log('[Auth] Session expired, signing out');
      await this.signOut();
      return null;
    }

    return session;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const users = localStorageService.getItem<User[]>(this.USERS_KEY) || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('User not found');
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
    };

    localStorageService.setItem(this.USERS_KEY, users);
    return users[userIndex];
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const storedPassword = localStorageService.getItem<string>(`password_${userId}`);
    
    if (storedPassword !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    localStorageService.setItem(`password_${userId}`, newPassword);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const users = localStorageService.getItem<User[]>(this.USERS_KEY) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      // Don't reveal if user exists
      return;
    }

    // Generate reset token
    const resetToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    localStorageService.setItem(`reset_token_${user.id}`, {
      token: resetToken,
      expiresAt,
    });

    // In a real app, this would send an email
    console.log(`[Auth] Password reset requested for ${email}`);
    console.log(`[Auth] Reset token: ${resetToken}`);
    console.log(`[Auth] Reset link: /reset-password?token=${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const users = localStorageService.getItem<User[]>(this.USERS_KEY) || [];
    
    // Find user with this token
    let userId: string | null = null;
    for (const user of users) {
      const resetData = localStorageService.getItem<{ token: string; expiresAt: Date }>(`reset_token_${user.id}`);
      if (resetData && resetData.token === token) {
        const now = new Date();
        const expiresAt = new Date(resetData.expiresAt);
        
        if (now <= expiresAt) {
          userId = user.id;
          break;
        }
      }
    }

    if (!userId) {
      throw new Error('Invalid or expired reset token');
    }

    // Update password
    localStorageService.setItem(`password_${userId}`, newPassword);
    
    // Remove reset token
    localStorageService.removeItem(`reset_token_${userId}`);
  }

  async deleteAccount(userId: string): Promise<void> {
    // Remove user
    const users = localStorageService.getItem<User[]>(this.USERS_KEY) || [];
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorageService.setItem(this.USERS_KEY, filteredUsers);

    // Remove password
    localStorageService.removeItem(`password_${userId}`);

    // Remove all sessions for this user
    const sessions = localStorageService.getItem<AuthSession[]>(this.SESSIONS_KEY) || [];
    const filteredSessions = sessions.filter(s => s.userId !== userId);
    localStorageService.setItem(this.SESSIONS_KEY, filteredSessions);

    // Clear current session if it's this user
    const currentSession = localStorageService.getItem<AuthSession>(this.CURRENT_SESSION_KEY);
    if (currentSession && currentSession.userId === userId) {
      localStorageService.removeItem(this.CURRENT_SESSION_KEY);
    }
  }

  private createSession(userId: string): AuthSession {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.SESSION_DURATION_DAYS);

    const session: AuthSession = {
      userId,
      token,
      expiresAt,
    };

    // Store in sessions list
    const sessions = localStorageService.getItem<AuthSession[]>(this.SESSIONS_KEY) || [];
    sessions.push(session);
    localStorageService.setItem(this.SESSIONS_KEY, sessions);

    // Set as current session
    localStorageService.setItem(this.CURRENT_SESSION_KEY, session);

    return session;
  }
}

export const localAuthService = new LocalAuthService();