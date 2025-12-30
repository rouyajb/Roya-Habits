import { IAuthService } from '../interfaces/IAuthService';
import { User, AuthSession } from '@/types';

/**
 * Supabase Authentication Service (STUB)
 * TODO: Implement when Supabase backend is enabled
 * 
 * Required setup:
 * 1. Enable Supabase Auth in project settings
 * 2. Configure email provider (SMTP settings)
 * 3. Set up Google OAuth provider (optional)
 * 4. Configure redirect URLs
 * 5. Set up email templates for password reset
 */
export class SupabaseAuthService implements IAuthService {
  // TODO: Initialize Supabase client
  // private supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async signUp(email: string, password: string, displayName?: string): Promise<{ user: User; session: AuthSession }> {
    throw new Error('TODO: Implement Supabase signUp');
    
    // Implementation outline:
    // const { data, error } = await this.supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     data: { display_name: displayName }
    //   }
    // });
    // 
    // if (error) throw error;
    // 
    // return {
    //   user: this.mapSupabaseUser(data.user),
    //   session: this.mapSupabaseSession(data.session)
    // };
  }

  async signIn(email: string, password: string): Promise<{ user: User; session: AuthSession }> {
    throw new Error('TODO: Implement Supabase signIn');
    
    // const { data, error } = await this.supabase.auth.signInWithPassword({
    //   email,
    //   password
    // });
    // 
    // if (error) throw error;
    // 
    // return {
    //   user: this.mapSupabaseUser(data.user),
    //   session: this.mapSupabaseSession(data.session)
    // };
  }

  async signInWithGoogle(): Promise<{ user: User; session: AuthSession }> {
    throw new Error('TODO: Implement Supabase Google OAuth');
    
    // const { data, error } = await this.supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `${window.location.origin}/auth/callback`
    //   }
    // });
  }

  async signOut(): Promise<void> {
    throw new Error('TODO: Implement Supabase signOut');
    
    // const { error } = await this.supabase.auth.signOut();
    // if (error) throw error;
  }

  async getCurrentUser(): Promise<User | null> {
    throw new Error('TODO: Implement Supabase getCurrentUser');
    
    // const { data: { user } } = await this.supabase.auth.getUser();
    // return user ? this.mapSupabaseUser(user) : null;
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    throw new Error('TODO: Implement Supabase getCurrentSession');
    
    // const { data: { session } } = await this.supabase.auth.getSession();
    // return session ? this.mapSupabaseSession(session) : null;
  }

  async requestPasswordReset(email: string): Promise<void> {
    throw new Error('TODO: Implement Supabase password reset request');
    
    // const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
    //   redirectTo: `${window.location.origin}/reset-password`
    // });
    // if (error) throw error;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    throw new Error('TODO: Implement Supabase password reset');
    
    // const { error } = await this.supabase.auth.updateUser({
    //   password: newPassword
    // });
    // if (error) throw error;
  }

  async changeEmail(newEmail: string, password: string): Promise<void> {
    throw new Error('TODO: Implement Supabase email change');
    
    // First verify password, then:
    // const { error } = await this.supabase.auth.updateUser({
    //   email: newEmail
    // });
    // if (error) throw error;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    throw new Error('TODO: Implement Supabase password change');
    
    // const { error } = await this.supabase.auth.updateUser({
    //   password: newPassword
    // });
    // if (error) throw error;
  }

  async deleteAccount(password: string): Promise<void> {
    throw new Error('TODO: Implement Supabase account deletion');
    
    // This requires a custom RPC function in Supabase:
    // const { error } = await this.supabase.rpc('delete_user_account', {
    //   user_password: password
    // });
    // if (error) throw error;
  }

  async verifyPin(pin: string): Promise<boolean> {
    throw new Error('TODO: Implement PIN verification with Supabase');
    
    // Fetch user_settings and compare hashed PIN
  }

  async setPin(pin: string): Promise<void> {
    throw new Error('TODO: Implement PIN setup with Supabase');
    
    // Update user_settings with hashed PIN
  }

  async hasPinEnabled(): Promise<boolean> {
    throw new Error('TODO: Implement PIN check with Supabase');
    
    // Check user_settings.pin_enabled
  }

  // Helper methods to map Supabase types to app types
  // private mapSupabaseUser(supabaseUser: any): User { ... }
  // private mapSupabaseSession(supabaseSession: any): AuthSession { ... }
}