"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { authService, AuthUserResponse } from "../../lib/auth"

interface AuthContextType {
  user: AuthUserResponse | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: {
    name: string
    email: string
    password: string
    role: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = authService.isAuthenticated()

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        // Try to get current user data
        // Since the API doesn't have a /me endpoint, we'll need to store user data
        const storedUser = localStorage.getItem('current_user')
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch (error) {
            console.error('Error parsing stored user data:', error)
          }
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      
      if (response.success) {
        // For now, we'll create a minimal user object since we don't have user data from login
        // In a real implementation, the login response might include user data
        const userData: AuthUserResponse = {
          id: 'temp-id', // This should come from the API response
          name: email.split('@')[0], // Temporary name from email
          email,
          status: true,
          roles: [],
          auth: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setUser(userData)
        localStorage.setItem('current_user', JSON.stringify(userData))
        
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Login failed' }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    }
  }

  const signup = async (userData: {
    name: string
    email: string
    password: string
    role: string
  }) => {
    try {
      const response = await authService.signup(userData)
      
      if (response.success && response.data) {
        setUser(response.data)
        localStorage.setItem('current_user', JSON.stringify(response.data))
        return { success: true }
      } else {
        return { success: false, error: response.error || 'Signup failed' }
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      localStorage.removeItem('current_user')
    }
  }

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await authService.requestPasswordReset(email)
      return { 
        success: response.success, 
        error: response.error 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset request failed' 
      }
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await authService.resetPassword({ token, new_password: newPassword })
      return { 
        success: response.success, 
        error: response.error 
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Password reset failed' 
      }
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}