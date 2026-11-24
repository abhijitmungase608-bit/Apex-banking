import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { DebitCardVisual } from '../../components/cards/DebitCardVisual';
import { 
  Eye, EyeOff, Send, Download, QrCode, ArrowUpRight, 
  ArrowDownLeft, Plus, ShieldCheck, ChevronRight, Sparkles,
  TrendingUp, CreditCard, Building2, Bell, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { 
    accounts, primaryAccount, totalBalance, isBalanceHidden, 
    toggleBalanceVisibility, transactions, card, notifications 
  } = useBanking();

  const [showQrModal, setShowQrModal] = useState(false);
  const navigate = useNavigate();

  // Monthly financial spending analytics data for chart
  const analyticsData = [
    { month: 'Jun', income: 140000, spend: 42000 },
    { month: 'Jul', income: 140000, spend: 58000 },
    { month: 'Aug', income: 145000, spend: 39000 },
    { month: 'Sep', income: 145000, spend: 61000 },
    { month: 'Oct', income: 145000, spend: 48000 },
    { month: 'Nov', income: 145000, spend: 28500 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Personalized Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">
              Welcome back, {profile?.fullName?.split(' ')[0] || user?.fullName || 'Customer'}
            </h1>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> KYC Verified
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Last logged in from Pune, MH • Bank Switch status: <span className="text-emerald-600 font-semibold">100% Operational</span>
          </p>
        </div>

        {/* Balance Toggle & Fast Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={toggleBalanceVisibility}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            {isBalanceHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isBalanceHidden ? 'Show Balances' : 'Hide Balances'}</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Account Hero Cards & Quick Action Ribbon */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Available Balance Card */}
        <div className="lg:col-span-2 relative p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#102A56] via-[#16366D] to-[#246BFD] text-white shadow-premium overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-blue-400/10 blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200/80">
                  Total Net Banking Balance (INR)
                </span>
                <div className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                  {isBalanceHidden ? '••••••••' : `₹${totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                </div>
              </div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20">
                Primary Savings A/C
              </span>
            </div>

            {/* Account Details Pill */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100/90 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-blue-200/70 block">A/C Number</span>
                <span className="font-mono font-bold tracking-wider">
                  {isBalanceHidden ? '•••• •••• 2391' : primaryAccount?.accountNumber || '1088 0155 2391'}
                </span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-blue-200/70 block">IFSC Code</span>
                <span className="font-mono font-bold">{primaryAccount?.ifscCode || 'APEX0001088'}</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-[9px] uppercase tracking-wider text-blue-200/70 block">UPI ID</span>
                <span className="font-semibold text-white">{profile?.upiId || 'rahul.sharma@apex'}</span>
              </div>
            </div>

            {/* Quick Action Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => navigate('/transfer')}
                className="py-2.5 px-3 rounded-xl bg-white text-[#102A56] font-bold text-xs hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-[#246BFD]" />
                <span>Send Money</span>
              </button>

              <button
                onClick={() => navigate('/upi')}
                className="py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 border border-white/20 active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI Pay</span>
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 border border-white/20 active:scale-95"
              >
                <ArrowDownLeft className="w-3.5 h-3.5" />
                <span>Receive</span>
              </button>

              <button
                onClick={() => navigate('/statements')}
                className="py-2.5 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center justify-center gap-1.5 border border-white/20 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Statement</span>
              </button>
            </div>
          </div>
        </div>

        {/* Virtual Debit Card Mini Preview */}
        <div className="flex flex-col justify-between">
          <DebitCardVisual card={card} allowFlip={false} />
          
          <div className="mt-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-soft flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#246BFD]" />
              <span className="text-xs font-bold text-[#102A56]">RuPay Signature</span>
            </div>
            <Link
              to="/cards"
              className="text-xs font-bold text-[#246BFD] hover:underline flex items-center gap-0.5"
            >
              Card Controls <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Spending Analytics & Accounts Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Financial Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="font-black text-sm text-[#102A56]">Monthly Financial Overview</h2>
              <span className="text-[11px] text-slate-500">Income vs Expenditure (Last 6 Months)</span>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8.4% Savings Rate
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#246BFD" stopOpacity={0.4}/>
                    <stop offset="95%" stop-color="#246BFD" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stop-color="#DC3545" stopOpacity={0.3}/>
                    <stop offset="95%" stop-color="#DC3545" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, '']}
                  contentStyle={{ backgroundColor: '#102A56', color: '#fff', borderRadius: '12px', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="income" stroke="#246BFD" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" name="Credits (Income)" />
                <Area type="monotone" dataKey="spend" stroke="#DC3545" strokeWidth={2} fillOpacity={1} fill="url(#spendGrad)" name="Debits (Spends)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Linked Accounts Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h2 className="font-black text-sm text-[#102A56]">Linked Accounts</h2>
              <Link to="/accounts" className="text-xs font-bold text-[#246BFD] hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {accounts.map((acc) => (
                <div key={acc.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/80 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#102A56]">{acc.accountType} A/C</span>
                    {acc.isPrimary && (
                      <span className="text-[9px] font-bold bg-[#EAF2FF] text-[#246BFD] px-2 py-0.5 rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {isBalanceHidden ? '•••• •••• ••••' : acc.accountNumber}
                  </div>
                  <div className="text-base font-black text-[#102A56] mt-1">
                    {isBalanceHidden ? '••••••••' : `₹${acc.availableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/deposits"
              className="w-full py-2.5 px-3 rounded-xl bg-blue-50 text-[#246BFD] font-bold text-xs hover:bg-blue-100/80 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Open High-Yield Term Deposit</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Transactions & Activity Feed */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="font-black text-sm text-[#102A56]">Recent Account Activity</h2>
            <span className="text-[11px] text-slate-500">Live feed processed via Double-Entry Core Ledger</span>
          </div>
          <Link to="/transactions" className="text-xs font-bold text-[#246BFD] hover:underline">
            View All ({transactions.length})
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((txn) => {
            const isDebit = txn.transferType !== 'LOAN_DISBURSEMENT' && !txn.remarks?.toLowerCase().includes('salary');

            return (
              <div key={txn.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isDebit ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {isDebit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="font-bold text-xs text-[#102A56]">{txn.counterpartyName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-medium">{txn.transferType}</span>
                      <span>•</span>
                      <span>{new Date(txn.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xs font-black ${isDebit ? 'text-slate-900' : 'text-emerald-600'}`}>
                    {isDebit ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 mt-0.5">
                    {txn.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Receive Money QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="font-black text-base text-[#102A56]">Scan to Pay via UPI</h3>
            <p className="text-xs text-slate-500">
              Any UPI App (GPay, PhonePe, Paytm, BHIM)
            </p>

            {/* Generated QR Code Simulation */}
            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${profile?.upiId || 'rahul.sharma@apex'}&pn=Rahul%20Sharma&cu=INR`}
                alt="UPI QR Code"
                className="w-44 h-44 rounded-xl shadow-inner mx-auto"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs">
              <span className="text-[10px] text-slate-500 block">Your UPI ID</span>
              <span className="font-bold text-[#246BFD] font-mono">{profile?.upiId || 'rahul.sharma@apex'}</span>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
