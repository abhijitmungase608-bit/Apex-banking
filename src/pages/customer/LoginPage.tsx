import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApexLogo } from '../../components/common/ApexLogo';
import { useAuth } from '../../context/AuthContext';
import { 
  User, Lock, Eye, EyeOff, ArrowRight, 
  ShieldCheck, Fingerprint, Sparkles 
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('rahul.sharma@apexbank.in');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(identifier, password);
      if (res.requireOtp) {
        navigate('/otp-verification');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (type: 'customer' | 'admin') => {
    if (type === 'customer') {
      setIdentifier('rahul.sharma@apexbank.in');
      setPassword('Password@123');
    } else {
      setIdentifier('admin.aditi@apexbank.in');
      setPassword('AdminSecurity#2026');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <ApexLogo size="md" className="justify-center mb-2" />
          <h2 className="text-2xl font-black text-[#102A56] tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to your Apex Banking account</p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-premium border border-slate-200/80">
          {/* Quick Demo Credentials Pill Bar */}
          <div className="mb-5 p-3 rounded-2xl bg-[#EAF2FF] border border-[#246BFD]/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#246BFD]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Fast Sandbox Fill:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-blue-50 text-[11px] font-bold text-[#102A56] border border-blue-200/60 shadow-sm transition-colors text-center"
              >
                👤 Retail Customer
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="flex-1 py-1.5 px-2.5 rounded-xl bg-white hover:bg-blue-50 text-[11px] font-bold text-[#102A56] border border-blue-200/60 shadow-sm transition-colors text-center"
              >
                🛡️ Admin / Auditor
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address or Registered Mobile
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="mobile number or email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] font-semibold text-[#246BFD] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all mt-2"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Sign In Securely</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Biometric Quick Login Simulation */}
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                await new Promise(r => setTimeout(r, 400));
                navigate('/dashboard');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Fingerprint className="w-4 h-4 text-[#246BFD]" />
              <span>Use Touch ID / Face ID</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an Apex Banking account?{' '}
            <Link to="/register" className="font-bold text-[#246BFD] hover:underline">
              Open Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
