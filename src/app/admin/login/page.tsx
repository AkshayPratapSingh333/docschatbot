'use client';
import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Toast from '@/components/Toast';

export default function AdminLogin() {
  const router = useRouter();
  
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!authState.email || !authState.password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }

      console.log('Attempting login with:', { email: authState.email });

      const result = await signIn("credentials", {
        email: authState.email,
        password: authState.password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      // FIXED: Check for successful authentication properly
      if (result?.ok && !result?.error) {
        console.log('Login successful, redirecting...');
        router.replace("/admin/dashboard");
      } else {
        // Handle authentication errors
        console.log('Login failed:', result?.error);
        setError(result?.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      <Toast/>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform rotate-12 scale-150" />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={authState.email}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-300 disabled:opacity-50"
                  placeholder="admin@example.com"
                  onChange={(e) => setAuthState({...authState, email: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={authState.password}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all duration-300 disabled:opacity-50"
                  placeholder="Enter your password"
                  onChange={(e) => setAuthState({...authState, password: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center space-x-2 text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 ${
                isLoading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700'
              } text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group disabled:transform-none disabled:hover:shadow-lg`}
            >
              <span className="relative z-10 flex items-center justify-center">
                {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </span>
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs">
              © 2025 Admin Portal. All rights reserved.
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center px-3 py-1 bg-green-900/20 border border-green-500/30 rounded-full text-green-400 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            Secure Connection
          </div>
        </div>
      </div>
    </div>
  );
}