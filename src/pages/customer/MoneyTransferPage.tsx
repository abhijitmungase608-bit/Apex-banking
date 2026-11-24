import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { TransferType, Transaction } from '../../types/banking';
import { 
  Send, QrCode, ArrowLeftRight, CheckCircle2, 
  AlertCircle, ShieldCheck, User, Sparkles, Download, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MoneyTransferPage: React.FC = () => {
  const { primaryAccount, beneficiaries, executeTransfer } = useBanking();

  const [selectedBenId, setSelectedBenId] = useState<string>(beneficiaries[0]?.id || '');
  const [transferType, setTransferType] = useState<TransferType>('IMPS');
  const [amount, setAmount] = useState<string>('5000');
  const [remarks, setRemarks] = useState<string>('Personal Transfer');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedBen = beneficiaries.find(b => b.id === selectedBenId);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setErrorMsg('Please enter a valid transfer amount.');
      return;
    }

    if (!selectedBen) {
      setErrorMsg('Please select a beneficiary.');
      return;
    }

    if (primaryAccount && primaryAccount.availableBalance < numAmount) {
      setErrorMsg(`Insufficient balance in account (${primaryAccount.availableBalance.toLocaleString('en-IN')}).`);
      return;
    }

    setIsProcessing(true);
    try {
      const txn = await executeTransfer({
        sourceAccountId: primaryAccount?.id || '',
        counterpartyName: selectedBen.name,
        counterpartyDetail: selectedBen.transferType === 'UPI' ? (selectedBen.upiId || '') : `${selectedBen.ifscCode} / ${selectedBen.accountNumber}`,
        transferType,
        amount: numAmount,
        remarks,
      });

      setCompletedTxn(txn);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setErrorMsg(err?.message || 'Payment execution failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Money Transfer</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute instant, zero-charge domestic remittances via authorized clearing switches.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {completedTxn ? (
          /* Payment Success Receipt */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                Transaction Successful
              </span>
              <h2 className="text-3xl font-black text-[#102A56] mt-1">
                ₹{completedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Paid to <strong>{completedTxn.counterpartyName}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Reference (RRN)</span>
                <span className="font-mono font-bold text-[#102A56]">{completedTxn.bankRrn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono font-semibold text-slate-700">{completedTxn.referenceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel</span>
                <span className="font-bold text-[#246BFD]">{completedTxn.transferType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <span className="text-slate-700">{new Date(completedTxn.createdAt).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Switch Status</span>
                <span className="text-emerald-600 font-semibold">{completedTxn.providerStatusMsg}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCompletedTxn(null)}
                className="flex-1 py-3 rounded-xl bg-[#246BFD] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors"
              >
                Make Another Transfer
              </button>
            </div>
          </div>
        ) : (
          /* Transfer Input Form */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-4 text-left">
              {/* Select Beneficiary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Verified Payee
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {beneficiaries.map((ben) => (
                    <button
                      key={ben.id}
                      type="button"
                      onClick={() => {
                        setSelectedBenId(ben.id);
                        if (ben.transferType === 'UPI') setTransferType('UPI');
                        else setTransferType('IMPS');
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        selectedBenId === ben.id
                          ? 'bg-[#EAF2FF] border-[#246BFD] shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#102A56] truncate">{ben.name}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {ben.transferType === 'UPI' ? ben.upiId : `${ben.bankName} (${ben.accountNumber?.slice(-4)})`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Transfer Mode
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['IMPS', 'UPI', 'NEFT', 'RTGS'] as TransferType[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTransferType(mode)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        transferType === mode
                          ? 'bg-[#246BFD] text-white border-[#246BFD]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Transfer Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-[#102A56] focus:bg-white focus:border-[#246BFD] outline-none"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Remarks / Purpose
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Rent, Invoice, Family support"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 flex justify-between">
                <span>Statutory Processing Fee:</span>
                <span className="font-bold text-emerald-600">₹0.00 (Zero Fee)</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all mt-3"
              >
                {isProcessing ? (
                  <span>Executing Transfer via Banking Switch...</span>
                ) : (
                  <>
                    <span>Confirm & Authorize Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
