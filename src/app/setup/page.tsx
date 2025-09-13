'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { CheckSquare, Star, ArrowRight, Database, User, Settings } from 'lucide-react';

interface SetupResponse {
  user: {
    email: string;
  };
}

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const createTestUser = async () => {
    setStatus('loading');
    setMessage('Creating test user...');

    try {
      const response = await fetch('/api/setup-test-user', {
        method: 'POST',
      });

      const data: SetupResponse = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(`✅ Test user created successfully!\n\nEmail: ${data.user.email}\nPassword: @D3signer101!\n\nYou can now sign in at /auth/signin`);
      } else {
        setStatus('error');
        setMessage(`❌ Error: ${data.user ? 'Unknown error' : 'Invalid response'}`);
      }
    } catch {
      setStatus('error');
      setMessage('❌ Failed to create test user. Please check your MongoDB connection.');
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section with Dark Background */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gray-900">
        {/* Animated Silhouette Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 dark:bg-blue-800/20 rounded-full animate-bounce"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 dark:bg-purple-800/20 rounded-lg animate-pulse"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-200/20 dark:bg-green-800/20 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-indigo-200/20 dark:bg-indigo-800/20 rounded-lg animate-bounce"></div>

          {/* Time-related overlays */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
            <Settings className="w-64 h-64 text-blue-300 animate-spin" style={{animationDuration: '20s'}} />
          </div>
          <div className="absolute bottom-1/3 right-1/4 opacity-10">
            <Database className="w-48 h-48 text-purple-300 animate-pulse" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Star className="h-4 w-4 animate-spin" style={{animationDuration: '3s'}} />
              Setup Your Tasker Environment
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              Get Started with
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Tasker Setup
              </span>
            </h1>

            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-500">
              Configure your MongoDB database and create a test user to start managing tasks with Tasker.
              Follow the steps below to get everything running smoothly.
            </p>
          </div>

          {/* Setup Content */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* MongoDB Setup Instructions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Database Setup</h3>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-3">
                  <p>1. Create a <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">MongoDB Atlas</a> account</p>
                  <p>2. Create a new cluster (free tier available)</p>
                  <p>3. Go to "Network Access" → Add IP Address: <code className='bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs'>0.0.0.0/0</code></p>
                  <p>4. Go to "Database Access" → Create user with read/write access</p>
                  <p>5. Get connection string from "Connect" → "Connect your application"</p>
                  <p>6. Update <code className='bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs'>MONGODB_URI</code> in <code className='bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-xs'>.env.local</code></p>
                </div>
              </div>

              {/* Test User Creation */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-600">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create Test User</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Create a test account for authentication testing:
                </p>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                  <div className="font-mono text-sm text-green-800 dark:text-green-200">
                    <div>Email: talentedhand10@gmail.com</div>
                    <div>Password: @D3signer101!</div>
                  </div>
                </div>
                <button
                  onClick={createTestUser}
                  disabled={status === 'loading'}
                  className="w-full group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                >
                  {status === 'loading' ? 'Creating...' : 'Create Test User'}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`p-6 rounded-xl shadow-lg border ${
                status === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                  : status === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
              }`}>
                <div className="whitespace-pre-line text-center">{message}</div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link
                href="/auth/signin"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Go to Sign In
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 font-semibold text-lg"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <CheckSquare className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Tasker</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="/auth/signin" className="hover:text-blue-400 transition-colors">Sign In</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2024 Tasker. All rights reserved. Built with ❤️{' '}
            <a
              href="https://julevajeto.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Julev Ajeto
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}