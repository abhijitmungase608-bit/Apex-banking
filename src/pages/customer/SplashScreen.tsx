import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApexLogo } from '../../components/common/ApexLogo';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#102A56] via-[#16366D] to-[#246BFD] flex flex-col items-center justify-between p-8 text-white select-none">
      <div className="w-full flex justify-end">
        <span className="text-[11px] font-semibold text-blue-200/80 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/15">
          v1.0.0 Production Sandbox
        </span>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
        <ApexLogo size="xl" light showTagline />

        <div className="max-w-xs text-xs text-blue-100/80 font-light leading-relaxed">
          Enterprise digital banking platform for India. Secured with 256-bit encryption.
        </div>

        {/* Animated Loading Ring */}
        <div className="flex items-center gap-2 pt-4">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-300 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Bottom Compliance & Security Badges */}
      <div className="flex flex-col items-center gap-2 text-center text-[10px] text-blue-200/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-300" /> RBI Guidelines
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> NPCI UPI 2.0
          </span>
        </div>
        <p>© 2026 APEX BANKING CORPORATION LTD. All rights reserved.</p>
      </div>
    </div>
  );
};
