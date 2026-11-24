import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, CheckCircle2, XCircle, Search, 
  ShieldCheck, AlertCircle, FileText 
} from 'lucide-react';

interface KycApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaarLastFour: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const CustomerManagementPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();

  const [applications, setApplications] = useState<KycApplication[]>([
    {
      id: 'app_01',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@apexbank.in',
      phone: '+91 98765 43210',
      pan: 'ABCPS1234F',
      aadhaarLastFour: '7890',
      submittedAt: 'Today at 09:30',
      status: 'APPROVED',
    },
    {
      id: 'app_02',
      name: 'Neha Kapoor',
      email: 'neha.kapoor@example.com',
      phone: '+91 98112 33445',
      pan: 'BNYPK8821M',
      aadhaarLastFour: '4512',
      submittedAt: 'Today at 11:15',
      status: 'PENDING',
    },
    {
      id: 'app_03',
      name: 'Suresh Menon',
      email: 'suresh.menon@example.com',
      phone: '+91 97401 99882',
      pan: 'AAAPS9912K',
      aadhaarLastFour: '6621',
      submittedAt: 'Yesterday at 16:45',
      status: 'PENDING',
    },
  ]);

  const [toast, setToast] = useState('');

  const handleApprove = (id: string, name: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
    setToast(`Approved full video-KYC and PAN compliance for ${name}.`);
    setTimeout(() => setToast(''), 4000);
  };

  const handleReject = (id: string, name: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a));
    setToast(`Rejected application for ${name}. Regulatory reason recorded.`);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Customer Management & KYC Queue</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review customer verification documents against NSDL PAN and UIDAI Aadhaar registries.
        </p>
      </div>

      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-[#102A56]">Verification Queue ({applications.length})</h2>
          <span className="text-[11px] text-slate-400">Strict Data Minimization Active</span>
        </div>

        <div className="divide-y divide-slate-100">
          {applications.map((app) => (
            <div key={app.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#102A56]">{app.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                    app.status === 'REJECTED' ? 'bg-red-50 text-red-700' :
                    'bg-amber-50 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>{app.email}</span>
                  <span>•</span>
                  <span>{app.phone}</span>
                  <span>•</span>
                  <span className="font-mono">PAN: {app.pan}</span>
                  <span>•</span>
                  <span className="font-mono">Aadhaar: •••• {app.aadhaarLastFour}</span>
                </div>
              </div>

              {app.status === 'PENDING' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(app.id, app.name)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve KYC
                  </button>
                  <button
                    onClick={() => handleReject(app.id, app.name)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs transition-colors flex items-center gap-1 border border-red-200"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-400">
                  Application Reviewed
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
