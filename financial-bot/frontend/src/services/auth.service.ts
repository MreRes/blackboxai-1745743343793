import api, { handleApiError } from './api';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    role: 'user' | 'admin';
  };
  token: string;
}

interface RegisterResponse {
  message: string;
  username: string;
  activationCode: string;
}

interface ActivationResponse {
  message: string;
  success: boolean;
}

export const authService = {
  async login(username: string, activationCode: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        username,
        activationCode,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async register(
    username: string,
    password: string,
    phoneNumber: string
  ): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', {
        username,
        password,
        phoneNumber,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async activate(
    username: string,
    activationCode: string
  ): Promise<ActivationResponse> {
    try {
      const response = await api.post<ActivationResponse>('/auth/activate', {
        username,
        activationCode,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async resendActivationCode(username: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        '/auth/resend-activation',
        {
          username,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await api.put<{ message: string }>(
        '/auth/update-password',
        {
          currentPassword,
          newPassword,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// React Query keys for auth-related queries
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

// Usage example with React Query:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, authKeys } from './auth.service';

// Get user profile
const { data: profile, isLoading } = useQuery({
  queryKey: authKeys.profile(),
  queryFn: authService.getProfile,
});

// Login mutation
const queryClient = useQueryClient();
const { mutate: login, isLoading: isLoggingIn } = useMutation({
  mutationFn: (credentials: { username: string; activationCode: string }) =>
    authService.login(credentials.username, credentials.activationCode),
  onSuccess: (data) => {
    // Store token
    localStorage.setItem('token', data.token);
    // Invalidate and refetch profile
    queryClient.invalidateQueries(authKeys.profile());
  },
});

// Register mutation
const { mutate: register, isLoading: isRegistering } = useMutation({
  mutationFn: (data: { username: string; password: string; phoneNumber: string }) =>
    authService.register(data.username, data.password, data.phoneNumber),
});

// Logout mutation
const { mutate: logout } = useMutation({
  mutationFn: authService.logout,
  onSuccess: () => {
    // Clear all queries from cache on logout
    queryClient.clear();
  },
});
*/
