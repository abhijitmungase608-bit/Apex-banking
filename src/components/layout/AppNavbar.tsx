import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApexLogo } from '../common/ApexLogo';
import { SandboxBadge } from '../common/SandboxBadge';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { 
  Bell, Search, Shield, User, LogOut, Settings, 
  ChevronDown, ExternalLink, HelpCircle 
} from 'lucide-react';

export const AppNavbar: React.FC = () => {
  const { user, profile, logout, switchRole, role } = useAuth();
  const { unreadNotifCount } = useBanking();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggleAdmin = () => {
    if (role === 'ADMIN') {
      switchRole('CUSTOMER');
      navigate('/dashboard');
    } else {
      switchRole('ADMIN');
      navigate('/admin');
    }
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-3">
          <ApexLogo size="sm" showTagline={false} />
        </Link>

        {/* Center: Search (Desktop only) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transfers, beneficiaries, statements, IFSC..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs rounded-full border border-transparent focus:border-[#246BFD]/40 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right: Actions, Sandbox, Notifications & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <SandboxBadge />

          {/* Notifications Button */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#246BFD] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </Link>

          {/* Help Shortcut */}
          <Link
            to="/support"
            className="hidden sm:flex p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="Customer Support 24x7"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200/60"
            >
              <img
                src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Profile"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden lg:block text-left pr-1">
                <div className="text-xs font-bold text-[#102A56] leading-none">
                  {profile?.fullName || user?.fullName || 'Customer'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  {role === 'ADMIN' ? 'Compliance Admin' : 'Retail Banking'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 bg-white rounded-2xl shadow-premium border border-slate-200 text-xs z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3 border-b border-slate-100">
                  <div className="font-bold text-sm text-[#102A56]">{profile?.fullName}</div>
                  <div className="text-[11px] text-slate-500">{user?.email}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] font-semibold text-emerald-600 uppercase">KYC Verified</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/security"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span>Security & 2FA</span>
                  </Link>
                  <Link
                    to="/devices"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Device Management</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={handleToggleAdmin}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#246BFD] hover:bg-[#EAF2FF] transition-colors font-medium text-left"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5" />
                      {role === 'ADMIN' ? 'Switch to Customer View' : 'Open Admin Portal'}
                    </span>
                    <span className="text-[10px] bg-[#246BFD] text-white px-1.5 py-0.5 rounded font-bold">
                      {role === 'ADMIN' ? 'Cust' : 'Admin'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
