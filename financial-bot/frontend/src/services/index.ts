import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { handleApiError, formatUrl, type ApiError } from './api';
import { authService } from './auth.service';
import { transactionService, type Transaction } from './transaction.service';
import { budgetService, type Budget, type BudgetCategory, type BudgetAlert } from './budget.service';
import { whatsappService, type WhatsAppSession } from './whatsapp.service';
import { reportService, type ReportSummary, type CategoryAnalysis, type TrendAnalysis, type BudgetStatus } from './report.service';

// Re-export everything
export {
  api,
  handleApiError,
  formatUrl,
  authService,
  transactionService,
  budgetService,
  whatsappService,
  reportService,
};

// Re-export types
export type {
  ApiError,
  Transaction,
  Budget,
  BudgetCategory,
  BudgetAlert,
  WhatsAppSession,
  ReportSummary,
  CategoryAnalysis,
  TrendAnalysis,
  BudgetStatus,
};

// Create a unified API interface
export const services = {
  auth: authService,
  transactions: transactionService,
  budgets: budgetService,
  whatsapp: whatsappService,
  reports: reportService,
};

// Custom hooks
export const useAuth = () => {
  const queryClient = useQueryClient();

  return {
    login: useMutation({
      mutationFn: (credentials: { username: string; activationCode: string }) =>
        services.auth.login(credentials.username, credentials.activationCode),
      onSuccess: (data) => {
        localStorage.setItem('token', data.token);
        queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      },
    }),
    logout: useMutation({
      mutationFn: services.auth.logout,
      onSuccess: () => {
        queryClient.clear();
      },
    }),
    profile: useQuery({
      queryKey: ['auth', 'profile'],
      queryFn: services.auth.getProfile,
    }),
  };
};

export const useTransactions = (filters = {}, pagination = {}) => {
  const queryClient = useQueryClient();

  return {
    transactions: useQuery({
      queryKey: ['transactions', 'list', { filters, pagination }],
      queryFn: () => services.transactions.getTransactions(filters, pagination),
    }),
    create: useMutation({
      mutationFn: services.transactions.createTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions', 'list'] });
      },
    }),
    update: useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
        services.transactions.updateTransaction(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['transactions', 'detail', id] });
        queryClient.invalidateQueries({ queryKey: ['transactions', 'list'] });
      },
    }),
    delete: useMutation({
      mutationFn: services.transactions.deleteTransaction,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions', 'list'] });
      },
    }),
  };
};

export const useBudgets = () => {
  const queryClient = useQueryClient();

  return {
    budgets: useQuery({
      queryKey: ['budgets', 'list'],
      queryFn: () => services.budgets.getBudgets(),
    }),
    alerts: useQuery({
      queryKey: ['budgets', 'alerts'],
      queryFn: services.budgets.getBudgetAlerts,
    }),
    create: useMutation({
      mutationFn: services.budgets.createBudget,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
      },
    }),
  };
};

export const useWhatsApp = () => {
  const queryClient = useQueryClient();

  return {
    sessions: useQuery({
      queryKey: ['whatsapp', 'sessions'],
      queryFn: services.whatsapp.getSessions,
    }),
    initialize: useMutation({
      mutationFn: services.whatsapp.initializeSession,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['whatsapp', 'sessions'] });
      },
    }),
  };
};

export const useReports = (params = {}) => {
  return {
    summary: useQuery({
      queryKey: ['reports', 'summary', params],
      queryFn: () => services.reports.getReportSummary(params),
    }),
    trends: useQuery({
      queryKey: ['reports', 'trends', params],
      queryFn: () => services.reports.getTrendAnalysis(params),
    }),
  };
};
