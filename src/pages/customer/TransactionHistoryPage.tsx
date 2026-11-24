import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import { 
  ArrowUpRight, ArrowDownLeft, Search, Filter, 
  Download, Calendar, ChevronRight 
} from 'lucide-react';

export const TransactionHistoryPage: React.FC = () => {
  const { transactions } = useBanking();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filtered = transactions.filter((txn) => {
    const matchesSearch = 
      txn.counterpartyName.toLowerCase().includes(search.toLowerCase()) ||
      txn.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      txn.bankRrn?.toLowerCase().includes(search.toLowerCase()) ||
      txn.remarks?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filterType === 'ALL' || txn.transferType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Transaction History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time audit log of credits and debits posted to your double-entry core ledger.
          </p>
        </div>

        <Link
          to="/statements"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Records</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by payee, reference ID, RRN or remarks..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:border-[#246BFD] outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'UPI', 'IMPS', 'NEFT', 'INTERNAL_TRANSFER', 'LOAN_DISBURSEMENT'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filterType === type
                  ? 'bg-[#246BFD] text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No transactions match your search filter.
            </div>
          ) : (
            filtered.map((txn) => {
              const isDebit = txn.transferType !== 'LOAN_DISBURSEMENT' && !txn.remarks?.toLowerCase().includes('salary');

              return (
                <Link
                  key={txn.id}
                  to={`/transactions/${txn.id}`}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      isDebit ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {isDebit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-xs sm:text-sm text-[#102A56]">
                        {txn.counterpartyName}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-[#246BFD]">{txn.transferType}</span>
                        <span>•</span>
                        <span className="font-mono">{txn.referenceNumber}</span>
                        <span>•</span>
                        <span>{new Date(txn.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-xs sm:text-sm font-black ${isDebit ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {isDebit ? '-' : '+'}₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {txn.status}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
