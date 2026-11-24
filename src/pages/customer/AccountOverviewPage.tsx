import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import { 
  Wallet, Plus, Download, Send, QrCode, 
  ShieldCheck, ArrowRight, Building2, CheckCircle2 
} from 'lucide-react';

export const AccountOverviewPage: React.FC = () => {
  const { accounts, totalBalance, isBalanceHidden, fixedDeposits } = useBanking();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Account Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive portfolio across retail savings, current accounts, and term deposits.
          </p>
        </div>

        <Link
          to="/accounts/details"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#246BFD] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors shadow-sm"
        >
          View Account Details
        </Link>
      </div>

      {/* Portfolio Total Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Liquid Balance</span>
          <div className="text-2xl font-black text-[#102A56] mt-1">
            {isBalanceHidden ? '••••••••' : `₹${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">
            Across 2 Linked Accounts
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Fixed Term Deposits</span>
          <div className="text-2xl font-black text-[#102A56] mt-1">
            {isBalanceHidden ? '••••••••' : `₹${fixedDeposits.reduce((s, fd) => s + fd.depositAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          </div>
          <span className="text-[10px] text-[#246BFD] font-semibold mt-1 inline-block">
            Earning up to 8.10% p.a.
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Branch & Routing</span>
          <div className="text-base font-extrabold text-[#102A56] mt-1 truncate">
            Pune Financial District
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 inline-block">
            IFSC: APEX0001088 • MICR: 411088001
          </span>
        </div>
      </div>

      {/* Individual Account Cards List */}
      <div className="space-y-4">
        <h2 className="text-sm font-black text-[#102A56]">Active Deposit Accounts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#102A56]">
                      Apex {account.accountType === 'SAVINGS' ? 'Platinum Savings' : 'Premium Current'}
                    </span>
                    {account.isPrimary && (
                      <span className="bg-[#EAF2FF] text-[#246BFD] text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    A/C No: {isBalanceHidden ? '•••• •••• ••••' : account.accountNumber}
                  </span>
                </div>

                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {account.status}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Available Balance</span>
                <div className="text-2xl font-black text-[#102A56]">
                  {isBalanceHidden ? '••••••••' : `₹${account.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </div>
                <div className="text-[11px] text-slate-400">
                  Ledger Balance: {isBalanceHidden ? '••••••••' : `₹${account.ledgerBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => navigate('/transfer')}
                  className="py-2 rounded-xl bg-[#246BFD] text-white font-bold text-xs hover:bg-[#1D4ED8] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Transfer
                </button>

                <button
                  onClick={() => navigate('/statements')}
                  className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A56] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Statement
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
