import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isFullWidth?: boolean;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      isFullWidth = true,
      containerClassName = '',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputClasses = `
      block
      rounded-md
      border-0
      text-gray-900
      shadow-sm
      ring-1
      ring-inset
      ${error ? 'ring-red-300' : 'ring-gray-300'}
      placeholder:text-gray-400
      focus:ring-2
      focus:ring-inset
      ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'}
      sm:text-sm
      sm:leading-6
      disabled:bg-gray-50
      disabled:text-gray-500
      disabled:ring-gray-200
      ${leftIcon ? 'pl-10' : 'pl-4'}
      ${rightIcon ? 'pr-10' : 'pr-4'}
      py-2
      ${className}
    `;

    return (
      <div className={`${isFullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-6 text-gray-900 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="mt-1 text-sm text-gray-500" id={`${id}-hint`}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  Omit<InputProps, 'leftIcon' | 'rightIcon'> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(
  (
    {
      label,
      error,
      hint,
      isFullWidth = true,
      containerClassName = '',
      className = '',
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const textareaClasses = `
      block
      w-full
      rounded-md
      border-0
      text-gray-900
      shadow-sm
      ring-1
      ring-inset
      ${error ? 'ring-red-300' : 'ring-gray-300'}
      placeholder:text-gray-400
      focus:ring-2
      focus:ring-inset
      ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'}
      sm:text-sm
      sm:leading-6
      disabled:bg-gray-50
      disabled:text-gray-500
      disabled:ring-gray-200
      p-4
      ${className}
    `;

    return (
      <div className={`${isFullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium leading-6 text-gray-900 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={textareaClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${id}-error`}>
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="mt-1 text-sm text-gray-500" id={`${id}-hint`}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default Input;

// Usage examples:
/*
// Basic input
<Input
  label="Username"
  placeholder="Enter your username"
  id="username"
/>

// Input with error
<Input
  label="Email"
  type="email"
  error="Please enter a valid email address"
  id="email"
/>

// Input with hint
<Input
  label="Password"
  type="password"
  hint="Must be at least 8 characters"
  id="password"
/>

// Input with icons
<Input
  label="Search"
  leftIcon={<SearchIcon />}
  rightIcon={<ClearIcon />}
  id="search"
/>

// Disabled input
<Input
  label="Username"
  disabled
  value="johndoe"
  id="username"
/>

// TextArea
<TextArea
  label="Description"
  placeholder="Enter description"
  rows={4}
  id="description"
/>

// TextArea with error
<TextArea
  label="Comments"
  error="Comments cannot be empty"
  id="comments"
/>
*/
