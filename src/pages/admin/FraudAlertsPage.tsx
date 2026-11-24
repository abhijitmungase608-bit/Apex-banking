import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';

export const FraudAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 'FRD-9912',
      account: '1088 0155 2391',
      customer: 'Rahul Sharma',
      anomaly: 'Rapid succession of 3 international IP logins in under 2 minutes',
      riskScore: 78,
      status: 'UNDER_REVIEW',
      timestamp: 'Today at 07:15 AM',
    },
    {
      id: 'FRD-9910',
      account: '1088 0299 8412',
      customer: 'TechCorp Solutions',
      anomaly: 'Off-hours high-value RTGS transfer attempt to unverified overseas beneficiary',
      riskScore: 62,
      status: 'CLEARED',
      timestamp: 'Yesterday at 23:40 PM',
    },
  ]);

  const handleClearAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'CLEARED' } : a));
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Fraud Monitoring & Risk Analytics</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          AI-driven behavioral heuristics and velocity rule monitoring for anomalous transaction patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Flagged Events</span>
          <div className="text-2xl font-black text-[#102A56] mt-1">2 Events</div>
          <span className="text-[10px] text-emerald-600 font-semibold">1 Resolved • 1 Under Review</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-slate-400">Velocity Breaches</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">0 Breaches</div>
          <span className="text-[10px] text-slate-500">Normal transaction throughput</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft">
          <span className="text-[10px] uppercase font-bold text-slate-400">Engine Health</span>
          <div className="text-2xl font-black text-blue-600 mt-1">Active Heuristics</div>
          <span className="text-[10px] text-slate-500">RBI Cyber Security Framework</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold text-sm text-[#102A56]">
          Flagged Behavioral Anomalies
        </div>

        <div className="divide-y divide-slate-100">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#102A56]">{alert.anomaly}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    alert.status === 'CLEARED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Customer: <strong>{alert.customer}</strong> • Account: {alert.account} • {alert.timestamp}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase text-slate-400 block font-bold">Risk Score</span>
                  <span className={`font-black text-sm ${alert.riskScore > 70 ? 'text-red-600' : 'text-amber-600'}`}>
                    {alert.riskScore} / 100
                  </span>
                </div>

                {alert.status !== 'CLEARED' && (
                  <button
                    onClick={() => handleClearAlert(alert.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A56] font-bold text-xs transition-colors"
                  >
                    Mark as Cleared
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
