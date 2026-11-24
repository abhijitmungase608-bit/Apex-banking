import React from 'react';
import { 
  CheckCircle2, AlertTriangle, FileCheck, 
  RotateCw, Building2, Server 
} from 'lucide-react';

export const ReconciliationPage: React.FC = () => {
  const reconciliationBatches = [
    {
      id: 'REC-20261124-01',
      date: '2026-11-24',
      switch: 'NPCI UPI 2.0 Settlement',
      totalTxns: 1420,
      matched: 1420,
      discrepancy: 0,
      volume: 4892000,
      status: 'RECONCILED',
    },
    {
      id: 'REC-20261124-02',
      date: '2026-11-24',
      switch: 'RBI NEFT Batch 14:00',
      totalTxns: 380,
      matched: 380,
      discrepancy: 0,
      volume: 12500000,
      status: 'RECONCILED',
    },
    {
      id: 'REC-20261123-01',
      date: '2026-11-23',
      switch: 'NPCI IMPS Switch Day End',
      totalTxns: 910,
      matched: 910,
      discrepancy: 0,
      volume: 3410000,
      status: 'RECONCILED',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Daily Settlement Reconciliation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated 3-way matching between Core Banking Ledger, Bank Switch settlement files, and NPCI/RBI clearing files.
          </p>
        </div>

        <button
          onClick={() => alert('Daily reconciliation re-run complete: 100% matched.')}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#246BFD] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors shadow-premium flex items-center gap-1.5"
        >
          <RotateCw className="w-4 h-4" />
          <span>Run Reconciliation Cycle</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="divide-y divide-slate-100">
          {reconciliationBatches.map((rec) => (
            <div key={rec.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#102A56]">{rec.switch}</span>
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    {rec.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Batch ID: {rec.id} • Date: {rec.date}
                </div>
              </div>

              <div className="flex items-center gap-6 text-right text-xs">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Transactions</span>
                  <span className="font-bold text-[#102A56]">{rec.totalTxns.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Matched / Discrepancy</span>
                  <span className="font-bold text-emerald-600">{rec.matched} / {rec.discrepancy}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Reconciled Gross Volume</span>
                  <span className="font-black text-[#102A56]">₹{rec.volume.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
