import { useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { FormErrors } from '../utils/types';

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => FormErrors<T>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(() => {
    const touchedFields: Record<string, boolean> = {};
    Object.keys(initialValues).forEach((key) => {
      touchedFields[key] = false;
    });
    return touchedFields as Record<keyof T, boolean>;
  });

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: type === 'number' ? (value ? Number(value) : '') : value,
      }));

      if (validate) {
        const validationErrors = validate({
          ...values,
          [name]: type === 'number' ? (value ? Number(value) : '') : value,
        });
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name],
        }));
      }
    },
    [values, validate]
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      if (validate) {
        const validationErrors = validate(values);
        setErrors((prev) => ({
          ...prev,
          [name]: validationErrors[name],
        }));
      }
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (validate) {
      const validationErrors = validate({
        ...values,
        [name]: value,
      });
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name],
      }));
    }
  }, [values, validate]);

  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(
      Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: false }),
        {} as Record<keyof T, boolean>
      )
    );
  }, [initialValues]);

  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setFieldError,
    setFieldTouched,
    resetForm,
  };
}

// Usage example:
/*
interface LoginForm {
  username: string;
  password: string;
}

const LoginPage = () => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<LoginForm>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: (values) => {
      const errors: FormErrors<LoginForm> = {};
      
      if (!values.username) {
        errors.username = 'Username is required';
      }
      
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await login(values);
        // Handle successful login
      } catch (error) {
        // Handle login error
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="username"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.username ? errors.username : undefined}
      />
      <Input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password ? errors.password : undefined}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
*/
