import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Printer, 
  Download, Copy, Share2, ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';

export const TransactionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { transactions } = useBanking();

  const txn = transactions.find(t => t.id === id || t.referenceNumber === id) || transactions[0];
  const isDebit = txn.transferType !== 'LOAN_DISBURSEMENT' && !txn.remarks?.toLowerCase().includes('salary');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#102A56] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to History
        </Link>

        <button
          onClick={() => window.print()}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          title="Print Official Receipt"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium space-y-6 text-center">
        {/* Status Header */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
            {txn.status} • Legally Audited
          </span>
          <h1 className="text-3xl font-black text-[#102A56] mt-1">
            {isDebit ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isDebit ? 'Transfer to' : 'Credit from'} <strong>{txn.counterpartyName}</strong>
          </p>
        </div>

        {/* State Machine Life Cycle Visualizer */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-left">
          <span className="text-[10px] font-bold uppercase text-[#246BFD] block mb-2">
            Banking State Machine Lifecycle
          </span>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
            <span className="text-emerald-600 flex items-center gap-1">✓ CREATED</span>
            <span>→</span>
            <span className="text-emerald-600 flex items-center gap-1">✓ PENDING</span>
            <span>→</span>
            <span className="text-emerald-600 flex items-center gap-1">✓ PROCESSING</span>
            <span>→</span>
            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-black">
              SUCCESS
            </span>
          </div>
        </div>

        {/* Detailed Attribute Grid */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-3">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Transaction Reference</span>
            <span className="font-mono font-bold text-[#102A56]">{txn.referenceNumber}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Bank Retrieval Ref (RRN)</span>
            <span className="font-mono font-bold text-[#102A56]">{txn.bankRrn || 'RRN918237461928'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Transfer Channel</span>
            <span className="font-bold text-[#246BFD]">{txn.transferType}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Beneficiary Coordinates</span>
            <span className="font-mono font-medium text-slate-700">{txn.counterpartyDetail}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Source Account</span>
            <span className="font-mono font-medium text-slate-700">{txn.sourceAccountNumber}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Transaction Fee</span>
            <span className="font-bold text-emerald-600">₹0.00 (Zero Fee)</span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-500">Timestamp</span>
            <span className="text-slate-700">{new Date(txn.createdAt).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <p className="text-[10px] text-slate-400 leading-relaxed">
          This digital statement serves as official confirmation of electronic funds transfer authorized under the Payment and Settlement Systems Act, 2007 (RBI).
        </p>
      </div>
    </div>
  );
};
