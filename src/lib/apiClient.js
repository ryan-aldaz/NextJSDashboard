// Base API client with common configuration and error handling
class ApiClient {
  constructor(baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Add authentication token to headers
  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle different content types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      // Log error for monitoring (you might want to use a service like Sentry)
      console.error('API Request failed:', { url, error });
      throw error;
    }
  }

  // Convenience methods
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();

export default apiClient;

/* 
// Example usage with real API:

// For external APIs, you might initialize like this:
const externalApiClient = new ApiClient('https://api.example.com/v1');

// Set authentication token (from login, environment, etc.)
apiClient.setAuthToken(process.env.API_TOKEN || getTokenFromStorage());

// Different ways to use the client:
const data = await apiClient.get('/users');
const newUser = await apiClient.post('/users', { name: 'John', email: 'john@example.com' });
*/ 