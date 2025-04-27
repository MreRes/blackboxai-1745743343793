import { useState, useCallback, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
}

interface UseToastOptions {
  maxToasts?: number;
  defaultDuration?: number;
}

const DEFAULT_MAX_TOASTS = 3;
const DEFAULT_DURATION = 5000; // 5 seconds

export function useToast(options: UseToastOptions = {}) {
  const maxToasts = options.maxToasts ?? DEFAULT_MAX_TOASTS;
  const defaultDuration = options.defaultDuration ?? DEFAULT_DURATION;
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Remove a toast by ID
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Add a new toast
  const addToast = useCallback(
    (
      type: ToastType,
      message: string,
      title?: string,
      duration: number = defaultDuration
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: Toast = {
        id,
        type,
        message,
        title,
        duration,
      };

      setToasts((prev) => {
        // Remove oldest toasts if exceeding maxToasts
        const updatedToasts = [...prev, newToast];
        return updatedToasts.slice(Math.max(0, updatedToasts.length - maxToasts));
      });

      // Auto-remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [maxToasts, defaultDuration, removeToast]
  );

  // Convenience methods for different toast types
  const success = useCallback(
    (message: string, title?: string, duration?: number) =>
      addToast('success', message, title, duration ?? defaultDuration),
    [addToast, defaultDuration]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) =>
      addToast('error', message, title, duration ?? defaultDuration),
    [addToast, defaultDuration]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) =>
      addToast('warning', message, title, duration ?? defaultDuration),
    [addToast, defaultDuration]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) =>
      addToast('info', message, title, duration ?? defaultDuration),
    [addToast, defaultDuration]
  );

  // Clear all toasts
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Clean up any remaining toasts on unmount
  useEffect(() => {
    return () => {
      setToasts([]);
    };
  }, []);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAll,
  };
}

// Usage example:
/*
// ToastProvider.tsx
import { createContext, useContext } from 'react';
import { useToast, Toast } from './useToast';

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ToastContainer.tsx
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            transform transition-all duration-300 ease-in-out
            ${getToastStyles(toast.type)}
            max-w-md w-full bg-white rounded-lg shadow-lg
            pointer-events-auto flex ring-1 ring-black ring-opacity-5
          `}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex-1 p-4">
            {toast.title && (
              <p className="text-sm font-medium text-gray-900">{toast.title}</p>
            )}
            <p className="text-sm text-gray-500">{toast.message}</p>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => onRemove(toast.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const getToastStyles = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-500';
    case 'error':
      return 'bg-red-50 border-red-500';
    case 'warning':
      return 'bg-yellow-50 border-yellow-500';
    case 'info':
      return 'bg-blue-50 border-blue-500';
    default:
      return 'bg-gray-50 border-gray-500';
  }
};

// Usage in components
const MyComponent = () => {
  const toast = useToastContext();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('An error occurred', 'Error Title');
  };

  const handleWarning = () => {
    toast.warning('Please be careful', 'Warning', 10000); // 10 seconds
  };

  const handleInfo = () => {
    toast.info('Did you know...?');
  };

  return (
    <div>
      <button onClick={handleSuccess
