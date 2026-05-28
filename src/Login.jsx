import { useState } from 'react'
import { supabase } from './supabase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    let result
    if (isSignup) {
      result = await supabase.auth.signUp({ email, password })
    } else {
      result = await supabase.auth.signInWithPassword({ email, password })
    }

    if (result.error) {
      setError(result.error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-2">
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          {isSignup ? 'Sign up to get started' : 'Sign in to your dashboard'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-1 block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Sign in'}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-400 hover:underline"
          >
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login