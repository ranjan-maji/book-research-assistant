
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 seconds for comprehensive search
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. The backend might be processing a large search.';
    }
    
    return Promise.reject(error);
  }
);

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await api.get('/test');
    return response.data;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    throw error;
  }
};

// Main search function with enhanced error handling
export const searchResearch = async (bookData) => {
  try {
    console.log('🔍 Sending search request to backend...', bookData);
    
    const response = await api.post('/search', {
      title: bookData.title,
      topic: bookData.topic,
      year: parseInt(bookData.year) || new Date().getFullYear(),
      keywords: bookData.keywords || [],
      maxResults: parseInt(bookData.maxResults) || 50,
      // Add any additional parameters your backend expects
      depth: 'comprehensive',
    });
    
    console.log('✅ Search completed successfully');
    return response.data;
  } catch (error) {
    console.error('💥 API Search Error:', error);
    
    // Enhanced error messages with more context
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid search parameters. Please check your inputs.');
        case 404:
          throw new Error('Search endpoint not found. Please check backend configuration.');
        case 429:
          throw new Error('Rate limit exceeded. Please try again in a few moments.');
        case 500:
          throw new Error('Server error during search. Please try again later.');
        default:
          throw new Error(`Server error: ${status} - ${data.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Search timeout. The query might be taking longer than expected. Try with more specific terms.');
      } else if (error.message.includes('Network Error')) {
        throw new Error('Network error. Please check your internet connection and backend server.');
      } else {
        throw new Error('No response from server. The backend might be down or unreachable.');
      }
    } else {
      throw new Error('Request setup failed: ' + error.message);
    }
  }
};

// Get health status with retry logic
export const getHealth = async () => {
  try {
    // Try multiple endpoints
    const endpoints = [
      API_BASE_URL.replace('/api', '/health'),
      `${API_BASE_URL}/health`,
      API_BASE_URL.replace('/api', ''),
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint, {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
          }
        });
        return response.data;
      } catch (e) {
        continue; // Try next endpoint
      }
    }
    
    throw new Error('No health endpoint responded');
  } catch (error) {
    console.warn('⚠️ Health check failed:', error.message);
    return { 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Export default for backward compatibility
export default api;