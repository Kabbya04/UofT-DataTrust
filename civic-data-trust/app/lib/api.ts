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
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  // Get auth token from localStorage if available
  let authHeaders: Record<string, string> = {}
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      authHeaders.Authorization = `Bearer ${token}`
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
    getAll: () =>
      makeRequest<JoinRequest[]>(`/community-join-request`),
    
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