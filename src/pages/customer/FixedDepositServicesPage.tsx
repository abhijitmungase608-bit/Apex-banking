import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { FixedDeposit } from '../../types/banking';
import { 
  PiggyBank, Plus, CheckCircle2, TrendingUp, 
  ShieldCheck, AlertCircle, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FixedDepositServicesPage: React.FC = () => {
  const { fixedDeposits, openFixedDeposit, primaryAccount } = useBanking();

  const [depositAmount, setDepositAmount] = useState('50000');
  const [tenureMonths, setTenureMonths] = useState('18');
  const [errorMsg, setErrorMsg] = useState('');
  const [isOpening, setIsOpening] = useState(false);
  const [createdFd, setCreatedFd] = useState<FixedDeposit | null>(null);

  // Interest rate slabs
  const getRate = (months: number) => {
    if (months <= 6) return 6.5;
    if (months <= 12) return 7.25;
    if (months <= 24) return 7.75;
    return 8.10; // Special 555-day Apex rate
  };

  const currentRate = getRate(parseInt(tenureMonths));
  const amountNum = parseFloat(depositAmount) || 10000;
  const years = parseInt(tenureMonths) / 12;
  const maturityCalc = Math.round(amountNum * Math.pow(1 + (currentRate / 100) / 4, 4 * years));
  const interestEarned = maturityCalc - amountNum;

  const handleOpenFd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (amountNum < 5000) {
      setErrorMsg('Minimum deposit amount is ₹5,000.');
      return;
    }

    if (primaryAccount && primaryAccount.availableBalance < amountNum) {
      setErrorMsg(`Insufficient funds in primary account (Balance: ₹${primaryAccount.availableBalance.toLocaleString('en-IN')}).`);
      return;
    }

    setIsOpening(true);
    try {
      const fd = openFixedDeposit(amountNum, parseInt(tenureMonths), currentRate);
      setCreatedFd(fd);
      confetti({ particleCount: 75, spread: 60 });
    } catch (err: any) {
      setErrorMsg(err?.message || 'FD opening failed.');
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Fixed Deposit Services</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          High-yield term deposits compounding quarterly up to 8.10% p.a. Covered by DICGC insurance.
        </p>
      </div>

      {createdFd && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs text-left space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Fixed Deposit Booked Successfully!
          </div>
          <p>
            FD Account <strong>{createdFd.fdNumber}</strong> for ₹{createdFd.depositAmount.toLocaleString('en-IN')} has been created. Maturity Value: ₹{createdFd.maturityAmount.toLocaleString('en-IN')} on {createdFd.maturityDate}.
          </p>
        </div>
      )}

      {/* FD Calculator & Booking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5 text-left">
          <h2 className="font-bold text-sm text-[#102A56] flex items-center gap-2 border-b pb-3">
            <PiggyBank className="w-4 h-4 text-[#246BFD]" />
            Term Deposit Booking & Returns Calculator
          </h2>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleOpenFd} className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Deposit Amount (INR)</span>
                <span className="text-[#246BFD]">₹{amountNum.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full accent-[#246BFD]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Tenure Slab
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '6 Months', months: '6', rate: '6.50%' },
                  { label: '12 Months', months: '12', rate: '7.25%' },
                  { label: '18 Months', months: '18', rate: '7.75%' },
                  { label: '36 Months', months: '36', rate: '8.10%' },
                ].map((slab) => (
                  <button
                    key={slab.months}
                    type="button"
                    onClick={() => setTenureMonths(slab.months)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      tenureMonths === slab.months
                        ? 'bg-[#EAF2FF] border-[#246BFD] text-[#246BFD] shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="font-bold text-xs">{slab.label}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{slab.rate}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isOpening}
              className="w-full py-3.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all mt-4"
            >
              {isOpening ? <span>Booking Deposit...</span> : <span>Confirm & Open Fixed Deposit</span>}
            </button>
          </form>
        </div>

        {/* Maturity Projected Return */}
        <div className="bg-gradient-to-br from-[#102A56] to-[#1E3A8A] text-white rounded-3xl p-6 sm:p-7 shadow-premium flex flex-col justify-between text-left">
          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
              Projected Maturity Return
            </span>
            <div className="text-3xl font-black text-white">
              ₹{maturityCalc.toLocaleString('en-IN')}
            </div>

            <div className="space-y-2 pt-2 text-xs border-t border-white/10">
              <div className="flex justify-between text-blue-100">
                <span>Principal Invested:</span>
                <span className="font-bold">₹{amountNum.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Guaranteed Interest:</span>
                <span className="font-bold text-emerald-400">+₹{interestEarned.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span>Annual Interest Rate:</span>
                <span className="font-bold">{currentRate}% p.a.</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-[10px] text-blue-100 mt-6 border border-white/15">
            Quarterly compounded interest with zero penalty on premature closure after 6 months.
          </div>
        </div>
      </div>

      {/* Active Fixed Deposits */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4 text-left">
        <h2 className="font-bold text-sm text-[#102A56]">My Active Fixed Deposits ({fixedDeposits.length})</h2>

        <div className="divide-y divide-slate-100">
          {fixedDeposits.map((fd) => (
            <div key={fd.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#102A56]">FD No. {fd.fdNumber}</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    {fd.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Tenure: {fd.tenureMonths} Months • Rate: {fd.interestRate}% p.a. • Maturity: {fd.maturityDate}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-black text-[#102A56]">
                  Maturity: ₹{fd.maturityAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Principal: ₹{fd.depositAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
