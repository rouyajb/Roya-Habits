import { User, AuthSession } from '@/types';

/**
 * Authentication Service Interface
 * Implement this interface for different auth providers (Local, Supabase, etc.)
 */
export interface IAuthService {
  /**
   * Sign up a new user with email and password
   */
  signUp(email: string, password: string, displayName?: string): Promise<{ user: User; session: AuthSession }>;

  /**
   * Sign in an existing user
   */
  signIn(email: string, password: string): Promise<{ user: User; session: AuthSession }>;

  /**
   * Sign in with Google OAuth
   */
  signInWithGoogle(): Promise<{ user: User; session: AuthSession }>;

  /**
   * Sign out the current user
   */
  signOut(): Promise<void>;

  /**
   * Get the current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Get the current session
   */
  getCurrentSession(): Promise<AuthSession | null>;

  /**
   * Request password reset email
   */
  requestPasswordReset(email: string): Promise<void>;

  /**
   * Reset password with token
   */
  resetPassword(token: string, newPassword: string): Promise<void>;

  /**
   * Change email for current user
   */
  changeEmail(newEmail: string, password: string): Promise<void>;

  /**
   * Change password for current user
   */
  changePassword(currentPassword: string, newPassword: string): Promise<void>;

  /**
   * Delete user account permanently
   */
  deleteAccount(password: string): Promise<void>;

  /**
   * Verify PIN for app lock
   */
  verifyPin(pin: string): Promise<boolean>;

  /**
   * Set or update PIN for app lock
   */
  setPin(pin: string): Promise<void>;

  /**
   * Check if user has PIN enabled
   */
  hasPinEnabled(): Promise<boolean>;
}