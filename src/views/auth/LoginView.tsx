import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AuthLayout } from './AuthLayout';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, loginWithGoogle, isConfigured } = useAuth();
  const { navigate, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [preparingWorkspace, setPreparingWorkspace] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      const name = email.split('@')[0] || 'User';
      setUserDisplayName(name);
      setPreparingWorkspace(true);
      showToast('Signed in successfully.');

      setTimeout(() => {
        navigate('home');
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    }
  };

  if (preparingWorkspace) {
    return (
      <AuthLayout>
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-8 shadow-2xs text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF7A00]/10 mx-auto flex items-center justify-center text-[#FF7A00]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#1E1E1E]">
              Welcome back, <span className="capitalize text-[#FF7A00]">{userDisplayName}</span>
            </h2>
            <p className="text-xs text-[#6B7280]">
              Opening your PM OS workspace...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#6B7280]">
            <Loader2 className="w-4 h-4 text-[#FF7A00] animate-spin" />
            <span>Redirecting...</span>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Workspace Greeting Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1E]">
            Welcome Back
          </h1>
          <div className="text-xs sm:text-sm text-[#6B7280] leading-snug space-y-0.5">
            <p>Continue building products.</p>
            <p>Continue building yourself.</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
          {!isConfigured && (
            <div className="p-3 rounded-xl bg-[#FF7A00]/8 border border-[#FF7A00]/20 text-[#1E1E1E] text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#FF7A00] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#FF7A00] block">Local Workspace Mode</span>
                <span className="text-[#6B7280]">Supabase is not configured. Session will save locally in your browser.</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1E1E1E]">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#ECECEC] text-sm text-[#1E1E1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all"
                  placeholder="alex@workspace.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-[#1E1E1E]">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-[#FF7A00] font-medium hover:underline"
                  onClick={() => navigate('forgot-password')}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#ECECEC] text-sm text-[#1E1E1E] placeholder-[#9CA3AF] focus:outline-none focus:bg-white focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#1E1E1E]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#ECECEC] text-[#FF7A00] focus:ring-[#FF7A00] accent-[#FF7A00]"
                />
                <span className="text-xs text-[#6B7280]">Remember me</span>
              </label>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-xl text-sm transition-all shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Entering Workspace...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="relative flex items-center justify-center my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ECECEC]"></div>
            </div>
            <div className="relative px-3 bg-white text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
              OR
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white hover:bg-[#FAF9F6] border border-[#ECECEC] text-[#1E1E1E] rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Create Account Link */}
        <p className="text-center text-xs text-[#6B7280]">
          Don't have a workspace?{' '}
          <button
            onClick={() => navigate('signup')}
            className="text-[#FF7A00] font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};
