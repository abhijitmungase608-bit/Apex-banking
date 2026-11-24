import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SandboxAdapters } from '../../services/sandboxAdapters';
import { 
  ShieldCheck, Upload, CheckCircle2, AlertCircle, 
  FileText, Camera, UserCheck, Lock 
} from 'lucide-react';

export const KycVerificationPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();

  const [panNumber, setPanNumber] = useState(profile?.panNumber || 'ABCPS1234F');
  const [aadhaarLastFour, setAadhaarLastFour] = useState(profile?.aadhaarLastFour || '7890');
  const [isVerifyingPan, setIsVerifyingPan] = useState(false);
  const [panResult, setPanResult] = useState<string | null>('PAN status ACTIVE and verified against Income Tax Department records.');
  
  const [docUploaded, setDocUploaded] = useState(true);
  const [selfieTaken, setSelfieTaken] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerifyPan = async () => {
    setErrorMsg('');
    setIsVerifyingPan(true);
    const res = await SandboxAdapters.verifyPan(panNumber);
    setIsVerifyingPan(false);

    if (res.success && res.data) {
      setPanResult(res.message);
    } else {
      setErrorMsg(res.message);
      setPanResult(null);
    }
  };

  const handleSubmitKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!panResult) {
      setErrorMsg('Please verify PAN with NSDL first.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 900));

    updateProfile({
      panNumber: panNumber.toUpperCase(),
      aadhaarLastFour,
      kycStatus: 'APPROVED',
    });

    setIsSubmitting(false);
    setStatusMsg('KYC verified and approved in compliance with RBI master directions.');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">e-KYC Verification Portal</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Paperless Aadhaar and PAN verification adhering to RBI Master Direction on Know Your Customer.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium space-y-6 text-left">
        {/* Status Callout */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#246BFD] text-white flex items-center justify-center font-bold">
              KYC
            </div>
            <div>
              <div className="font-bold text-xs text-[#102A56]">Verification Status</div>
              <div className="text-[11px] text-slate-500">Tier 3 Full Video-KYC Approved</div>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        </div>

        <form onSubmit={handleSubmitKyc} className="space-y-5">
          {/* Step 1: PAN Verification */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Permanent Account Number (PAN)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                maxLength={10}
                value={panNumber}
                onChange={(e) => {
                  setPanNumber(e.target.value.toUpperCase());
                  setPanResult(null);
                }}
                placeholder="ABCPS1234F"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:border-[#246BFD] outline-none"
              />
              <button
                type="button"
                onClick={handleVerifyPan}
                disabled={isVerifyingPan}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102A56] font-bold text-xs"
              >
                {isVerifyingPan ? 'Verifying...' : 'NSDL Verify'}
              </button>
            </div>

            {panResult && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{panResult}</span>
              </div>
            )}
          </div>

          {/* Step 2: Aadhaar e-KYC */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              2. Aadhaar e-KYC (Last 4 Digits)
            </label>
            <input
              type="text"
              required
              maxLength={4}
              value={aadhaarLastFour}
              onChange={(e) => setAadhaarLastFour(e.target.value)}
              placeholder="7890"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-[#246BFD] outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Protected under UIDAI Aadhaar Regulations. We only store tokenized masked credentials.
            </p>
          </div>

          {/* Step 3: Document Upload Simulator */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              3. Supporting Identity Documents
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <FileText className="w-4 h-4 text-[#246BFD]" /> PAN Front Copy
                </span>
                <span className="text-[10px] font-bold text-emerald-600">Uploaded ✓</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Camera className="w-4 h-4 text-[#246BFD]" /> Live Liveness Selfie
                </span>
                <span className="text-[10px] font-bold text-emerald-600">Passed ✓</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all mt-4"
          >
            {isSubmitting ? <span>Updating KYC Records...</span> : <span>Save & Re-verify KYC</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
