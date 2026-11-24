import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { SupportTicket } from '../../types/banking';
import { 
  LifeBuoy, MessageSquare, Plus, CheckCircle2, 
  Send, Bot, PhoneCall, Mail, Building2, ChevronDown, ChevronUp 
} from 'lucide-react';

export const CustomerSupportPage: React.FC = () => {
  const { tickets, createSupportTicket } = useBanking();

  const [showNewModal, setShowNewModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('PAYMENTS');
  const [priority, setPriority] = useState<SupportTicket['priority']>('MEDIUM');

  // AI Support Bot Chat State
  const [botMessages, setBotMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: 'Hello! I am Apex AI Assistant. How can I help you today with money transfers, card controls, or branch coordinates?',
    },
  ]);
  const [userQuery, setUserQuery] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !desc) return;

    createSupportTicket(subject, desc, category, priority);
    setShowNewModal(false);
    setSubject('');
    setDesc('');
  };

  const handleSendBotQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery;
    setBotMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery('');

    // Instant Smart Banking Bot Response Simulation
    setTimeout(() => {
      let botReply = 'I have noted your query. You can also raise a formal support ticket with our compliance desk.';
      const q = query.toLowerCase();

      if (q.includes('ifsc') || q.includes('code')) {
        botReply = 'The IFSC code for all Apex Digital Banking operations is APEX0001088 (Pune Financial District Branch).';
      } else if (q.includes('limit') || q.includes('atm')) {
        botReply = 'Your daily ATM limit is up to ₹1,00,000, and online e-commerce limit is up to ₹2,00,000. You can customize them in Cards Management.';
      } else if (q.includes('fee') || q.includes('charge')) {
        botReply = 'Apex Banking offers ₹0.00 zero-fee transfers across all UPI, IMPS, NEFT, and RTGS channels.';
      } else if (q.includes('fd') || q.includes('interest')) {
        botReply = 'Our term deposits yield up to 8.10% p.a. for 36 months, compounding quarterly with DICGC deposit insurance protection.';
      }

      setBotMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 450);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Customer Support 24x7</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Round-the-clock banking assistance, instant AI guidance, and formal ticket redressal.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#246BFD] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors shadow-premium flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: AI Banking Assistant Chat */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex flex-col h-[480px]">
          <div className="flex items-center gap-2.5 border-b pb-3">
            <div className="w-8 h-8 rounded-xl bg-[#246BFD] text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-[#102A56]">Apex AI Assistant</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online 24x7
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-3">
            {botMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#246BFD] text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendBotQuery} className="pt-2 border-t flex gap-2">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask anything (e.g. IFSC, limits, FD rates)..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#246BFD] text-white hover:bg-[#1D4ED8]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Support Tickets Feed & Official Contacts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <h2 className="font-bold text-sm text-[#102A56] flex items-center gap-2 border-b pb-3">
              <MessageSquare className="w-4 h-4 text-[#246BFD]" />
              My Raised Support Tickets ({tickets.length})
            </h2>

            <div className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <div key={t.id} className="py-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#102A56]">{t.subject}</span>
                      <span className="text-[10px] font-mono text-slate-400">({t.ticketNumber})</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{t.description}</p>

                  {t.adminResponse && (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-[#246BFD] block text-[10px] uppercase">Official Bank Response</span>
                      <p>{t.adminResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Grievance & Regulatory Contacts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
              <span className="font-bold text-xs text-[#102A56] flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#246BFD]" />
                Toll-Free Helpline
              </span>
              <div className="text-sm font-black text-[#246BFD]">1800 209 8899</div>
              <p className="text-[10px] text-slate-500">24x7 Customer Care Assistance across India</p>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-1">
              <span className="font-bold text-xs text-[#102A56] flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#246BFD]" />
                Grievance Officer
              </span>
              <div className="text-xs font-bold text-slate-800">grievance@apexbank.in</div>
              <p className="text-[10px] text-slate-500">RBI Banking Ombudsman Escort Scheme</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-base text-[#102A56]">Raise Support Ticket</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
                >
                  <option value="PAYMENTS">Payments & Transfers (UPI / IMPS)</option>
                  <option value="CARDS">Debit Cards & ATM Controls</option>
                  <option value="KYC">KYC & Document Verification</option>
                  <option value="ACCOUNTS">Account Statements & Balances</option>
                  <option value="SECURITY">Security & Authentication</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summary of the issue"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Please provide reference numbers, dates, and details..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium transition-all"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
