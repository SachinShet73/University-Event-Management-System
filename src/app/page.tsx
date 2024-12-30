'use client'

import { useState } from 'react'
import { Mail, Lock, Loader } from 'lucide-react'
import Dashboard from '@/components/Dashboard'

interface User {
  UserID: number;
  UserFName: string;
  UserLName: string;
  UserEmail: string;
  UserRole: string;
}

export default function Home() {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/images/background.jpg')]">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700">
            University Event Management System
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 border-2 border-gray-300">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
            <p className="text-gray-700 mt-1"></p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-600 p-4 rounded">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className="h-5 w-5 text-gray-700" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="block w-full pl-10 pr-3 py-2 border-2 border-gray-400 rounded-lg
                           text-gray-900 placeholder-gray-600"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-700" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-3 py-2 border-2 border-gray-400 rounded-lg
                           text-gray-900 placeholder-gray-600"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 border-t-2 border-gray-300 pt-4">
            <div className="text-sm text-gray-800 text-center font-medium">

              <div className="mt-2 space-y-1">

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}