import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Cpu, Server } from 'lucide-react';

export const SandboxBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block z-40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF2FF] border border-[#246BFD]/30 text-[#246BFD] text-xs font-semibold hover:bg-[#246BFD]/10 transition-all shadow-sm"
        title="Verified Sandbox Environment - RBI / NPCI Emulated Switches"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#246BFD] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#246BFD]"></span>
        </span>
        <span className="tracking-wide uppercase font-bold text-[11px]">Sandbox Active</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 p-4 bg-white rounded-2xl shadow-premium border border-slate-200 text-left text-xs text-slate-700 space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-bold text-[#102A56] flex items-center gap-1.5 text-sm">
              <Server className="w-4 h-4 text-[#246BFD]" />
              Regulatory Sandbox Hub
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
              RBI / NPCI Live-Sim
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            In compliance with Indian banking regulations, transactions run on high-fidelity sandbox adapters with strict idempotency and double-entry ledger verification.
          </p>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 text-[11px]">
              <span className="text-slate-600 font-medium">NPCI UPI 2.0 Switch</span>
              <span className="text-[#16A36A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Operational
              </span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 text-[11px]">
              <span className="text-slate-600 font-medium">RBI NEFT / RTGS Batches</span>
              <span className="text-[#16A36A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Hourly Sync
              </span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 text-[11px]">
              <span className="text-slate-600 font-medium">NSDL PAN / Aadhaar e-KYC</span>
              <span className="text-[#16A36A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
          </div>

          <div className="pt-1 text-[10px] text-slate-400 italic text-center">
            Zero fake balances in production. All state changes persist via immutable ledger.
          </div>
        </div>
      )}
    </div>
  );
};
