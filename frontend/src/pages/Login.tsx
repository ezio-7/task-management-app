import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoginForm from '../components/auth/LoginForm';
import { RootState } from '../store';

const Login = () => {
  const navigate = useNavigate();
  const { user, isError, message } = useSelector(
    (state: RootState) => state.auth
  );
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-8 text-white text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-blue-100 mt-2">Sign in to your account to continue</p>
        </div>
        
        <div className="p-6">
          {isError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <div className="flex">
                <svg className="h-6 w-6 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{message}</span>
              </div>
            </div>
          )}
          
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;