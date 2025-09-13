const API_BASE_URL = process.env.NEXT_PUBLIC_USE_PROXY !== 'false' ? '/api' : 'https://civic-data-trust-backend.onrender.com/api/v1'

interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Get auth token from localStorage if available (FRESH token on each call)
  let authHeaders: Record<string, string> = {}
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      authHeaders.Authorization = `Bearer ${token}`
      
      // Debug: Check token expiration
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const expTime = new Date(payload.exp * 1000)
        const currentTime = new Date()
        console.log(`[${retryCount === 0 ? 'ORIGINAL' : 'RETRY'}] Token expires at: ${expTime.toISOString()}`)
        console.log(`[${retryCount === 0 ? 'ORIGINAL' : 'RETRY'}] Current time: ${currentTime.toISOString()}`)
        console.log(`[${retryCount === 0 ? 'ORIGINAL' : 'RETRY'}] Token valid for: ${Math.round((expTime.getTime() - currentTime.getTime()) / 1000)}s`)
        console.log(`[${retryCount === 0 ? 'ORIGINAL' : 'RETRY'}] Using token ending in: ...${token.slice(-10)}`)
        
        if (expTime <= currentTime) {
          console.warn(`[${retryCount === 0 ? 'ORIGINAL' : 'RETRY'}] Token is already expired locally!`)
        }
      } catch (e) {
        console.error('Failed to decode token:', e)
      }
    }
  }
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
    ...options,
  })

  // Handle 401 errors with automatic token refresh
  if (response.status === 401 && retryCount === 0 && typeof window !== 'undefined') {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      try {
        console.log('Token expired, attempting refresh...')
        
        // Attempt to refresh the token
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })

        if (refreshResponse.ok) {
          const authData = await refreshResponse.json()
          console.log('Refresh token response data:', authData)
          
          // Handle nested data structure (same as login)
          const tokens = authData.data || authData
          console.log('Extracted tokens:', tokens)
          
          if (tokens.access_token && tokens.refresh_token) {
            // Store new tokens
            localStorage.setItem('access_token', tokens.access_token)
            localStorage.setItem('refresh_token', tokens.refresh_token)
            
            // Debug: Check new token expiration immediately
            try {
              const newPayload = JSON.parse(atob(tokens.access_token.split('.')[1]))
              const newExpTime = new Date(newPayload.exp * 1000)
              const currentTime = new Date()
              console.log(`New token expires at: ${newExpTime.toISOString()}`)
              console.log(`Current time: ${currentTime.toISOString()}`)
              console.log(`New token valid for: ${Math.round((newExpTime.getTime() - currentTime.getTime()) / 1000)}s`)
            } catch (e) {
              console.error('Failed to decode new token:', e)
            }
            
            console.log('Token refreshed successfully, retrying original request')
            
            // Retry the original request with the new token
            return makeRequest<T>(endpoint, options, retryCount + 1)
          } else {
            console.error('Invalid token response format:', tokens)
            throw new Error('Invalid token response')
          }
        } else {
          console.log('Token refresh failed, user needs to log in again')
          // Clear invalid tokens
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          
          // Redirect to login page
          window.location.href = '/sign-in'
          throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
        }
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError)
        // Clear tokens and redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/sign-in'
        throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
      }
    } else {
      // No refresh token available, redirect to login
      console.log('No refresh token available, redirecting to login')
      window.location.href = '/sign-in'
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

interface JoinRequest {
  id: string
  user_id: string
  community_id: string
  message?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  user: {
    id: string
    name: string
    email: string
  }
}

export const api = {
  communities: {
    getAll: (page = 1, limit = 10) => 
      makeRequest<Array<{
        id: string
        name: string
        logo: string | null
        description: string | null
        community_category: {
          id: string
          name: string
        }
        admins: Array<{
          id: string
          name: string
          email: string
        }>
        users: Array<any>
      }>>(`/community?page=${page}&limit=${limit}`),
    
    create: (name: string, community_category_id: string, description?: string) =>
      makeRequest<{
        id: string
        name: string
        logo: string | null
        description: string | null
        community_category: {
          id: string
          name: string
        }
      }>(`/community`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          community_category_id,
          description: description || null
        })
      }),
    
    getById: (communityId: string) =>
      makeRequest<{
        id: string
        name: string
        logo: string | null
        description: string | null
        community_category: {
          id: string
          name: string
        }
        admins: Array<{
          id: string
          name: string
          email: string
        }>
        users: Array<any>
      }>(`/community/${communityId}`),
    
    update: (communityId: string, name?: string, description?: string, disable?: boolean) =>
      makeRequest<{
        id: string
        name: string
        logo: string | null
        description: string | null
        community_category: {
          id: string
          name: string
        }
      }>(`/community/${communityId}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: name || null,
          description: description || null,
          disable: disable || null
        })
      }),
    
    delete: (communityId: string) =>
      makeRequest<{ success: boolean; message?: string }>(`/community/${communityId}`, {
        method: 'DELETE'
      }),
    
    addUser: (communityId: string, userId: string) =>
      makeRequest<{ success: boolean; message?: string }>(`/community/add-user`, {
        method: 'PUT',
        body: JSON.stringify({
          community_id: communityId,
          user_id: userId
        })
      }),
    
    removeUser: (communityId: string, userId: string) =>
      makeRequest<{ success: boolean; message?: string }>(`/community/remove-user`, {
        method: 'PUT',
        body: JSON.stringify({
          community_id: communityId,
          user_id: userId
        })
      }),
    
    requestJoin: (communityId: string, userId: string, message?: string) =>
      makeRequest<{ success: boolean; message?: string }>(`/community/request-join`, {
        method: 'POST',
        body: JSON.stringify({
          community_id: communityId,
          user_id: userId,
          message: message || ''
        })
      }),
    
    confirmJoinRequest: (requestId: string, approve: boolean = true) =>
      makeRequest<{ success: boolean; message?: string }>(`/community/confirm-join-request?request_id=${requestId}&approve=${approve}`, {
        method: 'POST'
      }),
    
    getJoinRequests: (communityId: string) =>
      makeRequest<JoinRequest[]>(`/community/join-requests/${communityId}`)
  },
  
  joinRequests: {
    getAll: () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
      console.log('=== JOIN REQUESTS API CALL ===')
      console.log('Using token ending in:', token ? `...${token.slice(-10)}` : 'NO TOKEN')
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          console.log('Token payload user_id:', payload.user_id)
          console.log('Token payload sub:', payload.sub)
          console.log('Token payload email:', payload.email)
        } catch (e) {
          console.error('Failed to decode token for debugging:', e)
        }
      }
      return makeRequest<JoinRequest[]>(`/community-join-request?limit=100`)
    },
    
    getById: (requestId: string) =>
      makeRequest<JoinRequest>(`/community-join-request/${requestId}`),
    
    create: (communityId: string, userId?: string, message?: string) =>
      makeRequest<JoinRequest>(`/community-join-request`, {
        method: 'POST',
        body: JSON.stringify({
          community_id: communityId,
          user_id: userId,
          message: message
        })
      }),
    
    approve: (requestId: string) =>
      makeRequest<{ success: boolean; message?: string }>(`/community-join-request/approve`, {
        method: 'PUT',
        body: JSON.stringify({ request_id: requestId })
      }),
    
    reject: (requestId: string, reason?: string, adminMessage?: string) =>
      makeRequest<{ success: boolean; message?: string }>(`/community-join-request/reject`, {
        method: 'PUT',
        body: JSON.stringify({ 
          request_id: requestId,
          reason: reason || '',
          admin_message: adminMessage || ''
        })
      })
  }
}