// API client configuration for FastAPI backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://civic-data-trust-backend.onrender.com'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Actual API response wrapper
export interface BackendResponse<T> {
  status: boolean
  message: string
  data: T
}

export interface ApiError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

// Tenant/Community types based on OpenAPI spec
export interface TenantResponse {
  id: string
  name: string
}

export interface TenantCreate {
  name: string
}

export interface TenantUpdate {
  name?: string | null
}

export interface TenantAddUserRequest {
  tenant_id: string
  user_id: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('access_token', token)
      } else {
        localStorage.removeItem('access_token')
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api/v1${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.setToken(null)
          throw new Error('Authentication required')
        }

        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || 
          errorData?.detail?.[0]?.msg || 
          `HTTP ${response.status}: ${response.statusText}`
        )
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return { success: true }
      }

      try {
        const backendResponse = await response.json() as BackendResponse<any>
        
        // Check if the backend response indicates success
        if (backendResponse.status) {
          return { success: true, data: backendResponse.data, message: backendResponse.message }
        } else {
          return { success: false, error: backendResponse.message }
        }
      } catch (parseError) {
        // If it's not the expected format, try to parse as direct data
        const text = await response.text()
        try {
          const parsed = JSON.parse(text)
          return { success: true, data: parsed }
        } catch {
          return { success: true, data: text }
        }
      }
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Health check endpoint
export const checkHealth = async () => {
  return apiClient.get('/health')
}

// Get available user roles
export const getUserRoles = async () => {
  return apiClient.get('/user-roles/')
}

// Tenant/Community API functions
export const getAllTenants = async (page: number = 1, limit: number = 100): Promise<ApiResponse<TenantResponse[]>> => {
  // API expects page starting from 1, not 0
  const validPage = Math.max(1, Math.floor(page))
  const validLimit = Math.min(100, Math.max(1, Math.floor(limit)))
  return apiClient.get(`/tenants/?page=${validPage}&limit=${validLimit}`)
}

export const createTenant = async (data: TenantCreate): Promise<ApiResponse<TenantResponse>> => {
  return apiClient.post('/tenants/create', data)
}

export const updateTenant = async (tenantId: string, data: TenantUpdate): Promise<ApiResponse<TenantResponse>> => {
  return apiClient.put(`/tenants/update/${tenantId}`, data)
}

export const addUserToTenant = async (data: TenantAddUserRequest): Promise<ApiResponse<void>> => {
  return apiClient.put('/tenants/add-user', data)
}
