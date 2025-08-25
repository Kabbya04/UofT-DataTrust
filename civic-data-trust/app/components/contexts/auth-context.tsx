"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { authService, AuthUserResponse } from "../../lib/auth"
import { getRoleDisplayName } from "../../lib/routing"

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

  const isAuthenticated = authService.isAuthenticated() && user !== null

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = async () => {
      console.log('Checking auth on mount...')
      const hasToken = authService.isAuthenticated()
      const storedUser = localStorage.getItem('current_user')
      
      console.log('Auth check:', { hasToken, hasStoredUser: !!storedUser })
      
      if (hasToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          console.log('Loading stored user data:', userData)
          setUser(userData)
        } catch (error) {
          console.error('Error parsing stored user data:', error)
          // Clear invalid stored data
          localStorage.removeItem('current_user')
        }
      } else if (hasToken && !storedUser) {
        // Has token but no user data - try to decode token
        const token = localStorage.getItem('access_token')
        if (token) {
          const decoded = authService.decodeJWT(token)
          console.log('Decoded token on mount:', decoded)
          // We don't have email here, so we'll need to handle this case
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
        // After successful login, we need to get the user info
        // For now, decode the JWT token to get basic info
        const token = localStorage.getItem('access_token')
        if (token) {
          const decoded = authService.decodeJWT(token)
          const userData: AuthUserResponse = {
            id: decoded?.sub || 'unknown',
            name: email.split('@')[0], // Extract name from email as fallback
            email,
            status: true,
            roles: decoded?.role ? [{ 
              id: decoded.role, 
              name: getRoleDisplayName(decoded.role) 
            }] : [],
            auth: {
              is_active: true,
              email_verified: false,
              last_login: new Date().toISOString(),
              failed_login_attempts: 0,
              locked_until: null
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          console.log('Setting user data in auth context:', userData)
          setUser(userData)
          localStorage.setItem('current_user', JSON.stringify(userData))
        }
        
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