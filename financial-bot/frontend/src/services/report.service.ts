import api, { handleApiError } from './api';

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  largestExpense: {
    category: string;
    amount: number;
    percentage: number;
  };
  periodComparison: {
    income: {
      amount: number;
      percentage: number;
      trend: 'up' | 'down' | 'neutral';
    };
    expense: {
      amount: number;
      percentage: number;
      trend: 'up' | 'down' | 'neutral';
    };
    savings: {
      amount: number;
      percentage: number;
      trend: 'up' | 'down' | 'neutral';
    };
  };
}

export interface CategoryAnalysis {
  category: string;
  total: number;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'neutral';
  previousTotal: number;
  transactions: Array<{
    id: string;
    amount: number;
    date: string;
    description: string;
  }>;
}

export interface TrendAnalysis {
  labels: string[];
  income: number[];
  expense: number[];
  savings: number[];
}

export interface BudgetStatus {
  overBudget: number;
  nearLimit: number;
  underBudget: number;
  categories: Array<{
    name: string;
    status: 'over' | 'near' | 'under';
    spent: number;
    limit: number;
    percentage: number;
  }>;
}

type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
type ReportType = 'income-expense' | 'category' | 'trend';

interface ReportParams {
  startDate?: string;
  endDate?: string;
  period?: ReportPeriod;
  type?: ReportType;
  categories?: string[];
}

export const reportService = {
  async getReportSummary(params: ReportParams) {
    try {
      const response = await api.get<ReportSummary>('/reports/summary', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getCategoryAnalysis(params: ReportParams) {
    try {
      const response = await api.get<CategoryAnalysis[]>('/reports/categories', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getTrendAnalysis(params: ReportParams) {
    try {
      const response = await api.get<TrendAnalysis>('/reports/trends', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getBudgetStatus(params: ReportParams) {
    try {
      const response = await api.get<BudgetStatus>('/reports/budget-status', {
        params,
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async generateReport(params: ReportParams) {
    try {
      const response = await api.post<{ url: string }>('/reports/generate', params);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async scheduleReport(params: ReportParams & {
    frequency: 'daily' | 'weekly' | 'monthly';
    email: string;
    whatsapp?: boolean;
  }) {
    try {
      const response = await api.post('/reports/schedule', params);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async getScheduledReports() {
    try {
      const response = await api.get('/reports/scheduled');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteScheduledReport(id: string) {
    try {
      await api.delete(`/reports/scheduled/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};

// React Query keys for report-related queries
export const reportKeys = {
  all: ['reports'] as const,
  summary: (params: ReportParams) => [...reportKeys.all, 'summary', params] as const,
  categories: (params: ReportParams) => [...reportKeys.all, 'categories', params] as const,
  trends: (params: ReportParams) => [...reportKeys.all, 'trends', params] as const,
  budgetStatus: (params: ReportParams) => [...reportKeys.all, 'budget-status', params] as const,
  scheduled: () => [...reportKeys.all, 'scheduled'] as const,
};

// Usage example with React Query:
/*
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService, reportKeys } from './report.service';

// Get report summary
const { data: summary } = useQuery({
  queryKey: reportKeys.summary({ period: 'monthly' }),
  queryFn: () => reportService.getReportSummary({ period: 'monthly' }),
});

// Get category analysis
const { data: categories } = useQuery({
  queryKey: reportKeys.categories({ period: 'monthly' }),
  queryFn: () => reportService.getCategoryAnalysis({ period: 'monthly' }),
});

// Get trend analysis
const { data: trends } = useQuery({
  queryKey: reportKeys.trends({ period: 'monthly' }),
  queryFn: () => reportService.getTrendAnalysis({ period: 'monthly' }),
});

// Get budget status
const { data: budgetStatus } = useQuery({
  queryKey: reportKeys.budgetStatus({ period: 'monthly' }),
  queryFn: () => reportService.getBudgetStatus({ period: 'monthly' }),
});

// Generate report mutation
const { mutate: generateReport } = useMutation({
  mutationFn: reportService.generateReport,
});

// Schedule report mutation
const queryClient = useQueryClient();
const { mutate: scheduleReport } = useMutation({
  mutationFn: reportService.scheduleReport,
  onSuccess: () => {
    queryClient.invalidateQueries(reportKeys.scheduled());
  },
});

// Get scheduled reports
const { data: scheduledReports } = useQuery({
  queryKey: reportKeys.scheduled(),
  queryFn: reportService.getScheduledReports,
});

// Delete scheduled report mutation
const { mutate: deleteScheduledReport } = useMutation({
  mutationFn: reportService.deleteScheduledReport,
  onSuccess: () => {
    queryClient.invalidateQueries(reportKeys.scheduled());
  },
});
*/
