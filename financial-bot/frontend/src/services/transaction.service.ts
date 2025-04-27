import api, { handleApiError, formatUrl } from './api';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  source: 'web' | 'whatsapp';
  whatsappNumber?: string;
  tags?: string[];
  attachments?: {
    type: 'image' | 'document';
    url: string;
    name: string;
  }[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  categorySummary: {
    category: string;
    total: number;
    count: number;
  }[];
}

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense';
  category?: string;
  source?: 'web' | 'whatsapp';
  minAmount?: number;
  maxAmount?: number;
  status?: 'pending' | 'completed' | 'cancelled';
  search?: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export const transactionService = {
  async getTransactions(
    filters: TransactionFilters = {},
    pagination: PaginationParams = {}
  ) {
    try {
      const response = await api.get<{
        data: Transaction[];
        total: number;
        page: number;
        totalPages: number;
      }>('/transactions', {
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

  async getTransaction(id: string) {
    try {
      const response = await api.get<Transaction>(
        formatUrl('/transactions/:id', { id })
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async createTransaction(data: Partial<Transaction>) {
    try {
      const response = await api.post<Transaction>('/transactions', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async updateTransaction(id: string, data: Partial<Transaction>) {
    try {
      const response = await api.put<Transaction>(
        formatUrl('/transactions/:id', { id }),
        data
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteTransaction(id: string) {
    try {
      await api.delete(formatUrl('/transactions/:id', { id }));
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getTransactionSummary(startDate?: string, endDate?: string) {
    try {
      const response = await api.get<TransactionSummary>('/transactions/summary', {
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

  async uploadAttachment(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ url: string; name: string }>(
        '/transactions/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// React Query keys for transaction-related queries
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: TransactionFilters, pagination: PaginationParams) =>
    [...transactionKeys.lists(), { filters, pagination }] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  summary: () => [...transactionKeys.all, 'summary'] as const,
};

// Usage example with React Query:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService, transactionKeys } from './transaction.service';

// Get transactions list
const { data, isLoading } = useQuery({
  queryKey: transactionKeys.list({ type: 'expense' }, { page: 1, limit: 10 }),
  queryFn: () =>
    transactionService.getTransactions(
      { type: 'expense' },
      { page: 1, limit: 10 }
    ),
});

// Get transaction details
const { data: transaction } = useQuery({
  queryKey: transactionKeys.detail('123'),
  queryFn: () => transactionService.getTransaction('123'),
});

// Create transaction mutation
const queryClient = useQueryClient();
const { mutate: createTransaction } = useMutation({
  mutationFn: transactionService.createTransaction,
  onSuccess: () => {
    // Invalidate and refetch transactions list
    queryClient.invalidateQueries(transactionKeys.lists());
  },
});

// Update transaction mutation
const { mutate: updateTransaction } = useMutation({
  mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
    transactionService.updateTransaction(id, data),
  onSuccess: (_, { id }) => {
    // Invalidate and refetch specific transaction and lists
    queryClient.invalidateQueries(transactionKeys.detail(id));
    queryClient.invalidateQueries(transactionKeys.lists());
  },
});

// Delete transaction mutation
const { mutate: deleteTransaction } = useMutation({
  mutationFn: transactionService.deleteTransaction,
  onSuccess: () => {
    // Invalidate and refetch transactions list
    queryClient.invalidateQueries(transactionKeys.lists());
  },
});

// Get transaction summary
const { data: summary } = useQuery({
  queryKey: transactionKeys.summary(),
  queryFn: () => transactionService.getTransactionSummary(),
});
*/
