import { forwardRef, SelectHTMLAttributes } from 'react';

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: (Option | OptionGroup)[];
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  containerClassName?: string;
}

const isOptionGroup = (option: Option | OptionGroup): option is OptionGroup => {
  return 'options' in option;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      size = 'md',
      isFullWidth = true,
      containerClassName = '',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: 'py-1.5 text-sm',
      md: 'py-2 text-sm',
      lg: 'py-2.5 text-base',
    };

    const selectClasses = `
      block
      rounded-md
      border-0
      text-gray-900
      shadow-sm
      ring-1
      ring-inset
      ${error ? 'ring-red-300' : 'ring-gray-300'}
      focus:ring-2
      focus:ring-inset
      ${error ? 'focus:ring-red-500' : 'focus:ring-primary-500'}
      disabled:bg-gray-50
      disabled:text-gray-500
      disabled:ring-gray-200
      ${sizes[size]}
      pl-4
      pr-10
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
          <select
            ref={ref}
            id={id}
            className={selectClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            {...props}
          >
            {options.map((option, index) => {
              if (isOptionGroup(option)) {
                return (
                  <optgroup key={index} label={option.label}>
                    {option.options.map((groupOption, groupIndex) => (
                      <option
                        key={`${index}-${groupIndex}`}
                        value={groupOption.value}
                        disabled={groupOption.disabled}
                      >
                        {groupOption.label}
                      </option>
                    ))}
                  </optgroup>
                );
              }

              return (
                <option
                  key={index}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
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

Select.displayName = 'Select';

export default Select;

// Usage examples:
/*
// Basic select
<Select
  label="Country"
  options={[
    { value: '', label: 'Select a country', disabled: true },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico' },
  ]}
  id="country"
/>

// Select with option groups
<Select
  label="Car"
  options={[
    {
      label: 'Japanese Cars',
      options: [
        { value: 'toyota', label: 'Toyota' },
        { value: 'honda', label: 'Honda' },
      ],
    },
    {
      label: 'German Cars',
      options: [
        { value: 'bmw', label: 'BMW' },
        { value: 'mercedes', label: 'Mercedes' },
      ],
    },
  ]}
  id="car"
/>

// Select with error
<Select
  label="Category"
  error="Please select a category"
  options={[
    { value: '', label: 'Select a category' },
    { value: 'food', label: 'Food & Drinks' },
    { value: 'transport', label: 'Transportation' },
  ]}
  id="category"
/>

// Disabled select
<Select
  label="Status"
  disabled
  options={[
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
  id="status"
/>

// Different sizes
<Select
  size="sm"
  options={[...]}
  id="small"
/>
<Select
  size="md"
  options={[...]}
  id="medium"
/>
<Select
  size="lg"
  options={[...]}
  id="large"
/>
*/
