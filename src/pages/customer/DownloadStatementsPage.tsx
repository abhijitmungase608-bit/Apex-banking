import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { 
  FileText, Download, Calendar, Filter, 
  CheckCircle2, Clock, Sparkles 
} from 'lucide-react';

export const DownloadStatementsPage: React.FC = () => {
  const { primaryAccount } = useBanking();
  const [period, setPeriod] = useState('CURRENT_MONTH');
  const [format, setFormat] = useState('PDF');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      setIsGenerating(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102A56] tracking-tight">Download Statements</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate digitally signed account e-statements in PDF, Excel, or CSV formats.
        </p>
      </div>

      <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        {downloadSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official digitally signed e-statement generated and downloaded successfully.</span>
          </div>
        )}

        <div className="space-y-4 text-left">
          {/* Account Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Bank Account
            </label>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-[#102A56] flex justify-between items-center">
              <span>Apex Platinum Savings ({primaryAccount?.accountNumber})</span>
              <span className="text-[11px] text-[#246BFD] font-normal">Primary</span>
            </div>
          </div>

          {/* Statement Period */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Statement Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Current Month', val: 'CURRENT_MONTH' },
                { label: 'Last 3 Months', val: '3_MONTHS' },
                { label: 'Last 6 Months', val: '6_MONTHS' },
                { label: 'FY 2026-27', val: 'FINANCIAL_YEAR' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setPeriod(item.val)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    period === item.val
                      ? 'bg-[#246BFD] text-white border-[#246BFD] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Document Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'PDF Document (.pdf)', val: 'PDF' },
                { label: 'Excel Spreadsheet (.xlsx)', val: 'EXCEL' },
                { label: 'Plain CSV (.csv)', val: 'CSV' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setFormat(item.val)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    format === item.val
                      ? 'bg-[#246BFD] text-white border-[#246BFD] shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-[#246BFD] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-premium flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? (
                <span>Generating Digitally Signed Statement...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Statement ({format})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
