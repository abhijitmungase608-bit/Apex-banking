import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { SandboxAdapters } from '../../services/sandboxAdapters';
import { TransferType } from '../../types/banking';
import { 
  Building2, CheckCircle2, AlertCircle, ArrowRight, 
  Coins, ShieldCheck, Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ImpsNeftRtgsPage: React.FC = () => {
  const { primaryAccount, executeTransfer } = useBanking();

  const [channel, setChannel] = useState<TransferType>('IMPS');
  const [accountNumber, setAccountNumber] = useState('918237465012');
  const [confirmAccount, setConfirmAccount] = useState('918237465012');
  const [ifsc, setIfsc] = useState('HDFC0000240');
  const [recipientName, setRecipientName] = useState('Priya Sharma');
  const [amount, setAmount] = useState('15000');
  const [remarks, setRemarks] = useState('Home maintenance');

  const [pennyDropSuccess, setPennyDropSuccess] = useState<string | null>(null);
  const [isVerifyingPenny, setIsVerifyingPenny] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTxn, setSuccessTxn] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePennyDrop = async () => {
    setErrorMsg('');
    setPennyDropSuccess(null);
    setIsVerifyingPenny(true);

    const res = await SandboxAdapters.pennyDropVerification(accountNumber, ifsc);
    setIsVerifyingPenny(false);

    if (res.success && res.data) {
      setPennyDropSuccess(`${res.data.accountHolderName} (${res.data.bankName})`);
      setRecipientName(res.data.accountHolderName);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (accountNumber !== confirmAccount) {
      setErrorMsg('Account number and confirm account number do not match.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    if (channel === 'RTGS' && numAmount < 200000) {
      setErrorMsg('RTGS requires a minimum transaction amount of ₹2,00,000 as per RBI rules. Please choose IMPS or NEFT.');
      return;
    }

    setIsProcessing(true);
    try {
      const txn = await executeTransfer({
        sourceAccountId: primaryAccount?.id || '',
        counterpartyName: recipientName,
        counterpartyDetail: `${ifsc.toUpperCase()} / ${accountNumber}`,
        transferType: channel,
        amount: numAmount,
        remarks,
      });

      setSuccessTxn(txn);
      confetti({ particleCount: 75, spread: 60 });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Payment execution failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">IMPS / NEFT / RTGS Transfer</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Authorized interbank clearing with instant ₹1 Penny-Drop validation.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {successTxn ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium text-center space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                {channel} Settlement Accepted
              </span>
              <h2 className="text-3xl font-black text-[#102A56] mt-1">
                ₹{successTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Beneficiary: <strong>{successTxn.counterpartyName}</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Retrieval Ref (RRN)</span>
                <span className="font-mono font-bold text-[#102A56]">{successTxn.bankRrn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Settlement Route</span>
                <span className="font-bold text-[#246BFD]">{channel} Real-Time Clearing</span>
              </div>
            </div>

            <button
              onClick={() => setSuccessTxn(null)}
              className="w-full py-3 rounded-xl bg-[#246BFD] text-white font-bold text-xs"
            >
              New Interbank Transfer
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

            {/* Clearing Channel Switcher */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'IMPS', desc: 'Instant 24x7 (Up to ₹5L)' },
                { type: 'NEFT', desc: 'Hourly Batches (No Limit)' },
                { type: 'RTGS', desc: 'Gross Real-Time (Min ₹2L)' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setChannel(item.type as TransferType)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    channel === item.type
                      ? 'bg-[#EAF2FF] border-[#246BFD] text-[#246BFD] shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-black text-xs">{item.type}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Beneficiary Account Number
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter 9 to 18 digit bank account"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Beneficiary Account Number
                </label>
                <input
                  type="text"
                  required
                  value={confirmAccount}
                  onChange={(e) => setConfirmAccount(e.target.value)}
                  placeholder="Re-enter bank account number"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  IFSC Code (11 alphanumeric characters)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0000240 or SBIN0001234"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:border-[#246BFD] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handlePennyDrop}
                    disabled={isVerifyingPenny}
                    className="px-3.5 py-2.5 rounded-xl bg-blue-50 text-[#246BFD] font-bold text-xs hover:bg-blue-100/80 transition-colors flex items-center gap-1"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{isVerifyingPenny ? 'Verifying...' : '₹1 Penny Drop'}</span>
                  </button>
                </div>

                {pennyDropSuccess && (
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Penny Drop Confirmed: <strong>{pennyDropSuccess}</strong></span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Beneficiary Name
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Legal name of recipient"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

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
                  placeholder="Transfer Amount"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-[#102A56] focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all mt-2"
              >
                {isProcessing ? <span>Routing through RBI Switch...</span> : <span>Initiate {channel} Transfer</span>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
