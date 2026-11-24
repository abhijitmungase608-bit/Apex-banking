import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { DebitCardVisual } from '../../components/cards/DebitCardVisual';
import { 
  CreditCard, Shield, Lock, Unlock, Wifi, 
  Globe, Sliders, CheckCircle2, AlertTriangle, KeyRound 
} from 'lucide-react';

export const DebitCardManagementPage: React.FC = () => {
  const { card, updateCardStatus, updateCardLimits, transactions } = useBanking();

  const [atmLimit, setAtmLimit] = useState(card.dailyAtmLimit.toString());
  const [onlineLimit, setOnlineLimit] = useState(card.dailyOnlineLimit.toString());
  const [domestic, setDomestic] = useState(card.isDomesticActive);
  const [international, setInternational] = useState(card.isInternationalActive);
  const [contactless, setContactless] = useState(card.isContactlessActive);
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const isBlocked = card.status === 'BLOCKED';

  const handleToggleFreeze = () => {
    const nextStatus = isBlocked ? 'ACTIVE' : 'BLOCKED';
    updateCardStatus(nextStatus);
    setToastMsg(`Debit card has been ${nextStatus === 'ACTIVE' ? 'unblocked' : 'temporarily frozen'}.`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    updateCardLimits({
      dailyAtmLimit: parseFloat(atmLimit) || 50000,
      dailyOnlineLimit: parseFloat(onlineLimit) || 100000,
      isDomesticActive: domestic,
      isInternationalActive: international,
      isContactlessActive: contactless,
    });
    setToastMsg('Security spend controls and limits updated successfully.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handlePinChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4 || newPin !== confirmPin) {
      alert('PIN must be 4 digits and match confirm PIN.');
      return;
    }
    setShowPinModal(false);
    setNewPin('');
    setConfirmPin('');
    setToastMsg('ATM PIN reset securely via HSM Tokenizer.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Debit Card Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tokenized card controls, dynamic limits, and instant temporary freeze.
          </p>
        </div>

        <button
          onClick={handleToggleFreeze}
          className={`self-start sm:self-auto px-4 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-2 shadow-sm ${
            isBlocked
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
          }`}
        >
          {isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{isBlocked ? 'Unfreeze Card' : 'Temporary Freeze'}</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Card Visual & Quick Actions */}
        <div className="space-y-6">
          <div className="max-w-md mx-auto">
            <DebitCardVisual card={card} allowFlip />
          </div>

          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex items-center justify-around text-center">
            <button
              onClick={() => setShowPinModal(true)}
              className="p-3 rounded-2xl hover:bg-slate-50 text-slate-700 transition-colors flex flex-col items-center gap-1 text-xs font-bold"
            >
              <KeyRound className="w-5 h-5 text-[#246BFD]" />
              <span>Reset ATM PIN</span>
            </button>

            <div className="h-8 w-px bg-slate-200" />

            <button
              onClick={handleToggleFreeze}
              className="p-3 rounded-2xl hover:bg-slate-50 text-slate-700 transition-colors flex flex-col items-center gap-1 text-xs font-bold"
            >
              <Shield className="w-5 h-5 text-red-500" />
              <span>{isBlocked ? 'Unblock Card' : 'Freeze Card'}</span>
            </button>
          </div>
        </div>

        {/* Right: Security & Limits Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5 text-left">
          <h2 className="font-bold text-sm text-[#102A56] flex items-center gap-2 border-b pb-3">
            <Sliders className="w-4 h-4 text-[#246BFD]" />
            Transaction Controls & Limits
          </h2>

          <form onSubmit={handleSaveLimits} className="space-y-4">
            {/* Daily ATM Limit */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Daily ATM Cash Withdrawal Limit</span>
                <span className="text-[#246BFD]">₹{parseFloat(atmLimit).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={atmLimit}
                onChange={(e) => setAtmLimit(e.target.value)}
                className="w-full accent-[#246BFD]"
              />
            </div>

            {/* Daily Online Limit */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Daily Online / E-commerce Limit</span>
                <span className="text-[#246BFD]">₹{parseFloat(onlineLimit).toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="300000"
                step="10000"
                value={onlineLimit}
                onChange={(e) => setOnlineLimit(e.target.value)}
                className="w-full accent-[#246BFD]"
              />
            </div>

            <div className="pt-2 space-y-3">
              {/* Domestic Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs">
                  <div className="font-bold text-[#102A56]">Domestic Transactions</div>
                  <div className="text-[11px] text-slate-500">Allow payments within India</div>
                </div>
                <input
                  type="checkbox"
                  checked={domestic}
                  onChange={(e) => setDomestic(e.target.checked)}
                  className="w-4 h-4 text-[#246BFD] rounded"
                />
              </div>

              {/* International Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs">
                  <div className="font-bold text-[#102A56]">International Usage</div>
                  <div className="text-[11px] text-slate-500">Cross-border foreign currency spends</div>
                </div>
                <input
                  type="checkbox"
                  checked={international}
                  onChange={(e) => setInternational(e.target.checked)}
                  className="w-4 h-4 text-[#246BFD] rounded"
                />
              </div>

              {/* Contactless Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-xs">
                  <div className="font-bold text-[#102A56]">Contactless Tap & Pay (NFC)</div>
                  <div className="text-[11px] text-slate-500">Instant POS tap up to ₹5,000 without PIN</div>
                </div>
                <input
                  type="checkbox"
                  checked={contactless}
                  onChange={(e) => setContactless(e.target.checked)}
                  className="w-4 h-4 text-[#246BFD] rounded"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium transition-all mt-3"
            >
              Save Controls
            </button>
          </form>
        </div>
      </div>

      {/* Reset PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 text-left">
            <h3 className="font-black text-base text-[#102A56]">Reset ATM PIN</h3>
            <p className="text-xs text-slate-500">
              Set a secure 4-digit PIN for ATM and POS transactions.
            </p>

            <form onSubmit={handlePinChange} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold font-mono tracking-widest outline-none focus:border-[#246BFD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-lg font-bold font-mono tracking-widest outline-none focus:border-[#246BFD]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#246BFD] text-white font-bold text-xs shadow-sm"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
