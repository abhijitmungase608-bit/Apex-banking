import React, { useState } from 'react';
import { CardReference } from '../../types/banking';
import { Eye, EyeOff, ShieldCheck, Wifi, CreditCard } from 'lucide-react';

interface DebitCardVisualProps {
  card: CardReference;
  className?: string;
  allowFlip?: boolean;
}

export const DebitCardVisual: React.FC<DebitCardVisualProps> = ({
  card,
  className = '',
  allowFlip = true,
}) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const isBlocked = card.status === 'BLOCKED';

  return (
    <div className={`relative select-none ${className}`}>
      {/* 3D Physical Card Appearance */}
      <div className={`relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 text-white shadow-2xl transition-all duration-300 overflow-hidden ${
        isBlocked 
          ? 'bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 grayscale opacity-90' 
          : 'bg-gradient-to-tr from-[#102A56] via-[#1D3E78] to-[#246BFD]'
      }`}>
        {/* Holographic foil overlay pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-emerald-200 to-blue-200" />
        
        {/* Circular ambient light */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-48 h-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        {/* Card Header: Brand + Status/Contactless */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xs tracking-wider text-white border border-white/30">
              A
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-widest uppercase">
              APEX <span className="text-blue-300 font-medium">SIGNATURE</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {card.isContactlessActive && (
              <Wifi className="w-5 h-5 text-white/80 rotate-90" />
            )}
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md ${
              isBlocked ? 'bg-red-500/30 text-red-200 border border-red-400/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
            }`}>
              {card.status}
            </span>
          </div>
        </div>

        {/* EMV Microchip + Security Toggle */}
        <div className="relative z-10 my-4 sm:my-5 flex items-center justify-between">
          {/* Realistic metallic EMV Gold Chip */}
          <div className="w-11 h-8 sm:w-12 sm:h-9 rounded-lg bg-gradient-to-br from-amber-300 via-amber-100 to-amber-500 p-1 shadow-inner border border-amber-400/60 flex flex-col justify-between">
            <div className="flex justify-between h-2 border-b border-amber-600/40">
              <span className="w-1/3 border-r border-amber-600/40"></span>
              <span className="w-1/3 border-r border-amber-600/40"></span>
            </div>
            <div className="flex justify-between h-2 border-b border-amber-600/40">
              <span className="w-1/2 border-r border-amber-600/40"></span>
            </div>
            <div className="h-1"></div>
          </div>

          {allowFlip && (
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              type="button"
              className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
            >
              {showSensitive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-medium">{showSensitive ? 'Hide Details' : 'Show CVV'}</span>
            </button>
          )}
        </div>

        {/* Card Number */}
        <div className="relative z-10 mb-3 sm:mb-4">
          <div className="font-mono text-base sm:text-xl md:text-2xl font-bold tracking-[0.2em] drop-shadow-md">
            {showSensitive ? `5081 4492 7831 ${card.lastFourDigits}` : card.maskedCardNumber}
          </div>
        </div>

        {/* Card Footer: Holder, Expiry, CVV, Network Logo */}
        <div className="relative z-10 flex items-end justify-between text-xs">
          <div>
            <div className="text-[9px] uppercase tracking-wider text-white/60 font-medium">Cardholder</div>
            <div className="font-semibold uppercase tracking-wider text-white text-xs sm:text-sm">
              {card.cardHolderName}
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-white/60 font-medium">Expires</div>
              <div className="font-mono font-bold text-white">
                {String(card.expiryMonth).padStart(2, '0')}/{String(card.expiryYear).slice(-2)}
              </div>
            </div>

            {showSensitive && (
              <div className="bg-white/10 px-2 py-0.5 rounded border border-white/20">
                <div className="text-[8px] uppercase tracking-wider text-amber-300 font-bold">CVV</div>
                <div className="font-mono font-black text-amber-200">742</div>
              </div>
            )}

            {/* Network Brand */}
            <div className="text-right">
              <span className="font-black italic text-base sm:text-lg tracking-wider text-white/95">
                {card.cardNetwork}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
