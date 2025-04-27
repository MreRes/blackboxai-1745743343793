import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-50 disabled:text-gray-400',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
      ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 disabled:text-gray-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${variants[variant]}
          ${sizes[size]}
          ${isFullWidth ? 'w-full' : ''}
          ${isLoading ? 'cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <LoadingSpinner
            size={size === 'lg' ? 'md' : 'sm'}
            className="mr-2"
          />
        ) : leftIcon ? (
          <span className={`mr-2 ${iconSizes[size]}`}>{leftIcon}</span>
        ) : null}
        
        {children}
        
        {!isLoading && rightIcon && (
          <span className={`ml-2 ${iconSizes[size]}`}>{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// IconButton component for buttons that only contain an icon
interface IconButtonProps extends ButtonProps {
  'aria-label': string;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      variant = 'ghost',
      size = 'md',
      className = '',
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: 'p-1',
      md: 'p-2',
      lg: 'p-3',
    };

    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        className={`${sizes[size]} ${className}`}
        aria-label={ariaLabel}
        {...props}
      >
        <span className={iconSizes[size]}>{icon}</span>
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default Button;

// Usage examples:
/*
// Regular buttons
<Button>Default Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="danger">Danger Button</Button>
<Button variant="ghost">Ghost Button</Button>

// Loading state
<Button isLoading>Loading</Button>

// With icons
<Button
  leftIcon={<IconComponent />}
  rightIcon={<IconComponent />}
>
  With Icons
</Button>

// Icon button
<IconButton
  aria-label="Close"
  icon={<IconComponent />}
  variant="ghost"
  size="sm"
/>

// Full width button
<Button isFullWidth>Full Width Button</Button>

// Disabled state
<Button disabled>Disabled Button</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
*/
