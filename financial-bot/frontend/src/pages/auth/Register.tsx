import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement registration API call
      // const response = await registerUser(formData);
      setSuccess('Registration successful! Please check your WhatsApp for the activation code.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{success}</h3>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <div className="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              required
              className="input-field"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="form-label">
            WhatsApp Number
          </label>
          <div className="mt-1">
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              placeholder="e.g., 628123456789"
              className="input-field"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Include country code without '+' (e.g., 628123456789)
          </p>
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="input-field"
              value={formData.confirmPassword}
              onChange={handleChange}
              minLength={6}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="btn-primary w-full flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              'Register'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Already have an account?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="btn-secondary w-full flex justify-center"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
