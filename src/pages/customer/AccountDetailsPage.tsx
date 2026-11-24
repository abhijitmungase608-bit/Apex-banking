import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Copy, Check, ShieldCheck, Building2, MapPin, 
  CreditCard, User, Mail, Phone, ExternalLink 
} from 'lucide-react';

export const AccountDetailsPage: React.FC = () => {
  const { primaryAccount } = useBanking();
  const { profile, user } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Account Details</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official bank coordinates, IFSC codes, branch addresses, and nominee records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Account Coordinates */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <h2 className="font-bold text-sm text-[#102A56] flex items-center gap-2 border-b pb-3">
            <Building2 className="w-4 h-4 text-[#246BFD]" />
            Official Account Coordinates
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Account Number</span>
                <span className="font-mono font-bold text-sm text-[#102A56]">{primaryAccount?.accountNumber}</span>
              </div>
              <button
                onClick={() => copyToClipboard(primaryAccount?.accountNumber || '', 'acc')}
                className="p-2 rounded-xl hover:bg-white text-slate-500 hover:text-[#246BFD] transition-colors border border-transparent hover:border-slate-200"
                title="Copy Account Number"
              >
                {copiedKey === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">IFSC Code</span>
                <span className="font-mono font-bold text-sm text-[#102A56]">{primaryAccount?.ifscCode}</span>
              </div>
              <button
                onClick={() => copyToClipboard(primaryAccount?.ifscCode || '', 'ifsc')}
                className="p-2 rounded-xl hover:bg-white text-slate-500 hover:text-[#246BFD] transition-colors border border-transparent hover:border-slate-200"
                title="Copy IFSC Code"
              >
                {copiedKey === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">UPI Virtual Payment Address</span>
                <span className="font-semibold text-xs text-[#246BFD]">{profile?.upiId}</span>
              </div>
              <button
                onClick={() => copyToClipboard(profile?.upiId || '', 'upi')}
                className="p-2 rounded-xl hover:bg-white text-slate-500 hover:text-[#246BFD] transition-colors border border-transparent hover:border-slate-200"
                title="Copy UPI ID"
              >
                {copiedKey === 'upi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Home Branch</span>
              <span className="font-bold text-xs text-[#102A56] block">{primaryAccount?.branchName}</span>
              <span className="text-[11px] text-slate-500 block">
                Tower B, Financial Tech Hub, Hinjawadi Phase 1, Pune, MH 411057
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Nomination Records */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <h2 className="font-bold text-sm text-[#102A56] flex items-center gap-2 border-b pb-3">
            <User className="w-4 h-4 text-[#246BFD]" />
            Account Holder & Regulatory Details
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Full Legal Name</span>
              <span className="font-bold text-[#102A56]">{profile?.fullName}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Permanent Account Number (PAN)</span>
              <span className="font-mono font-bold text-[#102A56]">{profile?.panNumber}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Aadhaar (e-KYC Linked)</span>
              <span className="font-mono font-bold text-[#102A56]">•••• •••• {profile?.aadhaarLastFour}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Registered Nominee</span>
              <span className="font-bold text-[#102A56]">Priya Sharma (Sister) • 100% Share</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Deposit Insurance (DICGC)</span>
              <span className="text-emerald-600 font-bold">Covered up to ₹5,00,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
