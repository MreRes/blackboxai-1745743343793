import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      window.location.href = '/dashboard';
    }

    return Promise.reject(error);
  }
);

export default api;

// API Error type
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    if (apiError?.message) {
      return apiError.message;
    }
    if (apiError?.errors) {
      return Object.values(apiError.errors)
        .flat()
        .join(', ');
    }
    return error.message;
  }
  return 'An unexpected error occurred';
}

// Helper function to format API URLs with parameters
export function formatUrl(url: string, params: Record<string, string> = {}) {
  return Object.keys(params).reduce((acc, key) => {
    return acc.replace(`:${key}`, params[key]);
  }, url);
}

// Example usage:
/*
import api, { handleApiError, formatUrl } from './api';

// Basic GET request
try {
  const response = await api.get('/users');
  return response.data;
} catch (error) {
  throw new Error(handleApiError(error));
}

// POST request with data
try {
  const response = await api.post('/users', {
    name: 'John Doe',
    email: 'john@example.com',
  });
  return response.data;
} catch (error) {
  throw new Error(handleApiError(error));
}

// URL with parameters
const userId = '123';
const url = formatUrl('/users/:userId/posts', { userId });
try {
  const response = await api.get(url);
  return response.data;
} catch (error) {
  throw new Error(handleApiError(error));
}

// Request with query parameters
try {
  const response = await api.get('/posts', {
    params: {
      page: 1,
      limit: 10,
      sort: 'desc',
    },
  });
  return response.data;
} catch (error) {
  throw new Error(handleApiError(error));
}

// Request with headers
try {
  const response = await api.get('/protected-resource', {
    headers: {
      'Custom-Header': 'value',
    },
  });
  return response.data;
} catch (error) {
  throw new Error(handleApiError(error));
}
*/
