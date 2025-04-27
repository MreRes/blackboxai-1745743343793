// Authentication
export const AUTH_TOKEN_KEY = 'token';
export const ACTIVATION_CODE_LENGTH = 6;
export const PASSWORD_MIN_LENGTH = 8;

// Transaction Types
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

// Transaction Categories
export const TRANSACTION_CATEGORIES = {
  INCOME: [
    { value: 'salary', label: 'Salary' },
    { value: 'business', label: 'Business' },
    { value: 'investment', label: 'Investment' },
    { value: 'other_income', label: 'Other Income' },
  ],
  EXPENSE: [
    { value: 'food', label: 'Food & Drinks' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'bills', label: 'Bills & Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'health', label: 'Health & Medical' },
    { value: 'education', label: 'Education' },
    { value: 'other_expense', label: 'Other Expense' },
  ],
} as const;

// Budget Periods
export const BUDGET_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
  CUSTOM: 'custom',
} as const;

// Report Types
export const REPORT_TYPES = {
  INCOME_EXPENSE: 'income-expense',
  CATEGORY: 'category',
  TREND: 'trend',
} as const;

// WhatsApp Settings
export const WHATSAPP_SETTINGS = {
  DEFAULT_AUTO_REPLY: 'Terima kasih atas pesannya. Saya akan memproses transaksi keuangan Anda segera.',
  LANGUAGES: {
    ID: 'id',
    EN: 'en',
  },
  DEFAULT_TIMEZONE: 'Asia/Jakarta',
  NLP_CONFIDENCE_THRESHOLD: 0.7,
} as const;

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#0EA5E9', // sky-500
  SUCCESS: '#22C55E', // green-500
  DANGER: '#EF4444',  // red-500
  WARNING: '#F59E0B', // amber-500
  INFO: '#3B82F6',    // blue-500
  GRAY: '#6B7280',    // gray-500
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: {
    SHORT: 'dd/MM/yyyy',
    MEDIUM: 'd MMM yyyy',
    LONG: 'd MMMM yyyy',
    FULL: 'EEEE, d MMMM yyyy',
  },
  API: 'yyyy-MM-dd',
  TIMESTAMP: 'yyyy-MM-dd HH:mm:ss',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ACTIVATE: '/auth/activate',
    PROFILE: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  TRANSACTIONS: {
    BASE: '/transactions',
    SUMMARY: '/transactions/summary',
    UPLOAD: '/transactions/upload',
  },
  BUDGETS: {
    BASE: '/budgets',
    ALERTS: '/budgets/alerts',
    SUMMARY: '/budgets/summary',
  },
  WHATSAPP: {
    INIT: '/whatsapp/init',
    SESSIONS: '/whatsapp/sessions',
    QR: '/whatsapp/qr',
    STATUS: '/whatsapp/status',
    SETTINGS: '/whatsapp/settings',
    DISCONNECT: '/whatsapp/disconnect',
    NLP: '/whatsapp/nlp',
    LOGS: '/whatsapp/logs',
  },
  REPORTS: {
    SUMMARY: '/reports/summary',
    CATEGORIES: '/reports/categories',
    TRENDS: '/reports/trends',
    GENERATE: '/reports/generate',
    SCHEDULE: '/reports/schedule',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'An error occurred. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_PHONE: 'Invalid phone number',
    PASSWORD_LENGTH: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    PASSWORDS_MATCH: 'Passwords do not match',
    INVALID_AMOUNT: 'Amount must be greater than 0',
    INVALID_DATE: 'Invalid date',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_SETTINGS: 'user_settings',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// File Upload
export const UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;

// Query Keys
export const QUERY_KEYS = {
  AUTH: {
    PROFILE: ['auth', 'profile'],
    SESSION: ['auth', 'session'],
  },
  TRANSACTIONS: {
    ALL: ['transactions'],
    LIST: ['transactions', 'list'],
    DETAIL: (id: string) => ['transactions', 'detail', id],
    SUMMARY: ['transactions', 'summary'],
  },
  BUDGETS: {
    ALL: ['budgets'],
    LIST: ['budgets', 'list'],
    DETAIL: (id: string) => ['budgets', 'detail', id],
    ALERTS: ['budgets', 'alerts'],
  },
  WHATSAPP: {
    SESSIONS: ['whatsapp', 'sessions'],
    STATUS: (id: string) => ['whatsapp', 'status', id],
    QR: (id: string) => ['whatsapp', 'qr', id],
  },
  REPORTS: {
    SUMMARY: ['reports', 'summary'],
    TRENDS: ['reports', 'trends'],
    CATEGORIES: ['reports', 'categories'],
  },
} as const;
