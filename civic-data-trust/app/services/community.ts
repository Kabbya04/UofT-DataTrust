const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://civic-data-trust-backend.onrender.com/api/v1';
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY !== 'false';

export interface CommunityCategory {
  id: string;
  name: string;
  disable: boolean;
}

export interface CommunityCategoryResponse {
  status: boolean;
  message: string;
  data: CommunityCategory[];
}

export interface CommunityCreate {
  name: string;
  community_category_id: string;
  description?: string;
}

export interface Community {
  id: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  community_category: object;
}

export interface CommunityResponse {
  status: string;
  message: string;
  data: Community[];
}

export interface SingleCommunityResponse {
  id: string;
  name: string;
  logo?: string | null;
  description?: string | null;
  community_category: object;
}

class CommunityService {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private async retryRequest(requestFn: () => Promise<Response>, retries: number = 2): Promise<Response> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await requestFn();
        return response;
      } catch (error) {
        if (i === retries) throw error;
        
        if (error instanceof TypeError && error.message.includes('fetch')) {
          console.log(`Request failed (attempt ${i + 1}/${retries + 1}). Retrying in 3 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        } else {
          throw error;
        }
      }
    }
    throw new Error('Max retries exceeded');
  }

  async getCommunityCategories(): Promise<CommunityCategory[]> {
    try {
      const categoriesUrl = USE_PROXY ? '/api/community-category' : `${API_BASE_URL}/community-category/`;
      console.log('Fetching community categories from:', categoriesUrl);
      
      const response = await this.retryRequest(() => 
        fetch(categoriesUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          ...(USE_PROXY ? {} : { mode: 'cors', credentials: 'omit' }),
        })
      );
      
      console.log('Categories response status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.warn('Failed to fetch community categories');
        // Return default categories if API fails
        return [
          { id: '0120f3dd-7889-400c-ae58-46526611c8e5', name: 'Education', disable: false },
          { id: '9e719012-e63b-4fd2-a38b-9345bdf310b1', name: 'Data Science', disable: false },
        ];
      }
      
      const result: CommunityCategoryResponse = await response.json();
      console.log('Fetched community categories:', result);
      
      if (result.data && Array.isArray(result.data)) {
        return result.data;
      } else {
        console.warn('API returned unexpected format for categories:', result);
        return [
          { id: '0120f3dd-7889-400c-ae58-46526611c8e5', name: 'Education', disable: false },
          { id: '9e719012-e63b-4fd2-a38b-9345bdf310b1', name: 'Data Science', disable: false },
        ];
      }
    } catch (error) {
      console.error('Error fetching community categories:', error);
      // Return default categories if fetch fails
      return [
        { id: '0120f3dd-7889-400c-ae58-46526611c8e5', name: 'Education', disable: false },
        { id: '9e719012-e63b-4fd2-a38b-9345bdf310b1', name: 'Data Science', disable: false },
      ];
    }
  }

  async createCommunity(data: CommunityCreate): Promise<SingleCommunityResponse> {
    try {
      const createUrl = USE_PROXY ? '/api/community' : `${API_BASE_URL}/community/`;
      const token = this.getAuthToken();
      
      console.log('Creating community at:', createUrl);
      console.log('Community data:', data);
      console.log('Token available:', !!token);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await this.retryRequest(() => 
        fetch(createUrl, {
          method: 'POST',
          headers,
          ...(USE_PROXY ? {} : { mode: 'cors', credentials: 'omit' }),
          body: JSON.stringify(data),
        })
      );
      
      console.log('Create community response status:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = 'Community creation failed';
        try {
          const error = await response.json();
          
          // Handle validation errors from FastAPI/Pydantic
          if (response.status === 422 && error.detail && Array.isArray(error.detail)) {
            const validationErrors = error.detail.map((err: any) => {
              const field = err.loc ? err.loc[err.loc.length - 1] : 'field';
              return `${field}: ${err.msg}`;
            }).join(', ');
            errorMessage = `Validation error: ${validationErrors}`;
          } else {
            errorMessage = error.error || error.detail || error.message || errorMessage;
          }
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // Add more specific error handling
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please sign in again.';
        } else if (response.status === 403) {
          errorMessage = 'Permission denied. You do not have permission to create communities.';
        } else if (response.status === 500) {
          errorMessage = 'Server error: Unable to create community. Please try again later.';
        } else if (response.status === 422 && !errorMessage.includes('Validation error:')) {
          errorMessage = 'Validation error: Please check your input data.';
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Created community:', result);
      return result;
    } catch (error) {
      console.error('Community creation error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. The backend may be starting up. Please wait a moment and try again.');
      }
      throw error;
    }
  }

  async getCommunities(page: number = 1, limit: number = 10): Promise<Community[]> {
    try {
      const communitiesUrl = USE_PROXY ? `/api/community?page=${page}&limit=${limit}` : `${API_BASE_URL}/community/?page=${page}&limit=${limit}`;
      console.log('Fetching communities from:', communitiesUrl);
      
      const response = await this.retryRequest(() => 
        fetch(communitiesUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          ...(USE_PROXY ? {} : { mode: 'cors', credentials: 'omit' }),
        })
      );
      
      console.log('Communities response status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.warn('Failed to fetch communities');
        return [];
      }
      
      const result: CommunityResponse = await response.json();
      console.log('Fetched communities:', result);
      
      if (result.data && Array.isArray(result.data)) {
        return result.data;
      } else {
        console.warn('API returned unexpected format for communities:', result);
        return [];
      }
    } catch (error) {
      console.error('Error fetching communities:', error);
      return [];
    }
  }

  async createCommunityCategory(name: string): Promise<CommunityCategory> {
    try {
      const createUrl = USE_PROXY ? '/api/community-category' : `${API_BASE_URL}/community-category/`;
      const token = this.getAuthToken();
      
      console.log('Creating community category at:', createUrl);
      console.log('Category name:', name);
      console.log('Token available:', !!token);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await this.retryRequest(() => 
        fetch(createUrl, {
          method: 'POST',
          headers,
          ...(USE_PROXY ? {} : { mode: 'cors', credentials: 'omit' }),
          body: JSON.stringify({ name, disable: false }),
        })
      );
      
      console.log('Create category response status:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = 'Category creation failed';
        try {
          const error = await response.json();
          errorMessage = error.error || error.detail || error.message || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        if (response.status === 401) {
          errorMessage = 'Authentication required. Please sign in again.';
        } else if (response.status === 403) {
          errorMessage = 'Permission denied. You do not have permission to create categories.';
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Created category:', result);
      return result;
    } catch (error) {
      console.error('Category creation error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please wait a moment and try again.');
      }
      throw error;
    }
  }
}

export const communityService = new CommunityService();