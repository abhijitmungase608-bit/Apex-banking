import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, Send, QrCode, ArrowLeftRight, 
  Users, History, FileText, CreditCard, PiggyBank, 
  CircleDollarSign, ShieldCheck, LifeBuoy, Bell, Settings,
  ShieldAlert
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_GROUPS: { group: string; items: SidebarItem[] }[] = [
  {
    group: 'CORE BANKING',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Account Overview', path: '/accounts', icon: Wallet },
      { name: 'Transaction History', path: '/transactions', icon: History },
      { name: 'Download Statements', path: '/statements', icon: FileText },
    ],
  },
  {
    group: 'PAYMENTS & TRANSFERS',
    items: [
      { name: 'Money Transfer', path: '/transfer', icon: Send },
      { name: 'Instant UPI Payment', path: '/upi', icon: QrCode, badge: 'FAST' },
      { name: 'IMPS / NEFT / RTGS', path: '/imps-neft-rtgs', icon: ArrowLeftRight },
      { name: 'Beneficiary Management', path: '/beneficiaries', icon: Users },
    ],
  },
  {
    group: 'CARDS & WEALTH',
    items: [
      { name: 'Debit Card Controls', path: '/cards', icon: CreditCard },
      { name: 'Fixed Deposits (FD)', path: '/deposits', icon: PiggyBank, badge: '8.1%' },
      { name: 'Loan Services', path: '/loans', icon: CircleDollarSign },
    ],
  },
  {
    group: 'SECURITY & SUPPORT',
    items: [
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Customer Support 24x7', path: '/support', icon: LifeBuoy },
      { name: 'Security Settings', path: '/security', icon: ShieldCheck },
      { name: 'Device Management', path: '/devices', icon: Settings },
    ],
  },
];

export const AppSidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-65px)] p-4 flex-shrink-0 select-none">
      <div className="space-y-6 flex-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#EAF2FF] text-[#246BFD] shadow-sm'
                        : 'text-slate-600 hover:text-[#102A56] hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#246BFD] text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Fast Switch Banner */}
      <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-[#102A56] to-[#1E3A8A] text-white text-xs shadow-md">
        <div className="flex items-center gap-2 font-bold mb-1">
          <ShieldAlert className="w-4 h-4 text-blue-300" />
          <span>Admin & Compliance</span>
        </div>
        <p className="text-[11px] text-blue-100/80 mb-2.5 leading-relaxed">
          Monitor transactions, audit logs, KYC reviews, and settlement reconciliations.
        </p>
        <NavLink
          to="/admin"
          className="inline-block w-full text-center py-1.5 px-3 rounded-xl bg-white text-[#102A56] font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm"
        >
          Open Admin Dashboard
        </NavLink>
      </div>
    </aside>
  );
};
