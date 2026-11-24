import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { LoanRecord } from '../../types/banking';
import { 
  CircleDollarSign, Plus, CheckCircle2, AlertCircle, 
  Sparkles, Calendar, TrendingUp, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoanServicesPage: React.FC = () => {
  const { loans, applyLoan } = useBanking();

  // Calculator states
  const [loanType, setLoanType] = useState<LoanRecord['loanType']>('PERSONAL');
  const [principal, setPrincipal] = useState('200000');
  const [tenureMonths, setTenureMonths] = useState('24');
  
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState<LoanRecord | null>(null);

  const interestRate = loanType === 'HOME' ? 8.5 : loanType === 'VEHICLE' ? 9.2 : 10.5;

  // Calculate Monthly EMI: P * r * (1+r)^n / ((1+r)^n - 1)
  const p = parseFloat(principal) || 100000;
  const n = parseInt(tenureMonths) || 12;
  const r = (interestRate / 12) / 100;
  const monthlyEmi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const totalPayable = monthlyEmi * n;
  const totalInterest = totalPayable - p;

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise(r => setTimeout(r, 800));

    const newLoan = applyLoan(loanType, p, n, interestRate);
    setIsApplying(false);
    setAppliedSuccess(newLoan);
    confetti({ particleCount: 70, spread: 60 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Loan Services</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pre-approved digital retail loans with instantaneous disbursement into your savings account.
        </p>
      </div>

      {appliedSuccess && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1 text-left">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Loan Disbursed Instantly!
          </div>
          <p>
            Loan Account <strong>{appliedSuccess.loanNumber}</strong> for ₹{appliedSuccess.principalAmount.toLocaleString('en-IN')} has been approved and disbursed directly into your Apex Savings Account.
          </p>
        </div>
      )}

      {/* EMI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5 text-left">
          <h2 className="font-bold text-sm text-[#102A56] flex items-center gap-2 border-b pb-3">
            <CircleDollarSign className="w-4 h-4 text-[#246BFD]" />
            EMI & Eligibility Calculator
          </h2>

          <div className="grid grid-cols-4 gap-2">
            {(['PERSONAL', 'HOME', 'VEHICLE', 'BUSINESS'] as LoanRecord['loanType'][]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setLoanType(t)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  loanType === t
                    ? 'bg-[#246BFD] text-white border-[#246BFD]'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Principal Borrowing Amount</span>
                <span className="text-[#246BFD]">₹{p.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="2500000"
                step="25000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full accent-[#246BFD]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Tenure Duration</span>
                <span className="text-[#246BFD]">{n} Months ({Math.round(n / 12 * 10) / 10} Yrs)</span>
              </div>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={tenureMonths}
                onChange={(e) => setTenureMonths(e.target.value)}
                className="w-full accent-[#246BFD]"
              />
            </div>
          </div>
        </div>

        {/* EMI Summary Card */}
        <div className="bg-gradient-to-br from-[#102A56] to-[#1E3A8A] text-white rounded-3xl p-6 sm:p-7 shadow-premium flex flex-col justify-between text-left">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
              Estimated Monthly Outflow
            </span>
            <div className="text-3xl font-black text-white">
              ₹{monthlyEmi.toLocaleString('en-IN')}<span className="text-xs font-normal text-blue-200">/mo</span>
            </div>

            <div className="space-y-2 pt-2 text-xs border-t border-white/10">
              <div className="flex justify-between text-blue-100">
                <span>Interest Rate:</span>
                <span className="font-bold text-emerald-400">{interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Total Interest:</span>
                <span className="font-bold">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Total Repayment:</span>
                <span className="font-bold">₹{totalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleApply}
            disabled={isApplying}
            className="w-full py-3 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-glow transition-all mt-6"
          >
            {isApplying ? 'Disbursing Directly...' : 'Instant Disbursal to Account'}
          </button>
        </div>
      </div>

      {/* Active Loans */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4 text-left">
        <h2 className="font-bold text-sm text-[#102A56]">Active Loans Portfolio ({loans.length})</h2>

        <div className="divide-y divide-slate-100">
          {loans.map((loan) => (
            <div key={loan.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#102A56]">{loan.loanType} LOAN</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {loan.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Loan No: {loan.loanNumber} • Rate: {loan.interestRate}% p.a.
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-[#102A56]">
                  Outstanding: ₹{loan.outstandingAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  EMI: ₹{loan.emiAmount.toLocaleString('en-IN')}/mo
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
