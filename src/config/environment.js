// Environment configuration for different API setups

const environments = {
  development: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws',
    enableMocking: true,
    enableLogging: true,
    retryAttempts: 1,
  },
  staging: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://staging-api.example.com/v1',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'wss://staging-api.example.com/ws',
    enableMocking: false,
    enableLogging: true,
    retryAttempts: 3,
  },
  production: {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com/v1',
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws',
    enableMocking: false,
    enableLogging: false,
    retryAttempts: 3,
  }
};

const currentEnv = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';
const config = environments[currentEnv] || environments.development;

export default config;

/* 
===========================================
ENVIRONMENT SETUP EXAMPLES
===========================================

// .env.local (for local development)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_ENVIRONMENT=development
API_TOKEN=dev_token_123

// .env.staging
NEXT_PUBLIC_API_BASE_URL=https://staging-api.example.com/v1
NEXT_PUBLIC_ENVIRONMENT=staging
API_TOKEN=staging_token_456

// .env.production
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/v1
NEXT_PUBLIC_ENVIRONMENT=production
API_TOKEN=prod_token_789

// Usage in apiClient.js:
import config from '../config/environment';

const apiClient = new ApiClient(config.apiBaseUrl);

if (process.env.API_TOKEN) {
  apiClient.setAuthToken(process.env.API_TOKEN);
}

// Usage in components:
if (config.enableLogging) {
  console.log('API call made:', data);
}
*/ 