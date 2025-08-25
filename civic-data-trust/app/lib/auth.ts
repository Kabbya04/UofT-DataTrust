// Authentication service for Fastify backend integration
import { apiClient, ApiResponse } from './api'

// Type definitions based on Fastify API schema
export interface UserSignup {
  name: string
  email: string
  password: string
  role: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface Token {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  new_password: string
}

export interface AuthInfo {
  is_active: boolean
  email_verified: boolean
  last_login: string | null
  failed_login_attempts: number
  locked_until: string | null
}

export interface UserRole {
  id: string
  name: string
}

export interface AuthUserResponse {
  id: string
  name: string
  email: string
  status: boolean
  roles: UserRole[]
  auth: AuthInfo | null
  created_at: string
  updated_at: string
}

class AuthService {
  private refreshToken: string | null = null

  constructor() {
    // Load refresh token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.refreshToken = localStorage.getItem('refresh_token')
    }
  }

  private setTokens(tokens: any) {
    apiClient.setToken(tokens.access_token)
    this.refreshToken = tokens.refresh_token
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', tokens.refresh_token)
      // Handle expires_in safely
      const expiresIn = tokens.expires_in || 3600 // Default to 1 hour if not provided
      localStorage.setItem('token_expires_in', expiresIn.toString())
      localStorage.setItem('token_timestamp', Date.now().toString())
    }
  }

  private clearTokens() {
    apiClient.setToken(null)
    this.refreshToken = null
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('token_expires_in')
      localStorage.removeItem('token_timestamp')
    }
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true
    
    const timestamp = localStorage.getItem('token_timestamp')
    const expiresIn = localStorage.getItem('token_expires_in')
    
    if (!timestamp || !expiresIn) return true
    
    const tokenAge = Date.now() - parseInt(timestamp)
    const expirationTime = parseInt(expiresIn) * 1000 // Convert seconds to milliseconds
    
    return tokenAge >= expirationTime
  }

  // Sign up new user
  async signup(userData: UserSignup): Promise<ApiResponse<AuthUserResponse>> {
    const response = await apiClient.post<any>('/auth/signup', userData)
    
    if (response.success && response.data && response.data.data) {
      // The API wraps the user data in a nested 'data' object
      return { success: true, data: response.data.data }
    }
    
    return response
  }

  // Sign in user
  async login(credentials: UserLogin): Promise<ApiResponse<Token>> {
    const response = await apiClient.post<any>('/auth/login', credentials)
    
    if (response.success && response.data && response.data.data) {
      // The API wraps the token in a nested 'data' object
      const tokenData = response.data.data
      this.setTokens(tokenData)
      return { success: true, data: tokenData }
    }
    
    return response
  }

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout')
    this.clearTokens()
    return response
  }

  // Refresh access token
  async refreshAccessToken(): Promise<ApiResponse<Token>> {
    if (!this.refreshToken) {
      return { success: false, error: 'No refresh token available' }
    }

    const response = await apiClient.post<Token>('/auth/refresh', {
      refresh_token: this.refreshToken
    })

    if (response.success && response.data) {
      this.setTokens(response.data)
    } else {
      // Refresh failed, clear all tokens
      this.clearTokens()
    }

    return response
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<any>> {
    return apiClient.post('/auth/password-reset-request', { email })
  }

  // Reset password with token
  async resetPassword(resetData: PasswordReset): Promise<ApiResponse<any>> {
    return apiClient.post('/auth/password-reset', resetData)
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = apiClient.getToken()
    return token !== null && !this.isTokenExpired()
  }

  // Auto-refresh token if needed
  async ensureValidToken(): Promise<boolean> {
    if (!apiClient.getToken()) return false
    
    if (this.isTokenExpired() && this.refreshToken) {
      const response = await this.refreshAccessToken()
      return response.success
    }
    
    return true
  }

  // Decode JWT token to extract user information
  decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (error) {
      console.error('Error decoding JWT:', error)
      return null
    }
  }
}

// Create singleton instance
export const authService = new AuthService()

// Helper function to handle API calls with automatic token refresh
export async function withAuth<T>(
  apiCall: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> {
  const isValid = await authService.ensureValidToken()
  
  if (!isValid) {
    return { success: false, error: 'Authentication required' }
  }
  
  return apiCall()
}