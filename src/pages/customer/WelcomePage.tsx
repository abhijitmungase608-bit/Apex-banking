import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApexLogo } from '../../components/common/ApexLogo';
import { SandboxBadge } from '../../components/common/SandboxBadge';
import { 
  ShieldCheck, Zap, CreditCard, ChevronRight, 
  ArrowRight, Sparkles, Lock, Building2 
} from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <ApexLogo size="sm" showTagline={false} />
        <div className="flex items-center gap-3">
          <SandboxBadge />
          <Link
            to="/login"
            className="text-xs font-bold text-[#246BFD] hover:text-[#102A56] px-3 py-1.5 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Column: Vision & Pitch */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF2FF] text-[#246BFD] text-xs font-bold border border-[#246BFD]/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Indian Digital Banking</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#102A56] tracking-tight leading-tight">
            Banking Beyond Limits. <br />
            <span className="text-[#246BFD]">Fast, Secure, Modern.</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Experience real-time payments with NPCI UPI 2.0, zero-fee IMPS transfers, virtual RuPay Platinum cards, and guaranteed high-yield term deposits.
          </p>

          {/* Quick Feature Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-left">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
              <Zap className="w-5 h-5 text-[#246BFD] mb-1.5" />
              <div className="font-bold text-xs text-[#102A56]">Instant UPI & IMPS</div>
              <div className="text-[11px] text-slate-500">24x7 real-time settlement</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
              <CreditCard className="w-5 h-5 text-[#246BFD] mb-1.5" />
              <div className="font-bold text-xs text-[#102A56]">Virtual RuPay Card</div>
              <div className="text-[11px] text-slate-500">Tokenized dynamic controls</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
              <Building2 className="w-5 h-5 text-[#246BFD] mb-1.5" />
              <div className="font-bold text-xs text-[#102A56]">Term Deposits @ 8.1%</div>
              <div className="text-[11px] text-slate-500">Flexible tenures & compounding</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-soft">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1.5" />
              <div className="font-bold text-xs text-[#102A56]">RBI Compliant</div>
              <div className="text-[11px] text-slate-500">Zero plain-text secrets</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 justify-center lg:justify-start">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-premium flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Explore Digital Banking</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#102A56] font-bold text-sm border border-slate-300 shadow-sm flex items-center justify-center transition-all"
            >
              <span>Open New Account</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Card Preview */}
        <div className="flex-1 w-full max-w-md">
          <div className="relative p-6 rounded-3xl bg-white border border-slate-200/80 shadow-premium space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Sample Account</span>
                <div className="text-sm font-extrabold text-[#102A56]">Apex Platinum Savings</div>
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active & Verified
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">Available Balance</div>
              <div className="text-3xl font-black text-[#102A56] tracking-tight">
                ₹1,84,350.50
              </div>
              <div className="text-[11px] text-slate-400">
                A/C: 1088 0155 2391 • IFSC: APEX0001088
              </div>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">UPI VPA</span>
                <span className="font-semibold text-slate-700 text-xs">rahul.sharma@apex</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Interest Rate</span>
                <span className="font-semibold text-emerald-600 text-xs">6.75% p.a.</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="text-xs font-bold text-[#246BFD] hover:underline inline-flex items-center gap-1"
              >
                Sign In with Pre-filled Demo Account <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>APEX BANKING • Authorized Banking Partner Sandbox • Target Market: India</p>
      </footer>
    </div>
  );
};
