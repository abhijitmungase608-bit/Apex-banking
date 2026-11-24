import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { LifeBuoy, MessageSquare, CheckCircle2, Send } from 'lucide-react';

export const SupportRedressalPage: React.FC = () => {
  const { tickets, replySupportTicket } = useBanking();
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [toast, setToast] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    replySupportTicket(selectedTicket.id, replyText, 'RESOLVED');
    setToast(`Replied and resolved ticket ${selectedTicket.ticketNumber}.`);
    setReplyText('');
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Support Redressal Desk</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review customer inquiries, resolve technical payment disputes, and dispatch official responses.
        </p>
      </div>

      {toast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
          <div className="p-4 border-b border-slate-100 font-bold text-xs text-[#102A56]">
            Ticket Queue ({tickets.length})
          </div>
          <div className="divide-y divide-slate-100">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`w-full p-4 text-left transition-colors ${
                  selectedTicketId === t.id ? 'bg-[#EAF2FF]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-[#102A56] truncate max-w-[150px]">{t.subject}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{t.ticketNumber} • {t.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Ticket Detail & Response Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-5">
          {selectedTicket ? (
            <>
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-[#102A56]">{selectedTicket.subject}</h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Ticket Ref: {selectedTicket.ticketNumber} • Category: {selectedTicket.category} • Priority: {selectedTicket.priority}
                  </div>
                </div>
                <span className="text-xs font-bold text-[#246BFD] bg-blue-50 px-2.5 py-1 rounded-full">
                  Status: {selectedTicket.status}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-[#102A56] block">Customer Query:</span>
                <p className="leading-relaxed">{selectedTicket.description}</p>
              </div>

              {selectedTicket.adminResponse && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold text-emerald-800 block">Existing Admin Response:</span>
                  <p className="leading-relaxed">{selectedTicket.adminResponse}</p>
                </div>
              )}

              <form onSubmit={handleSendReply} className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Compose Resolution Response
                </label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Provide resolution details for customer..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response & Resolve</span>
                </button>
              </form>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a ticket to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
