import React from 'react';
import { X, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-7 my-auto text-left relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Nasıl Oynanır?</h2>
            <p className="text-xs font-semibold text-slate-500">Oyun Kuralları ve Taktikleri</p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          {/* Rule 1 */}
          <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">En Çok Olan Rengi Bul</strong>
              Ekranda görünen renkli karelere dikkatlice bak. Sayıca en fazla olan rengi belirle ve o renge ait herhangi bir kareye tıkla.
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Yanlış Yaparsan Yeniden Dene</strong>
              Yanlış renge tıklarsan puanın eksilmez! Aynı görsel üzerinde doğru rengi bulana kadar tıklamaya devam edebilirsin.
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Toplam 80 Saniye</strong>
              Oyun süresi tam 80 saniyedir. Süre akarken olabildiğince çok doğru cevaba ulaşmaya çalış.
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </div>
            <div>
              <strong className="block text-slate-900 font-bold mb-0.5">Aşama İlerlemesi</strong>
              <ul className="text-xs text-slate-600 space-y-1 mt-1 font-medium">
                <li>• 1–3. turlar: 3×3 (9 kare) ve 2 renk</li>
                <li>• 4–7. turlar: 3×3 (9 kare) ve 3 renk</li>
                <li>• 8–12. turlar: 4×4 (16 kare) ve 2 renk</li>
                <li>• 13–30. turlar: 4×4 (16 kare) ve 3 renk</li>
                <li>• 30 tur biterse, 80 saniye bitene kadar bonus turlar devam eder!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Anladım, Hazırım!
          </button>
        </div>
      </div>
    </div>
  );
};
