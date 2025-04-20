'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    publicAddress: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useManualEntry, setUseManualEntry] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true);
    }
  }, []);

  const connectMetaMask = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const publicAddress = accounts[0];
        setFormData(prev => ({ ...prev, publicAddress }));
        setIsConnected(true);
      } else {
        alert('Please install MetaMask to use this feature');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!useManualEntry && !isConnected) {
      alert('Please connect your MetaMask wallet or switch to manual entry');
      return;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/signin' : '/api/auth/signup';
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: formData.publicAddress,
          password: formData.password,
          ...(isLogin ? {} : {
            name: formData.name,
            email: formData.email,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userAddress', formData.publicAddress);

      router.push('/home');
    } catch (error) {
      setApiError(error.message);
      console.error('API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === 'confirmPassword' || name === 'password') {
      setPasswordError('');
    }
  };

  const toggleEntryMethod = () => {
    setUseManualEntry(!useManualEntry);
    if (!useManualEntry) {
      setIsConnected(false);
      setFormData(prev => ({ ...prev, publicAddress: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Join our community'}
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 p-3 rounded-lg text-red-500 text-sm text-center">
            {apiError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out text-black"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out text-black"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="publicAddress" className="block text-sm font-medium text-gray-700">
                  MetaMask Address
                </label>
                <button
                  type="button"
                  onClick={toggleEntryMethod}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {useManualEntry ? 'Use MetaMask' : 'Enter Manually'}
                </button>
              </div>
              <div className="flex space-x-2">
                <input
                  id="publicAddress"
                  name="publicAddress"
                  type="text"
                  required
                  readOnly={!useManualEntry}
                  className="flex-1 appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out text-black"
                  placeholder={useManualEntry ? "Enter your MetaMask address" : "Connect MetaMask to get your address"}
                  value={formData.publicAddress}
                  onChange={handleChange}
                />
                {!useManualEntry && !isConnected && isMetaMaskInstalled && (
                  <button
                    type="button"
                    onClick={connectMetaMask}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out text-black"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out text-black"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {passwordError && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{passwordError}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition duration-150 ease-in-out"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}