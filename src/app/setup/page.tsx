'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const createTestUser = async () => {
    setStatus('loading');
    setMessage('Creating test user...');

    try {
      const response = await fetch('/api/setup-test-user', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(`✅ Test user created successfully!\n\nEmail: ${data.user.email}\nPassword: @D3signer101!\n\nYou can now sign in at /auth/signin`);
      } else {
        setStatus('error');
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage('❌ Failed to create test user. Please check your MongoDB connection.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tasker Setup</h1>
          <p className="text-gray-600">Set up your test environment</p>
        </div>

        <div className="space-y-6">
          {/* MongoDB Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">📋 MongoDB Setup Required</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. Create a <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="underline">MongoDB Atlas</a> account</p>
              <p>2. Create a new cluster (free tier available)</p>
              <p>3. Go to "Network Access" → Add IP Address: <code className="bg-blue-100 px-1 rounded">0.0.0.0/0</code></p>
              <p>4. Go to "Database Access" → Create user with read/write access</p>
              <p>5. Get connection string from "Connect" → "Connect your application"</p>
              <p>6. Update <code className="bg-blue-100 px-1 rounded">MONGODB_URI</code> in <code className="bg-blue-100 px-1 rounded">.env.local</code></p>
            </div>
          </div>

          {/* Test User Creation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">👤 Create Test User</h3>
            <p className="text-sm text-green-800 mb-4">
              Create a test account for authentication testing:
            </p>
            <div className="bg-green-100 rounded p-3 mb-4 font-mono text-sm">
              <div>Email: talentedhand10@gmail.com</div>
              <div>Password: @D3signer101!</div>
            </div>
            <button
              onClick={createTestUser}
              disabled={status === 'loading'}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Creating...' : 'Create Test User'}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-lg whitespace-pre-line ${
              status === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : status === 'error'
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              {message}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Sign In
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}