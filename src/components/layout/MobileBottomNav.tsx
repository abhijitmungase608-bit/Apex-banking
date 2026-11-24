import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Send, CreditCard, History, User, QrCode } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#246BFD]' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        {/* Transfers */}
        <NavLink
          to="/transfer"
          className={({ isActive }) =>
            `flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#246BFD]' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <Send className="w-5 h-5 mb-0.5" />
          <span>Pay</span>
        </NavLink>

        {/* Center Quick UPI FAB */}
        <div className="-mt-5">
          <NavLink
            to="/upi"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#246BFD] to-[#102A56] text-white shadow-glow border-2 border-white hover:scale-105 active:scale-95 transition-transform"
            title="Scan & Pay / UPI"
          >
            <QrCode className="w-6 h-6" />
          </NavLink>
        </div>

        {/* Cards */}
        <NavLink
          to="/cards"
          className={({ isActive }) =>
            `flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#246BFD]' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          <span>Cards</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#246BFD]' : 'text-slate-500 hover:text-slate-800'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </NavLink>
      </div>
    </div>
  );
};
