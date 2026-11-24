import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { Link } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  CreditCard, ExternalLink, CheckCircle2, AlertCircle 
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { primaryAccount } = useBanking();

  const [address, setAddress] = useState(profile?.addressLine1 || 'Flat 402, Highmont Greens, Hinjawadi Phase 1');
  const [city, setCity] = useState(profile?.city || 'Pune');
  const [state, setState] = useState(profile?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(profile?.pincode || '411057');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      addressLine1: address,
      city,
      state,
      pincode,
    });
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Customer Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View official KYC records, contact coordinates, and registered communication preferences.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile address coordinates updated successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Profile Card & KYC Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft text-center space-y-4">
          <div className="relative inline-block">
            <img
              src={profile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md mx-auto"
            />
            <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow">
              ✓
            </span>
          </div>

          <div>
            <h2 className="font-extrabold text-base text-[#102A56]">{profile?.fullName}</h2>
            <div className="text-xs text-slate-500 mt-0.5">{user?.email}</div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Video-KYC Verified</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer ID</span>
              <span className="font-mono font-bold text-[#102A56]">APX-CUST-88192</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Registered UPI</span>
              <span className="font-semibold text-[#246BFD]">{profile?.upiId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Member Since</span>
              <span className="text-slate-700">Jan 2024</span>
            </div>
          </div>

          <Link
            to="/kyc"
            className="w-full py-2.5 px-3 rounded-xl bg-blue-50 text-[#246BFD] font-bold text-xs hover:bg-blue-100/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View KYC Certificate</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right: Address and Details Form */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft space-y-5 text-left">
          <h3 className="font-bold text-sm text-[#102A56] border-b pb-3">
            Residential & Communication Address
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Permanent Street Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-[#246BFD] outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>

          {/* Statutory Tax IDs */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Statutory Tax Identifiers (Locked)
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Permanent Account Number (PAN)</span>
                <span className="font-mono font-bold text-[#102A56]">{profile?.panNumber || 'ABCPS1234F'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Aadhaar (Last 4 Digits)</span>
                <span className="font-mono font-bold text-[#102A56]">•••• •••• {profile?.aadhaarLastFour || '7890'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
