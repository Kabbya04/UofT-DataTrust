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
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error! status: ${response.status}`)
  }

  return response.json()
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
      }>>(`/community?page=${page}&limit=${limit}`)
  }
}