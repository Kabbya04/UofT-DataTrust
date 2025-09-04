'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User, LoginResponse, SignupData, LoginData } from '../../services/auth';
import { useRouter } from 'next/navigation';
import { testAPIConnection } from '../../utils/api-test';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  updateUser: (userData: { name?: string; email?: string; status?: boolean; role?: string }) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isAuthenticated = user !== null;

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Test API connection only if not in mock mode
        const IS_MOCK_MODE = process.env.NEXT_PUBLIC_FORCE_MOCK === 'true';
        if (!IS_MOCK_MODE) {
          const isAPIAccessible = await testAPIConnection();
          console.log('API accessible:', isAPIAccessible);
        }
        
        const storedUser = authService.getStoredUser();
        const token = authService.getStoredToken();
        
        if (storedUser && token) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (response: LoginResponse) => {
    console.log('=== Auth Success Response ===');
    console.log('Full response:', response);
    console.log('User object:', response.user);
    console.log('User role:', response.user?.role);
    
    authService.storeAuthData(response);
    setUser(response.user);
    setError(null);
    
    if (response.user?.role) {
      const redirectPath = authService.getRoleBasedRedirect(response.user.role);
      console.log('Redirecting to:', redirectPath);
      router.push(redirectPath);
    } else {
      console.warn('No role found in user object, redirecting to default dashboard');
      router.push('/dashboard');
    }
  };

  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(data);
      handleAuthSuccess(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('=== Signup Process ===');
      
      let shouldAttemptLogin = false;
      
      try {
        const signupResponse = await authService.signup(data);
        console.log('Signup response:', signupResponse);
        shouldAttemptLogin = true;
      } catch (signupError) {
        console.log('Signup error:', signupError);
        
        // If email already exists, try to login instead
        if (signupError instanceof Error && signupError.message.includes('already registered')) {
          console.log('Email exists, attempting login instead...');
          shouldAttemptLogin = true;
        } else {
          throw signupError; // Re-throw if it's a different error
        }
      }
      
      if (shouldAttemptLogin) {
        console.log('=== Auto Login After Signup ===');
        const loginResponse = await authService.login({
          email: data.email,
          password: data.password,
        });
        console.log('Login response:', loginResponse);
        console.log('Login response user:', loginResponse.user);
        console.log('Login response user role:', loginResponse.user?.role);
        
        handleAuthSuccess(loginResponse);
      }
    } catch (err) {
      console.error('Signup process error:', err);
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
    router.push('/sign-in');
  };

  const updateUser = async (userData: { name?: string; email?: string; status?: boolean; role?: string }) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const updatedUser = await authService.updateUser(user.id, userData);
      
      // Update the user state with the new data
      setUser(prev => prev ? { ...prev, ...updatedUser } : prev);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
      throw err; // Re-throw to handle in component
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    updateUser,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};