import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { authService } from '../../services/supabaseClient';
import { portfolioProgressPct } from '../../lib/data';
import { User, Mail, Award, Flame, Clock, Briefcase, Key, LogOut, CheckCircle2, Shield } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, profile, logout, refreshProfile } = useAuth();
  const { state, navigate, showToast } = useApp();

  const [fullName, setFullName] = useState(profile?.fullName || state.profile?.name || 'Logan Sarathy');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const portfolioPct = portfolioProgressPct(state.weeks);
  const hoursLearned = state.settings.hoursLoggedTotal || 0;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Profile saved locally.');
      return;
    }
    setSavingProfile(true);
    try {
      await authService.updateUserProfile(user.id, { fullName });
      await refreshProfile();
      showToast('Profile updated successfully.');
    } catch (err: any) {
      showToast('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }
    setChangingPass(true);
    try {
      if (user) {
        await authService.updatePassword(newPassword);
        showToast('Password updated successfully.');
      } else {
        showToast('Local account mode: Password update simulated.');
      }
      setNewPassword('');
    } catch (err: any) {
      showToast('Failed to change password.');
    } finally {
      setChangingPass(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out.');
    navigate('login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Account Overview Card */}
      <div className="bg-white border border-[#ECECEC] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ECECEC]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FF7A00] text-white font-bold text-2xl flex items-center justify-center shadow-2xs shrink-0">
              {(fullName || 'PM').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1E1E1E]">
                {fullName || 'Product Student'}
              </h1>
              <p className="text-xs text-[#6B7280]">{user?.email || 'guest@pmos.local'}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-semibold bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20 rounded-full">
                  <Shield className="w-3 h-3" />
                  {profile?.role === 'creator' ? 'Creator / Instructor' : 'Active Student'}
                </span>
                <span className="text-xs text-[#6B7280]">
                  Week {state.currentWeek} Active
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold rounded-xl text-xs transition-colors inline-flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Essential Key Student Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#ECECEC] text-center">
            <div className="text-[10px] font-semibold uppercase text-[#6B7280] tracking-wider mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-[#FF7A00]" /> Week
            </div>
            <div className="text-base font-bold text-[#1E1E1E]">Week {state.currentWeek}</div>
          </div>

          <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#ECECEC] text-center">
            <div className="text-[10px] font-semibold uppercase text-[#6B7280] tracking-wider mb-1 flex items-center justify-center gap-1">
              <Award className="w-3 h-3 text-[#FF7A00]" /> Total XP
            </div>
            <div className="text-base font-bold text-[#FF7A00]">{state.xp} XP</div>
          </div>

          <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#ECECEC] text-center">
            <div className="text-[10px] font-semibold uppercase text-[#6B7280] tracking-wider mb-1 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-[#FF7A00]" /> Streak
            </div>
            <div className="text-base font-bold text-[#1E1E1E]">{state.streak.current} Days</div>
          </div>

          <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#ECECEC] text-center">
            <div className="text-[10px] font-semibold uppercase text-[#6B7280] tracking-wider mb-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-[#FF7A00]" /> Hours
            </div>
            <div className="text-base font-bold text-[#1E1E1E]">{hoursLearned} hrs</div>
          </div>

          <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#ECECEC] text-center col-span-2 sm:col-span-1">
            <div className="text-[10px] font-semibold uppercase text-[#6B7280] tracking-wider mb-1 flex items-center justify-center gap-1">
              <Briefcase className="w-3 h-3 text-[#FF7A00]" /> Portfolio
            </div>
            <div className="text-base font-bold text-[#1E1E1E]">{portfolioPct}%</div>
          </div>
        </div>
      </div>

      {/* Account Settings Form */}
      <div className="bg-white border border-[#ECECEC] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-5">
        <h2 className="text-base font-bold text-[#1E1E1E] flex items-center gap-2">
          <User className="w-4 h-4 text-[#FF7A00]" /> Account Settings
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#1E1E1E]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#ECECEC] text-sm text-[#1E1E1E] focus:outline-none focus:bg-white focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

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
                  disabled
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#ECECEC]/50 border border-[#ECECEC] text-sm text-[#6B7280] cursor-not-allowed"
                  value={user?.email || 'guest@pmos.local'}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-semibold rounded-xl text-xs transition-all shadow-2xs disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Account Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Change */}
      <div className="bg-white border border-[#ECECEC] p-6 sm:p-8 rounded-2xl shadow-2xs space-y-5">
        <h2 className="text-base font-bold text-[#1E1E1E] flex items-center gap-2">
          <Key className="w-4 h-4 text-[#FF7A00]" /> Security &amp; Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5 max-w-md">
            <label className="block text-xs font-semibold text-[#1E1E1E]">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#ECECEC] text-sm text-[#1E1E1E] focus:outline-none focus:bg-white focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              disabled={changingPass}
              className="px-5 py-2.5 bg-[#1E1E1E] hover:bg-[#2e2e2e] text-white font-semibold rounded-xl text-xs transition-all shadow-2xs disabled:opacity-50"
            >
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
