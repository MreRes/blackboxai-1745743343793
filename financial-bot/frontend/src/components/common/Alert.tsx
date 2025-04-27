import { ReactNode } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}

const Alert = ({ type, title, children, onClose }: AlertProps) => {
  const styles = {
    success: {
      wrapper: 'bg-green-50',
      icon: 'text-green-400',
      title: 'text-green-800',
      content: 'text-green-700',
      close: 'bg-green-50 text-green-500 hover:bg-green-100',
    },
    error: {
      wrapper: 'bg-red-50',
      icon: 'text-red-400',
      title: 'text-red-800',
      content: 'text-red-700',
      close: 'bg-red-50 text-red-500 hover:bg-red-100',
    },
    warning: {
      wrapper: 'bg-yellow-50',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      content: 'text-yellow-700',
      close: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100',
    },
    info: {
      wrapper: 'bg-blue-50',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      content: 'text-blue-700',
      close: 'bg-blue-50 text-blue-500 hover:bg-blue-100',
    },
  };

  const icons = {
    success: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    error: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    warning: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    ),
    info: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  };

  return (
    <div className={`rounded-md p-4 ${styles[type].wrapper}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${styles[type].icon}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            {icons[type]}
          </svg>
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${styles[type].title}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles[type].content}`}>{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  styles[type].close
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
