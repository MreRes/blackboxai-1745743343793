// Date formatting
export const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions = {}) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Date(date).toLocaleDateString('id-ID', defaultOptions);
};

// Currency formatting
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Percentage formatting
export const formatPercentage = (value: number, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

// Phone number formatting
export const formatPhoneNumber = (phoneNumber: string) => {
  // Remove any non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it starts with '0' or '62'
  if (cleaned.startsWith('0')) {
    return `62${cleaned.slice(1)}`;
  }
  if (!cleaned.startsWith('62')) {
    return `62${cleaned}`;
  }
  return cleaned;
};

// Validation helpers
export const validators = {
  required: (value: any) => {
    if (value === null || value === undefined) return 'This field is required';
    if (typeof value === 'string' && !value.trim()) return 'This field is required';
    return '';
  },

  email: (value: string) => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Invalid email address';
  },

  phoneNumber: (value: string) => {
    if (!value) return '';
    const phoneRegex = /^(0|62)\d{9,13}$/;
    return phoneRegex.test(value) ? '' : 'Invalid phone number';
  },

  minLength: (length: number) => (value: string) => {
    if (!value) return '';
    return value.length >= length ? '' : `Must be at least ${length} characters`;
  },

  maxLength: (length: number) => (value: string) => {
    if (!value) return '';
    return value.length <= length ? '' : `Must be no more than ${length} characters`;
  },

  number: (value: string) => {
    if (!value) return '';
    return isNaN(Number(value)) ? 'Must be a number' : '';
  },

  positiveNumber: (value: string) => {
    if (!value) return '';
    const num = Number(value);
    return isNaN(num) || num <= 0 ? 'Must be a positive number' : '';
  },
};

// Color generation for charts and UI elements
export const generateColors = (count: number) => {
  const colors = [
    '#FF6384', // Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#FF99CC', // Pink
    '#66CC99', // Green
  ];

  if (count <= colors.length) {
    return colors.slice(0, count);
  }

  // Generate additional colors if needed
  const additional = count - colors.length;
  for (let i = 0; i < additional; i++) {
    const hue = (i * (360 / additional)) % 360;
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }

  return colors;
};

// Date range helpers
export const dateRanges = {
  today: () => {
    const now = new Date();
    return {
      start: new Date(now.setHours(0, 0, 0, 0)),
      end: new Date(now.setHours(23, 59, 59, 999)),
    };
  },

  thisWeek: () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setDate(now.getDate() + (6 - now.getDay()));
    end.setHours(23, 59, 59, 999);

    return { start, end };
  },

  thisMonth: () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { start, end };
  },

  thisYear: () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return { start, end };
  },

  last7Days: () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { start, end: new Date(now) };
  },

  last30Days: () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return { start, end: new Date(now) };
  },
};

// File size formatting
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
) => {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(deepClone) as unknown as T;
  }
  
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
  ) as T;
};

// URL query string helpers
export const queryString = {
  parse: (search: string) => {
    const params = new URLSearchParams(search);
    const result: Record<string, string> = {};
    params.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  },

  stringify: (params: Record<string, string | number | boolean>) => {
    return new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();
  },
};
