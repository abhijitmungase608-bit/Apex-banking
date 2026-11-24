import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, Lock, Smartphone, KeyRound, 
  CheckCircle2, AlertTriangle, Fingerprint 
} from 'lucide-react';

export const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [isMfaActive, setIsMfaActive] = useState(true);
  const [isBiometricActive, setIsBiometricActive] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    setSuccessMsg('Security credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Security & Authentication</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage multi-factor authentication, biometric logins, and password security policies.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Security Controls */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-5">
          <h2 className="font-bold text-sm text-[#102A56] flex items-center gap-2 border-b pb-3">
            <ShieldCheck className="w-4 h-4 text-[#246BFD]" />
            Authentication Safeguards
          </h2>

          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-0.5 pr-4">
              <div className="font-bold text-xs text-[#102A56] flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#246BFD]" />
                Two-Factor Authentication (MFA)
              </div>
              <div className="text-[11px] text-slate-500">
                Require a 6-digit OTP code on every login and high-value transfer over ₹50,000.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMfaActive(!isMfaActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isMfaActive ? 'bg-[#246BFD]' : 'bg-slate-300'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isMfaActive ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Biometrics Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-0.5 pr-4">
              <div className="font-bold text-xs text-[#102A56] flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-[#246BFD]" />
                Biometric Login (Touch ID / Face ID)
              </div>
              <div className="text-[11px] text-slate-500">
                Use your device's secure hardware enclave for instant biometric authentication.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsBiometricActive(!isBiometricActive)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                isBiometricActive ? 'bg-[#246BFD]' : 'bg-slate-300'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                isBiometricActive ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* RBI Regulatory Compliance Note */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#246BFD]" />
              RBI Master Direction Compliance
            </div>
            <p className="text-blue-800/80 leading-relaxed">
              Apex Banking adheres to RBI regulations for digital payment security, device tokenization, and multi-factor authentication. Passwords, PINs, and full card details are never stored in plain text.
            </p>
          </div>
        </div>

        {/* Right: Change Password */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft">
          <h2 className="font-bold text-sm text-[#102A56] flex items-center gap-2 border-b pb-3 mb-4">
            <KeyRound className="w-4 h-4 text-[#246BFD]" />
            Change Password
          </h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium transition-all mt-2"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
