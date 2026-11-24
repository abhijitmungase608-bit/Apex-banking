import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApexLogo } from '../../components/common/ApexLogo';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SandboxAdapters } from '../../services/sandboxAdapters';

export const ForgotPasswordPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('rahul.sharma@apexbank.in');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await SandboxAdapters.sendOtp(identifier, 'EMAIL');
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <ApexLogo size="md" className="justify-center mb-2" />
          <h2 className="text-2xl font-black text-[#102A56] tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1">
            We will dispatch an authorized password reset token
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-premium border border-slate-200/80">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#102A56]">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A secure password reset link and 6-digit authentication token has been delivered to <strong>{identifier}</strong>.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-[#246BFD] text-white font-bold text-xs shadow-premium"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Registered Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter registered email or mobile"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all mt-2"
              >
                {isLoading ? <span>Verifying Account...</span> : <span>Send Reset Instructions</span>}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#102A56]"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
