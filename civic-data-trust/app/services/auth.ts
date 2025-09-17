const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://civic-data-trust-backend.onrender.com/api/v1';
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_FORCE_MOCK === 'true';
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY !== 'false'; // Default to using proxy

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthInfo {
  is_active: boolean;
  email_verified: boolean;
  last_login: string | null;
  failed_login_attempts: number;
  locked_until: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: boolean;
  role: string;
  auth: AuthInfo | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface SignupResponse extends User {}

export interface UserRole {
  id: string;
  name: string;
}

class AuthService {
  async getUserRoles(): Promise<UserRole[]> {
    try {
      const rolesUrl = USE_PROXY ? '/api/user-roles' : `${API_BASE_URL}/user-roles/`;
      console.log('Fetching user roles from:', rolesUrl);
      
      const response = await fetch(rolesUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        ...(USE_PROXY ? {} : { mode: 'cors', credentials: 'omit' }),
      });
      
      if (!response.ok) {
        console.warn('Failed to fetch user roles, using defaults');
        // Return default roles if API fails
        return [
          { id: 'researcher', name: 'Researcher' },
          { id: 'community-user', name: 'Community User' },
          { id: 'community-admin', name: 'Community Admin' },
          { id: 'super-admin', name: 'Super Admin' },
        ];
      }
      
      const roles = await response.json();
      console.log('Fetched user roles:', roles);
      
      // Handle if response is wrapped in a data property or if it's already an array
      if (Array.isArray(roles)) {
        return roles;
      } else if (roles.data && Array.isArray(roles.data)) {
        return roles.data;
      } else {
        console.warn('API returned unexpected format for roles:', roles);
        // Return default roles if response format is unexpected
        return [
          { id: 'researcher', name: 'Researcher' },
          { id: 'community-user', name: 'Community User' },
          { id: 'community-admin', name: 'Community Admin' },
          { id: 'super-admin', name: 'Super Admin' },
        ];
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      // Return default roles if fetch fails
      return [
        { id: 'researcher', name: 'Researcher' },
        { id: 'community-user', name: 'Community User' },
        { id: 'community-admin', name: 'Community Admin' },
        { id: 'super-admin', name: 'Super Admin' },
      ];
    }
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
  // Mock data for development
  private createMockUser(data: SignupData): User {
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      status: true,
      role: data.role,
      auth: {
        is_active: true,
        email_verified: true,
        last_login: new Date().toISOString(),
        failed_login_attempts: 0,
        locked_until: null,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  private createMockLoginResponse(user: User): LoginResponse {
    return {
      access_token: 'mock_access_token_' + Math.random().toString(36).substr(2, 9),
      refresh_token: 'mock_refresh_token_' + Math.random().toString(36).substr(2, 9),
      user,
    };
  }

  async signup(data: SignupData): Promise<SignupResponse> {
    if (IS_MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock user
      const mockUser = this.createMockUser(data);
      return mockUser;
    }

    try {
      const signupUrl = USE_PROXY ? '/api/auth/signup' : `${API_BASE_URL}/auth/signup`;
      console.log('Making signup request to:', signupUrl);
      console.log('Signup data:', { ...data, password: '[REDACTED]' });
      
      const response = await this.retryRequest(() => 
        fetch(signupUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          ...(USE_PROXY ? {} : { mode: 'cors', credentials: 'omit' }),
          body: JSON.stringify(data),
        })
      );
      
      console.log('Signup response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Signup failed';
        let errorDetails: any = null;
        
        // Try to parse error response
        try {
          errorDetails = await response.json();
          
          // Handle validation errors from FastAPI/Pydantic
          if (response.status === 422 && errorDetails.detail && Array.isArray(errorDetails.detail)) {
            const validationErrors = errorDetails.detail.map((err: any) => {
              const field = err.loc ? err.loc[err.loc.length - 1] : 'field';
              return `${field}: ${err.msg}`;
            }).join(', ');
            errorMessage = `Validation error: ${validationErrors}`;
          } else {
            // Try to get error message from common response formats
            errorMessage = errorDetails.error || 
                          errorDetails.detail || 
                          errorDetails.message || 
                          errorMessage;
          }
        } catch (e) {
          // If JSON parsing fails, use basic HTTP status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        // Add detailed server error handling
        if (response.status === 500) {
          // Add error ID for better support tracking
          const errorId = Math.random().toString(36).substring(2, 8).toUpperCase();
          errorMessage = `Server error [ID: ${errorId}]: The backend service may be experiencing issues. ` +
                        `Please try again later or contact support with this error ID: ${errorId}.`;
          
          // Log detailed error info for debugging
          console.error(`Server error details [${errorId}]:`, {
            url: signupUrl,
            status: response.status,
            headers: Object.fromEntries(response.headers),
            errorBody: errorDetails,
            timestamp: new Date().toISOString()
          });
        } else if (response.status === 400) {
          errorMessage = errorMessage.includes('already') ? errorMessage : 
                         'Invalid signup data provided. Please check your information and try again.';
        } else if (response.status === 422 && !errorMessage.includes('Validation error:')) {
          errorMessage = 'Validation error: Please check your input data. Password must be at least ' +
                        '8 characters and contain at least one digit, one uppercase letter, and one lowercase letter.';
        } else if (response.status >= 500) {
          // Handle other server errors
          errorMessage = `Server error: Something went wrong on our end. Please try again later (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. The backend may be starting up (Render free tier). Please wait a moment and try again.');
      }
      throw error;
    }
  }

  async login(data: LoginData): Promise<LoginResponse> {
    if (IS_MOCK_MODE) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a mock user for login
      const mockUser = this.createMockUser({
        name: 'John Doe',
        email: data.email,
        password: data.password,
        role: 'Community User',
      });
      
      return this.createMockLoginResponse(mockUser);
    }

    try {
      const loginUrl = USE_PROXY ? '/api/auth/login' : `${API_BASE_URL}/auth/login`;
      console.log('Making login request to:', loginUrl);
      console.log('Login data:', { email: data.email, password: '[REDACTED]' });
      
      const response = await this.retryRequest(() => 
        fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          ...(USE_PROXY ? {} : { mode: 'cors', credentials: 'omit' }),
          body: JSON.stringify(data),
        })
      );
      
      console.log('Login response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Login failed';
        let errorDetails: any = null;
        
        // Try to parse error response
        try {
          errorDetails = await response.json();
          // Try to get error message from common response formats
          errorMessage = errorDetails.error || 
                        errorDetails.detail || 
                        errorDetails.message || 
                        errorMessage;
        } catch (e) {
          // If JSON parsing fails, use basic HTTP status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        // Add detailed server error handling
        if (response.status === 500) {
          // Add error ID for better support tracking
          const errorId = Math.random().toString(36).substring(2, 8).toUpperCase();
          errorMessage = `Server error [ID: ${errorId}]: Authentication service is currently unavailable. ` +
                        `Please try again later or contact support with this error ID: ${errorId}.`;
          
          // Log detailed error info for debugging
          console.error(`Server error details [${errorId}]:`, {
            url: loginUrl,
            status: response.status,
            headers: Object.fromEntries(response.headers),
            errorBody: errorDetails,
            timestamp: new Date().toISOString()
          });
        } else if (response.status === 401) {
          errorMessage = 'Authentication failed: Please check your email and password.';
        } else if (response.status === 403) {
          errorMessage = 'Access denied: Your account does not have permission to log in.';
        } else if (response.status >= 500) {
          // Handle other server errors
          errorMessage = `Server error: Something went wrong on our end. Please try again later (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. The backend may be starting up (Render free tier). Please wait a moment and try again.');
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      let errorMessage = 'Token refresh failed';
      let errorDetails: any = null;
            
      // Try to parse error response
      try {
        errorDetails = await response.json();
        errorMessage = errorDetails.detail || errorDetails.error || errorDetails.message || errorMessage;
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    
      // Handle specific error cases
      if (response.status === 500) {
        const errorId = Math.random().toString(36).substring(2, 8).toUpperCase();
        errorMessage = `Server error [ID: ${errorId}]: Failed to refresh authentication token. ` +
                      'Please try signing in again or contact support with this error ID.';
              
        console.error(`Token refresh error [${errorId}]:`, {
          status: response.status,
          errorBody: errorDetails,
          timestamp: new Date().toISOString()
        });
      } else if (response.status === 401) {
        errorMessage = 'Session expired: Please sign in again to continue.';
        // Clear stored auth data
        this.logout();
      }
            
      throw new Error(errorMessage);
    }

    return response.json();
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  storeAuthData(data: LoginResponse) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
  }

  getRoleBasedRedirect(role: string): string {
    // Map role IDs to redirect paths (backend returns UUIDs)
    const roleRedirects: Record<string, string> = {
      '7d1222ee-a32b-4981-8b31-89ac68b640fb': '/researcher-wf/home', // Researcher
      '38252b5f-55ff-4cae-aad1-f442971e2e16': '/community-member-wf/home', // Community User  
      '445acacc-aa8c-4902-892d-13e8afc8be3f': '/project-admin-wf/dashboard', // Community Admin
      '093e572a-3226-4786-a16b-8020e2cf5bfd': '/super-admin-wf/dashboard', // Super Admin
    };

    // Also handle role names for backward compatibility
    const roleNameRedirects: Record<string, string> = {
      'Researcher': '/researcher-wf/home',
      'Community User': '/community-member-wf/home',
      'Community Admin': '/project-admin-wf/dashboard',
      'Super Admin': '/super-admin-wf/dashboard',
    };

    return roleRedirects[role] || roleNameRedirects[role] || '/dashboard';
  }

  async updateUser(userId: string, userData: { name?: string; email?: string; status?: boolean; role?: string }): Promise<User> {
    const updateUrl = USE_PROXY ? `/api/users/${userId}` : `${API_BASE_URL}/users/${userId}`;
    const token = this.getStoredToken();
    
    console.log('Updating user:', updateUrl);
    console.log('Update data:', userData);
    console.log('Token available:', !!token);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers,
        ...(USE_PROXY ? {} : { mode: 'cors', credentials: 'omit' }),
        body: JSON.stringify(userData),
      });
      
      console.log('Update response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Update failed';
        let errorDetails: any = null;
        
        // Try to parse error response
        try {
          errorDetails = await response.json();
          
          // Handle validation errors from FastAPI/Pydantic
          if (response.status === 422 && errorDetails.detail && Array.isArray(errorDetails.detail)) {
            const validationErrors = errorDetails.detail.map((err: any) => {
              const field = err.loc ? err.loc[err.loc.length - 1] : 'field';
              return `${field}: ${err.msg}`;
            }).join(', ');
            errorMessage = `Validation error: ${validationErrors}`;
          } else {
            // Try to get error message from common response formats
            errorMessage = errorDetails.error || 
                          errorDetails.detail || 
                          errorDetails.message || 
                          errorMessage;
          }
        } catch (e) {
          // If JSON parsing fails, use basic HTTP status text
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        // Add detailed server error handling
        if (response.status === 500) {
          // Add error ID for better support tracking
          const errorId = Math.random().toString(36).substring(2, 8).toUpperCase();
          errorMessage = `Server error [ID: ${errorId}]: Unable to update user information. ` +
                        `Please try again later or contact support with this error ID: ${errorId}.`;
          
          // Log detailed error info for debugging
          console.error(`User update error [${errorId}]:`, {
            url: updateUrl,
            status: response.status,
            headers: Object.fromEntries(response.headers),
            errorBody: errorDetails,
            timestamp: new Date().toISOString()
          });
        } else if (response.status === 400) {
          errorMessage = 'Invalid request: Please check your input data and try again.';
        } else if (response.status === 401) {
          errorMessage = 'Authentication error: Please sign in again to update your information.';
        } else if (response.status === 403) {
          errorMessage = 'Permission denied: You do not have permission to update this information.';
        } else if (response.status === 404) {
          errorMessage = 'Not found: The requested user could not be found.';
        } else if (response.status >= 500) {
          // Handle other server errors
          errorMessage = `Server error: Something went wrong on our end. Please try again later (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();
      console.log('Updated user data:', updatedUser);
      
      // Update stored user data
      if (typeof window !== 'undefined') {
        const storedUser = this.getStoredUser();
        if (storedUser) {
          const newUserData = { ...storedUser, ...updatedUser };
          localStorage.setItem('user', JSON.stringify(newUserData));
        }
      }
      
      return updatedUser;
    } catch (error) {
      console.error('User update error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();