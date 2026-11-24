import React from 'react';
import { useBanking } from '../../context/BankingContext';
import { 
  Laptop, Smartphone, Globe, ShieldCheck, 
  Trash2, MapPin, Clock, AlertCircle 
} from 'lucide-react';

export const DeviceManagementPage: React.FC = () => {
  const { sessions, revokeSession } = useBanking();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Device Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review active sessions and revoke access from unrecognized devices or old browsers.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="font-bold text-sm text-[#102A56] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#246BFD]" />
            Active Authorized Sessions ({sessions.length})
          </div>
          <span className="text-[11px] text-slate-500">
            Real-time IP & Fingerprint Tracking
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {sessions.map((session) => (
            <div key={session.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#246BFD] flex items-center justify-center flex-shrink-0">
                  {session.deviceType === 'Mobile' ? (
                    <Smartphone className="w-5 h-5" />
                  ) : (
                    <Laptop className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#102A56]">{session.deviceName}</span>
                    {session.isCurrent && (
                      <span className="bg-emerald-50 text-emerald-600 font-bold text-[9px] px-2 py-0.5 rounded-full border border-emerald-200">
                        Current Device
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" /> {session.browser} ({session.os})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {session.ipAddress}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {session.lastActiveAt}
                    </span>
                  </div>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => revokeSession(session.id)}
                  className="self-end sm:self-center px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Revoke Session</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
