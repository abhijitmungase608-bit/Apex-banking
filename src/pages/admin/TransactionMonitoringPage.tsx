import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { 
  ArrowLeftRight, Search, CheckCircle2, 
  AlertTriangle, Filter, Download 
} from 'lucide-react';

export const TransactionMonitoringPage: React.FC = () => {
  const { transactions } = useBanking();
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => 
    t.counterpartyName.toLowerCase().includes(search.toLowerCase()) ||
    t.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
    t.bankRrn?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Transaction Monitoring & Switch Health</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time transaction state auditing, idempotent key verification, and switch response logging.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by counterparty, reference, or bank RRN..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-[#246BFD] outline-none shadow-sm"
        />
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Reference / RRN</th>
                <th className="p-4">Counterparty</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Amount</th>
                <th className="p-4">State</th>
                <th className="p-4">Provider Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono">
                    <div className="font-bold text-[#102A56]">{t.referenceNumber}</div>
                    <div className="text-[10px] text-slate-400">{t.bankRrn}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{t.counterpartyName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{t.counterpartyDetail}</div>
                  </td>
                  <td className="p-4 font-bold text-[#246BFD]">{t.transferType}</td>
                  <td className="p-4 font-black text-slate-900">₹{t.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 text-[11px] max-w-xs truncate">
                    {t.providerStatusMsg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
