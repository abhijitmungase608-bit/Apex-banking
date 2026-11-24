import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApexLogo } from '../../components/common/ApexLogo';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';

export const OtpVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResent, setIsResent] = useState(false);

  const { verifyOtp, pendingLoginIdentifier } = useAuth();
  const navigate = useNavigate();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const fullCode = otp.join('');

    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(fullCode);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsResent(true);
    setOtp(['1', '2', '3', '4', '5', '6']);
    setTimeout(() => setIsResent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <ApexLogo size="md" className="justify-center mb-2" />
          <h2 className="text-2xl font-black text-[#102A56] tracking-tight">Two-Factor Authentication</h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter the 6-digit verification code sent to your registered mobile and email.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-premium border border-slate-200/80">
          {/* Sandbox code callout */}
          <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Sandbox Pre-filled Code: <strong>123456</strong></span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-center">
            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black text-[#102A56] bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-[#246BFD] outline-none transition-all shadow-inner"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? (
                <span>Verifying with RBI Switch...</span>
              ) : (
                <>
                  <span>Verify & Proceed to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Didn't receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              className="font-bold text-[#246BFD] hover:underline flex items-center gap-1"
            >
              <RotateCw className="w-3.5 h-3.5" />
              {isResent ? 'OTP Resent!' : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
