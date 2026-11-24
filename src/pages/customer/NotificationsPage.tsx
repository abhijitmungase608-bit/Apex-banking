import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { 
  Bell, CheckCheck, ShieldAlert, Sparkles, 
  ArrowUpRight, AlertCircle, Clock 
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useBanking();
  const [filter, setFilter] = useState<'ALL' | 'TRANSACTION' | 'SECURITY' | 'OFFER' | 'SYSTEM'>('ALL');

  const filtered = notifications.filter(n => filter === 'ALL' || n.category === filter);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Notifications & Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Security notices, transaction alerts, and banking updates.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <CheckCheck className="w-3.5 h-3.5 text-[#246BFD]" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        {(['ALL', 'TRANSACTION', 'SECURITY', 'OFFER', 'SYSTEM'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === cat
                ? 'bg-[#246BFD] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft divide-y divide-slate-100 overflow-hidden text-left">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                !item.isRead ? 'bg-[#EAF2FF]/40 hover:bg-[#EAF2FF]/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  item.category === 'SECURITY' ? 'bg-amber-100 text-amber-700' :
                  item.category === 'TRANSACTION' ? 'bg-blue-100 text-[#246BFD]' :
                  item.category === 'OFFER' ? 'bg-purple-100 text-purple-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {item.category === 'SECURITY' ? <ShieldAlert className="w-4 h-4" /> :
                   item.category === 'TRANSACTION' ? <ArrowUpRight className="w-4 h-4" /> :
                   <Sparkles className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#102A56]">{item.title}</span>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#246BFD]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{item.message}</p>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
