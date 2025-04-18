'use client';

import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in - prioritize sessionStorage over localStorage
    const sessionToken = sessionStorage.getItem('token');
    const localToken = localStorage.getItem('token');
    const token = sessionToken || localToken;

    if (token) {
      // If we have a token in localStorage but not in sessionStorage,
      // verify if it belongs to the current session
      if (!sessionToken && localToken) {
        const currentAddress = sessionStorage.getItem('userAddress');
        // Fetch user data to verify the token
        verifyAndFetchUserData(localToken, currentAddress);
      } else {
        setIsLoggedIn(true);
        fetchUserData(token);
      }
    }
  }, []);

  const verifyAndFetchUserData = async (token, currentAddress) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // If the addresses match or there's no current address, use this token
        if (!currentAddress || data.address === currentAddress) {
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userAddress', data.address);
          setIsLoggedIn(true);
          setUserData(data);
        } else {
          // If addresses don't match, clear localStorage
          localStorage.removeItem('token');
        }
      } else {
        // If token is invalid, clear it
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('token');
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        // If token is invalid, log out
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userAddress');
    setIsLoggedIn(false);
    setUserData(null);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">EventChain</span>
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <span className="text-gray-600">
                    Welcome, {userData?.name || 'User'}
                  </span>
                  <Link href="/home" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth" className="text-gray-600 hover:text-indigo-600 transition-colors">
                    Sign In
                  </Link>
                  <Link 
                    href="/auth" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 pt-10">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-indigo-600">EventChain Platform</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Revolutionizing event ticketing with blockchain technology. 
                  Secure, transparent, and efficient ticket management for organizers and attendees.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <Link
                      href="/auth"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#features"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn More
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => window.open('/chat', '_blank')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Join Chat
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose EventChain?
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Experience the future of event ticketing
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Secure Transactions</h3>
                <p className="text-gray-500">Blockchain-powered security for all your ticket transactions</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Instant Delivery</h3>
                <p className="text-gray-500">Get your tickets instantly with smart contract technology</p>
              </div>
            </div>
{/* Feature 3 */}
<div className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Anti-Fraud Protection</h3>
                <p className="text-gray-500">Eliminate ticket fraud with blockchain verification</p>
              </div>
            </div>
          </div>
        </div>
        </div>
    </div>
  );
}