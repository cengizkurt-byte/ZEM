import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import { runComprehensiveGameValidation, FullTestSuiteResult } from '../utils/gameTests';

interface TestReportModalProps {
  onClose: () => void;
}

export const TestReportModal: React.FC<TestReportModalProps> = ({ onClose }) => {
  const [suiteResult, setSuiteResult] = useState<FullTestSuiteResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runComprehensiveGameValidation();
      setSuiteResult(res);
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    executeTests();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-7 my-auto text-left relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between gap-4 mb-4 pr-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Sistem & Kural Doğrulama Testleri</h2>
              <p className="text-xs font-semibold text-slate-500">
                Aşama kuralları, dağılımlar ve matematiksel tutarlılık kontrolleri
              </p>
            </div>
          </div>
        </div>

        {/* Test Summary Banner */}
        {suiteResult && (
          <div
            className={`p-3.5 rounded-2xl border mb-4 flex items-center justify-between gap-3 ${
              suiteResult.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {suiteResult.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              <span>
                {suiteResult.passed
                  ? 'Bütün Kural ve Mantık Kontrolleri Başarıyla Geçti!'
                  : 'Bazı test kontrolleri başarısız oldu.'}
              </span>
            </div>
            <div className="font-mono text-xs font-black px-2.5 py-1 bg-white/80 rounded-lg border border-current">
              {suiteResult.passedTests} / {suiteResult.totalTests} Geçti
            </div>
          </div>
        )}

        {/* List of Test Results */}
        <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
          {suiteResult?.results.map((t) => (
            <div
              key={t.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-slate-900 text-sm">{t.title}</span>
                <span
                  className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                    t.passed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {t.passed ? 'BAŞARILI' : 'BAŞARISIZ'}
                </span>
              </div>
              <p className="text-slate-500 mb-1.5">{t.description}</p>
              <div className="p-2 bg-white rounded-lg border border-slate-200/60 font-mono text-[11px] text-slate-800">
                {t.details}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={executeTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>Testleri Yeniden Çalıştır</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
