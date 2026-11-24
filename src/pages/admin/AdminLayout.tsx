import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { ApexLogo } from '../../components/common/ApexLogo';
import { SandboxBadge } from '../../components/common/SandboxBadge';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldAlert, Users, ArrowLeftRight, AlertTriangle, 
  LifeBuoy, FileText, CheckCircle2, Activity, ArrowLeft,
  Server, LogOut 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleReturnToCustomer = () => {
    switchRole('CUSTOMER');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FD] flex flex-col font-sans">
      {/* Admin Top Banner */}
      <header className="sticky top-0 z-30 bg-[#102A56] text-white px-4 sm:px-6 py-3 shadow-md border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ApexLogo size="sm" light showTagline={false} />
            <span className="hidden sm:inline-block bg-blue-500/20 text-blue-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">
              Regulatory Compliance & Operations Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <SandboxBadge />

            <button
              onClick={handleReturnToCustomer}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 rounded-xl text-red-300 hover:text-red-100 hover:bg-red-500/20 transition-colors"
              title="Sign Out Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Admin Navigation Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 p-4 select-none">
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              OPERATIONS & AUDIT
            </div>

            {[
              { name: 'Admin Overview', path: '/admin', icon: Activity },
              { name: 'Customer & KYC Queue', path: '/admin/customers', icon: Users, badge: '3 Pending' },
              { name: 'Transaction Feed', path: '/admin/transactions', icon: ArrowLeftRight },
              { name: 'Fraud & Risk Alerts', path: '/admin/fraud', icon: AlertTriangle },
              { name: 'Support Redressal', path: '/admin/support', icon: LifeBuoy },
              { name: 'Settlement Reconcile', path: '/admin/reconciliation', icon: CheckCircle2 },
              { name: 'Compliance Audit Logs', path: '/admin/audit', icon: FileText },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
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
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="mt-auto p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#102A56]">
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              RBI Switch Latency: 142ms
            </div>
            <p className="text-slate-500 text-[10px]">Immutable double-entry ledger verified.</p>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
