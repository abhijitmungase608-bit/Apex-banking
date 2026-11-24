import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { ShieldCheck, FileText, Lock, Clock, Globe } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useBanking();

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Compliance & Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable cryptographic log of all authentication events, administrative approvals, and financial ledger transitions.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#246BFD]">{log.action}</span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {log.role}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">{log.details}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Actor: {log.actorName}</span>
                  <span>•</span>
                  <span>IP: {log.ipAddress}</span>
                  <span>•</span>
                  <span>Service: {log.resource}</span>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400 font-mono self-start md:self-center">
                {new Date(log.timestamp).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
