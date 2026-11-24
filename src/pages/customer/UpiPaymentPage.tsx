import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { SandboxAdapters } from '../../services/sandboxAdapters';
import { 
  QrCode, CheckCircle2, AlertCircle, ArrowRight, 
  Sparkles, ShieldCheck, Search, Camera 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const UpiPaymentPage: React.FC = () => {
  const { primaryAccount, executeTransfer } = useBanking();

  const [vpa, setVpa] = useState('swiggy@icici');
  const [verifiedName, setVerifiedName] = useState<string | null>('Swiggy Food Delivery');
  const [isValidatingVpa, setIsValidatingVpa] = useState(false);
  const [amount, setAmount] = useState('650');
  const [remarks, setRemarks] = useState('UPI Instant Transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerifyVpa = async () => {
    setErrorMsg('');
    setIsValidatingVpa(true);
    const res = await SandboxAdapters.verifyVpa(vpa);
    setIsValidatingVpa(false);

    if (res.success && res.data) {
      setVerifiedName(res.data.name);
    } else {
      setErrorMsg(res.message);
      setVerifiedName(null);
    }
  };

  const handlePayUpi = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!verifiedName) {
      setErrorMsg('Please verify the recipient VPA first.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Enter a valid amount.');
      return;
    }

    setIsProcessing(true);
    try {
      const txn = await executeTransfer({
        sourceAccountId: primaryAccount?.id || '',
        counterpartyName: verifiedName,
        counterpartyDetail: vpa,
        transferType: 'UPI',
        amount: numAmount,
        remarks,
      });

      setSuccessResult(txn);
      confetti({ particleCount: 70, spread: 50 });
    } catch (err: any) {
      setErrorMsg(err?.message || 'UPI transaction failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Instant UPI Payment</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          NPCI UPI 2.0 real-time payment protocol with sub-second settlement.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        {successResult ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                UPI Payment Cleared
              </span>
              <h2 className="text-3xl font-black text-[#102A56] mt-1">
                ₹{successResult.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sent to <strong>{successResult.counterpartyName}</strong> ({vpa})
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">UPI Ref / RRN</span>
                <span className="font-mono font-bold text-[#102A56]">{successResult.bankRrn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Debited From</span>
                <span className="font-mono">{primaryAccount?.accountNumber}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessResult(null);
                setAmount('');
              }}
              className="w-full py-3 rounded-xl bg-[#246BFD] text-white font-bold text-xs"
            >
              Done / Make Another Payment
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePayUpi} className="space-y-4 text-left">
              {/* Recipient VPA & Live Verification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Recipient UPI ID / VPA
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={vpa}
                    onChange={(e) => {
                      setVpa(e.target.value);
                      setVerifiedName(null);
                    }}
                    placeholder="e.g. merchant@icici or user@okhdfcbank"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyVpa}
                    disabled={isValidatingVpa}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A56] font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    {isValidatingVpa ? 'Verifying...' : 'Verify Payee'}
                  </button>
                </div>

                {verifiedName && (
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Verified Payee: <strong>{verifiedName}</strong></span>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Amount (INR)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="₹ Amount"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-[#102A56] focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Note / Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="What is this for?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all mt-2"
              >
                {isProcessing ? <span>Authorizing via NPCI Switch...</span> : <span>Pay Securely via UPI</span>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
