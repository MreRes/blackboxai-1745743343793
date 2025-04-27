import { TRANSACTION_TYPES, BUDGET_PERIODS, REPORT_TYPES } from './constants';

// Auth Types
export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Transaction Types
export type TransactionType = typeof TRANSACTION_TYPES[keyof typeof TRANSACTION_TYPES];

export interface Transaction {
  id: string;
  user: string;
  type: TransactionType;
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

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  category?: string;
  source?: 'web' | 'whatsapp';
  minAmount?: number;
  maxAmount?: number;
  status?: Transaction['status'];
  search?: string;
}

// Budget Types
export type BudgetPeriod = typeof BUDGET_PERIODS[keyof typeof BUDGET_PERIODS];

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
  period: BudgetPeriod;
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

// Report Types
export type ReportType = typeof REPORT_TYPES[keyof typeof REPORT_TYPES];

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

// WhatsApp Types
export interface WhatsAppSession {
  id: string;
  phoneNumber: string;
  status: 'active' | 'inactive' | 'expired';
  lastActive: string;
  deviceInfo: {
    platform: string;
    browser: string;
    version: string;
  };
  settings: {
    autoReply: {
      enabled: boolean;
      message: string;
    };
    notifications: {
      budgetAlerts: boolean;
      dailySummary: boolean;
      weeklyReport: boolean;
    };
    language: 'id' | 'en';
    timezone: string;
  };
  nlpSettings: {
    enabled: boolean;
    confidence: number;
    customPhrases: Array<{
      phrase: string;
      intent: string;
      examples: string[];
    }>;
  };
  qrCode?: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }>;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
      display?: boolean;
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    y?: {
      beginAtZero?: boolean;
      ticks?: {
        callback?: (value: number) => string;
      };
    };
  };
}

// Form Types
export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}
