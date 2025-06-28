'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthError {
  message: string;
  code?: string;
  details?: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to format auth errors
const formatAuthError = (error: any): AuthError => {
  if (!error) return { message: 'An unknown error occurred' };

  // Handle Supabase auth errors
  if (error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('invalid login credentials')) {
      return {
        message: 'Invalid email or password. Please check your credentials and try again.',
        code: 'INVALID_CREDENTIALS'
      };
    }
    
    if (message.includes('email not confirmed')) {
      return {
        message: 'Please check your email and click the confirmation link before signing in.',
        code: 'EMAIL_NOT_CONFIRMED'
      };
    }
    
    if (message.includes('user not found')) {
      return {
        message: 'No account found with this email address. Please sign up first.',
        code: 'USER_NOT_FOUND'
      };
    }
    
    if (message.includes('user already registered')) {
      return {
        message: 'An account with this email already exists. Please sign in instead.',
        code: 'USER_ALREADY_EXISTS'
      };
    }
    
    if (message.includes('password should be at least')) {
      return {
        message: 'Password must be at least 6 characters long.',
        code: 'WEAK_PASSWORD'
      };
    }
    
    if (message.includes('invalid email')) {
      return {
        message: 'Please enter a valid email address.',
        code: 'INVALID_EMAIL'
      };
    }
    
    if (message.includes('signup is disabled')) {
      return {
        message: 'Account registration is currently disabled. Please contact support.',
        code: 'SIGNUP_DISABLED'
      };
    }
    
    if (message.includes('too many requests')) {
      return {
        message: 'Too many attempts. Please wait a few minutes before trying again.',
        code: 'RATE_LIMITED'
      };
    }
    
    if (message.includes('network')) {
      return {
        message: 'Network error. Please check your internet connection and try again.',
        code: 'NETWORK_ERROR'
      };
    }
    
    // Return original message if no specific handling
    return {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
  
  return {
    message: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR'
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Handle new user signup
        if ((event as string) === 'SIGNED_UP' && session?.user) {
          console.log('New user signed up:', session.user.email);
        }
        
        // Handle sign in
        if ((event as string) === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email);
        }
        
        // Handle sign out
        if ((event as string) === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      // Validate inputs
      if (!email || !password) {
        return { 
          error: { 
            message: 'Please enter both email and password.',
            code: 'MISSING_CREDENTIALS'
          } 
        };
      }

      if (!email.includes('@')) {
        return { 
          error: { 
            message: 'Please enter a valid email address.',
            code: 'INVALID_EMAIL'
          } 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        return { error: formatAuthError(error) };
      }
      
      if (!data.session) {
        return { 
          error: { 
            message: 'Sign in failed. Please try again.',
            code: 'NO_SESSION'
          } 
        };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: formatAuthError(error) };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ error: AuthError | null }> => {
    try {
      // Validate inputs
      if (!email || !password || !name) {
        return { 
          error: { 
            message: 'Please fill in all required fields.',
            code: 'MISSING_FIELDS'
          } 
        };
      }

      if (!email.includes('@')) {
        return { 
          error: { 
            message: 'Please enter a valid email address.',
            code: 'INVALID_EMAIL'
          } 
        };
      }

      if (password.length < 6) {
        return { 
          error: { 
            message: 'Password must be at least 6 characters long.',
            code: 'WEAK_PASSWORD'
          } 
        };
      }

      if (name.trim().length < 2) {
        return { 
          error: { 
            message: 'Please enter your full name (at least 2 characters).',
            code: 'INVALID_NAME'
          } 
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            name: name.trim(),
          },
          emailRedirectTo: undefined,
        },
      });
      
      if (error) {
        return { error: formatAuthError(error) };
      }

      // Check if user was created successfully
      if (data.user && data.session) {
        // User is immediately signed in
        return { error: null };
      } else if (data.user && !data.session) {
        // User created but needs email confirmation
        return { 
          error: { 
            message: 'Please check your email and click the confirmation link to complete your registration.',
            code: 'EMAIL_CONFIRMATION_REQUIRED'
          } 
        };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: formatAuthError(error) };
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: formatAuthError(error) };
      }
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: formatAuthError(error) };
    }
  };

  const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        return { error: formatAuthError(error) };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Google sign-in catch error:', error);
      return { error: formatAuthError(error) };
    }
  };

  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      if (!email) {
        return { 
          error: { 
            message: 'Please enter your email address.',
            code: 'MISSING_EMAIL'
          } 
        };
      }

      if (!email.includes('@')) {
        return { 
          error: { 
            message: 'Please enter a valid email address.',
            code: 'INVALID_EMAIL'
          } 
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );
      
      if (error) {
        return { error: formatAuthError(error) };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: formatAuthError(error) };
    }
  };

  const updatePassword = async (password: string): Promise<{ error: AuthError | null }> => {
    try {
      if (!password) {
        return { 
          error: { 
            message: 'Please enter a new password.',
            code: 'MISSING_PASSWORD'
          } 
        };
      }

      if (password.length < 6) {
        return { 
          error: { 
            message: 'Password must be at least 6 characters long.',
            code: 'WEAK_PASSWORD'
          } 
        };
      }

      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        return { error: formatAuthError(error) };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: formatAuthError(error) };
    }
  };

  const resendConfirmation = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      if (!email) {
        return { 
          error: { 
            message: 'Please enter your email address.',
            code: 'MISSING_EMAIL'
          } 
        };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });
      
      if (error) {
        return { error: formatAuthError(error) };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Resend confirmation error:', error);
      return { error: formatAuthError(error) };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updatePassword,
    resendConfirmation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}