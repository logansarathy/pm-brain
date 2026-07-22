import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { AuthLayout } from './AuthLayout';
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordView: React.FC = () => {
  const { resetPassword } = useAuth();
  const { navigate, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
      showToast('Password reset link sent.');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1E1E]">
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        <div className="bg-white border border-[#ECECEC] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-5">
          {submitted ? (
            <div className="text-center py-2 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 text-[#22C55E] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs text-[#6B7280]">
                If an account exists for <strong className="text-[#1E1E1E]">{email}</strong>, you will receive password recovery instructions shortly.
              </p>
              <button
                onClick={() => navigate('login')}
                className="w-full py-2.5 px-4 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-xl text-sm transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#1E1E1E]">
                  Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-xl text-sm transition-all shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate('login')}
                  className="text-xs font-semibold text-[#6B7280] hover:text-[#1E1E1E] inline-flex items-center gap-1 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};
