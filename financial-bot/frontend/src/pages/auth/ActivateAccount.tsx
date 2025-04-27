import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ActivateAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    username: searchParams.get('username') || '',
    activationCode: searchParams.get('code') || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // If activation code is provided in URL, auto-submit
    if (formData.username && formData.activationCode) {
      handleSubmit();
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement activation API call
      // const response = await activateAccount(formData);
      // If successful, redirect to login
      setCountdown(3);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement resend code API call
      // await resendActivationCode(formData.username);
      setCountdown(60); // Start 60-second countdown
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

        {countdown > 0 && countdown <= 3 && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Account activated successfully! Redirecting in {countdown}...
                </h3>
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
          <label htmlFor="activationCode" className="form-label">
            Activation Code
          </label>
          <div className="mt-1">
            <input
              id="activationCode"
              name="activationCode"
              type="text"
              required
              className="input-field"
              value={formData.activationCode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            className="btn-primary w-full flex justify-center"
            disabled={isLoading || countdown > 0}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              'Activate Account'
            )}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            className="btn-secondary w-full flex justify-center"
            disabled={isLoading || countdown > 3}
          >
            {countdown > 3 ? (
              `Resend code in ${countdown}s`
            ) : (
              'Resend activation code'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/login')}
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          Return to login
        </button>
      </div>
    </div>
  );
};

export default ActivateAccount;
