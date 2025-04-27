import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          FinanceBot
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your Personal Financial Assistant
        </p>
      </div>

      {/* Auth Content */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FinanceBot. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
