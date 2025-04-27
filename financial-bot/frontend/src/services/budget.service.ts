import api, { handleApiError, formatUrl } from './api';

export interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  notifications: {
    enabled: boolean;
    threshold: number;
  };
}

export interface Budget {
  id: string;
  name: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
  totalBudget: number;
  totalSpent: number;
  status: 'active' | 'completed' | 'cancelled';
  notifications: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'never';
    channels: {
      whatsapp: boolean;
      email: boolean;
    };
  };
  isRecurring: boolean;
  recurringConfig?: {
    frequency: 'weekly' | 'monthly' | 'yearly';
    autoRenew: boolean;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAlert {
  type: 'overall' | 'category';
  budgetId: string;
  budgetName: string;
  category?: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

interface BudgetFilters {
  status?: 'active' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  period?: Budget['period'];
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export const budgetService = {
  async getBudgets(filters: BudgetFilters = {}, pagination: PaginationParams = {}) {
    try {
      const response = await api.get<{
        data: Budget[];
        total: number;
        page: number;
        totalPages: number;
      }>('/budgets', {
        params: {
          ...filters,
          ...pagination,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getBudget(id: string) {
    try {
      const response = await api.get<Budget>(formatUrl('/budgets/:id', { id }));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createBudget(data: Partial<Budget>) {
    try {
      const response = await api.post<Budget>('/budgets', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateBudget(id: string, data: Partial<Budget>) {
    try {
      const response = await api.put<Budget>(
        formatUrl('/budgets/:id', { id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteBudget(id: string) {
    try {
      await api.delete(formatUrl('/budgets/:id', { id }));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getBudgetAlerts() {
    try {
      const response = await api.get<BudgetAlert[]>('/budgets/alerts');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateBudgetCategory(
    budgetId: string,
    categoryId: string,
    data: Partial<BudgetCategory>
  ) {
    try {
      const response = await api.put<Budget>(
        formatUrl('/budgets/:budgetId/categories/:categoryId', {
          budgetId,
          categoryId,
        }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateBudgetNotifications(
    id: string,
    notifications: Budget['notifications']
  ) {
    try {
      const response = await api.put<Budget>(
        formatUrl('/budgets/:id/notifications', { id }),
        { notifications }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getBudgetSummary(startDate?: string, endDate?: string) {
    try {
      const response = await api.get('/budgets/summary', {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// React Query keys for budget-related queries
export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (filters: BudgetFilters, pagination: PaginationParams) =>
    [...budgetKeys.lists(), { filters, pagination }] as const,
  details: () => [...budgetKeys.all, 'detail'] as const,
  detail: (id: string) => [...budgetKeys.details(), id] as const,
  alerts: () => [...budgetKeys.all, 'alerts'] as const,
  summary: () => [...budgetKeys.all, 'summary'] as const,
};

// Usage example with React Query:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService, budgetKeys } from './budget.service';

// Get budgets list
const { data, isLoading } = useQuery({
  queryKey: budgetKeys.list({ status: 'active' }, { page: 1 }),
  queryFn: () => budgetService.getBudgets({ status: 'active' }, { page: 1 }),
});

// Get budget details
const { data: budget } = useQuery({
  queryKey: budgetKeys.detail('123'),
  queryFn: () => budgetService.getBudget('123'),
});

// Create budget mutation
const queryClient = useQueryClient();
const { mutate: createBudget } = useMutation({
  mutationFn: budgetService.createBudget,
  onSuccess: () => {
    queryClient.invalidateQueries(budgetKeys.lists());
  },
});

// Update budget mutation
const { mutate: updateBudget } = useMutation({
  mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
    budgetService.updateBudget(id, data),
  onSuccess: (_, { id }) => {
    queryClient.invalidateQueries(budgetKeys.detail(id));
    queryClient.invalidateQueries(budgetKeys.lists());
  },
});

// Delete budget mutation
const { mutate: deleteBudget } = useMutation({
  mutationFn: budgetService.deleteBudget,
  onSuccess: () => {
    queryClient.invalidateQueries(budgetKeys.lists());
  },
});

// Get budget alerts
const { data: alerts } = useQuery({
  queryKey: budgetKeys.alerts(),
  queryFn: budgetService.getBudgetAlerts,
});

// Get budget summary
const { data: summary } = useQuery({
  queryKey: budgetKeys.summary(),
  queryFn: () => budgetService.getBudgetSummary(),
});
*/
