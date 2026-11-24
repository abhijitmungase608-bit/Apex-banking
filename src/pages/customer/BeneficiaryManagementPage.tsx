import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { SandboxAdapters } from '../../services/sandboxAdapters';
import { 
  Users, Plus, Trash2, ShieldCheck, CheckCircle2, 
  Coins, QrCode, Building2, Search, AlertCircle 
} from 'lucide-react';

export const BeneficiaryManagementPage: React.FC = () => {
  const { beneficiaries, addBeneficiary, deleteBeneficiary } = useBanking();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [benType, setBenType] = useState<'BANK' | 'UPI'>('BANK');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [upiId, setUpiId] = useState('');
  const [dailyLimit, setDailyLimit] = useState('100000');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const filtered = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.accountNumber?.includes(searchQuery) ||
    b.upiId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = async () => {
    setErrorMsg('');
    setVerifiedStatus(null);
    setIsVerifying(true);

    if (benType === 'UPI') {
      const res = await SandboxAdapters.verifyVpa(upiId);
      setIsVerifying(false);
      if (res.success && res.data) {
        setName(res.data.name);
        setVerifiedStatus(`Verified VPA: ${res.data.name}`);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      const res = await SandboxAdapters.pennyDropVerification(accountNumber, ifscCode);
      setIsVerifying(false);
      if (res.success && res.data) {
        setName(res.data.accountHolderName);
        setVerifiedStatus(`₹1 Penny Drop Verified: ${res.data.accountHolderName} (${res.data.bankName})`);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg('Please verify the beneficiary details first.');
      return;
    }

    addBeneficiary({
      profileId: 'prof_apex_01',
      name,
      nickname,
      transferType: benType,
      accountNumber: benType === 'BANK' ? accountNumber : undefined,
      ifscCode: benType === 'BANK' ? ifscCode.toUpperCase() : undefined,
      bankName: benType === 'BANK' ? `${ifscCode.slice(0, 4)} Bank` : undefined,
      upiId: benType === 'UPI' ? upiId.toLowerCase() : undefined,
      dailyLimit: parseFloat(dailyLimit) || 100000,
    });

    setShowAddModal(false);
    // Reset form
    setName('');
    setNickname('');
    setAccountNumber('');
    setIfscCode('');
    setUpiId('');
    setVerifiedStatus(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Beneficiary Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authorized transfer payees with Penny-Drop and NPCI VPA verification.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#246BFD] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors shadow-premium flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Beneficiary</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, account number, or UPI ID..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:border-[#246BFD] outline-none shadow-sm"
        />
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ben) => (
          <div key={ben.id} className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-soft flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-[#102A56]">{ben.name}</span>
                {ben.isVerified && (
                  <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
              </div>

              {ben.nickname && (
                <div className="text-[11px] font-medium text-slate-500">
                  Tag: {ben.nickname}
                </div>
              )}

              <div className="text-xs font-mono text-slate-600 pt-1">
                {ben.transferType === 'UPI' ? (
                  <span className="text-[#246BFD] font-bold">{ben.upiId}</span>
                ) : (
                  <span>
                    {ben.bankName} • {ben.accountNumber} ({ben.ifscCode})
                  </span>
                )}
              </div>

              <div className="text-[10px] text-slate-400 pt-1">
                Daily Limit: ₹{ben.dailyLimit.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={() => deleteBeneficiary(ben.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Beneficiary"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-black text-base text-[#102A56]">Add Verified Beneficiary</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBenType('BANK')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  benType === 'BANK' ? 'bg-[#246BFD] text-white border-[#246BFD]' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                Bank Account (IMPS/NEFT)
              </button>
              <button
                type="button"
                onClick={() => setBenType('UPI')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  benType === 'UPI' ? 'bg-[#246BFD] text-white border-[#246BFD]' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                UPI ID (VPA)
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              {benType === 'BANK' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="9 to 18 digit account"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        placeholder="e.g. HDFC0000240"
                        className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase outline-none focus:border-[#246BFD]"
                      />
                      <button
                        type="button"
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#246BFD] font-bold text-xs"
                      >
                        {isVerifying ? 'Checking...' : '₹1 Verify'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">UPI VPA</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="user@bank"
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
                    />
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={isVerifying}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#246BFD] font-bold text-xs"
                    >
                      {isVerifying ? 'Checking...' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}

              {verifiedStatus && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{verifiedStatus}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Beneficiary Legal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Verified Full Name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nickname (Optional)</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Landlord, Office colleague"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#246BFD]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#246BFD] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors mt-2"
              >
                Save Beneficiary
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
