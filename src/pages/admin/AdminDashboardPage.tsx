import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { 
  Users, Activity, ArrowLeftRight, AlertTriangle, 
  CheckCircle2, Clock, ShieldCheck, TrendingUp, Server 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const { transactions } = useBanking();

  const volumeData = [
    { time: '06:00', vol: 180000 },
    { time: '08:00', vol: 420000 },
    { time: '10:00', vol: 1250000 },
    { time: '12:00', vol: 2840000 },
    { time: '14:00', vol: 3910000 },
    { time: '16:00', vol: 4210000 },
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">
          Admin Operations & Monitoring Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time system telemetry, switch connectivity, liquidity monitoring, and compliance queue.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Daily Settled Volume</span>
          <div className="text-2xl font-black text-[#102A56]">₹4,21,50,000</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +14.2% vs yesterday
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Core Switch Uptime</span>
          <div className="text-2xl font-black text-[#16A36A]">99.998%</div>
          <span className="text-[10px] text-slate-500">NPCI UPI 2.0 & RBI RTGS</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">KYC Verification Queue</span>
          <div className="text-2xl font-black text-amber-600">3 Pending</div>
          <span className="text-[10px] text-amber-700 font-semibold">Average TAT: 8.5 Mins</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Fraud Risk Index</span>
          <div className="text-2xl font-black text-emerald-600">0.02% Low</div>
          <span className="text-[10px] text-slate-500">Zero chargeback breaches</span>
        </div>
      </div>

      {/* Real-time Settlement Volume Graph */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="font-black text-sm text-[#102A56]">Intraday Payment Settlement Flow</h2>
            <span className="text-[11px] text-slate-500">Real-time cumulative gross volume processed</span>
          </div>
          <span className="text-xs font-mono font-bold text-[#246BFD] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Live Stream (1s tick)
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stop-color="#246BFD" stopOpacity={0.4}/>
                  <stop offset="95%" stop-color="#246BFD" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v/100000}L`} />
              <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Settled']} />
              <Area type="monotone" dataKey="vol" stroke="#246BFD" strokeWidth={2.5} fillOpacity={1} fill="url(#volGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Transaction Monitor Preview */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <h2 className="font-bold text-sm text-[#102A56] border-b pb-3">
          Switch Clearing Feed
        </h2>

        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="py-3 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-[#102A56]">{t.counterpartyName}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Ref: {t.referenceNumber} • RRN: {t.bankRrn}
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-[#102A56]">₹{t.amount.toLocaleString('en-IN')}</div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {t.transferType} • {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
