import React from 'react';
import { Play, Sparkles, Trophy, HelpCircle, ShieldCheck } from 'lucide-react';
import { GAME_COLORS } from '../types/game';

interface StartScreenProps {
  onStartGame: () => void;
  highScore: number;
  onOpenHowToPlay: () => void;
  onOpenTests: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  highScore,
  onOpenHowToPlay,
  onOpenTests,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center px-4 py-6 sm:py-10 animate-fadeIn">
      {/* Visual Header Mascot / Icon */}
      <div className="relative mb-5">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-md border border-slate-200/80 p-3.5 flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
          <div className="grid grid-cols-2 gap-1.5 w-full h-full">
            <div className="rounded-lg bg-[#2563EB]" />
            <div className="rounded-lg bg-[#E11D48]" />
            <div className="rounded-lg bg-[#EAB308]" />
            <div className="rounded-lg bg-[#2563EB]" />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 p-1.5 rounded-full shadow-sm animate-bounce">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
        En Çok Olan Rengi Bul!
      </h1>
      <p className="text-sm sm:text-base font-semibold text-slate-600 mb-6 max-w-md">
        İlkokul öğrencileri için görsel algı, dikkat ve hızlı karar verme oyunu
      </p>

      {/* High Score Pill if present */}
      {highScore > 0 && (
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs sm:text-sm font-bold shadow-xs">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>En Yüksek Skorun: <strong className="font-mono text-base">{highScore}</strong> Doğru</span>
        </div>
      )}

      {/* Prompt Instructions Card */}
      <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm text-left mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
            Oyun Yönergesi
          </h2>
        </div>
        <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium">
          “Ekrandaki karelere dikkatlice bak. En çok bulunan rengin herhangi bir karesine tıkla. Yanlış seçersen tekrar deneyebilirsin. 80 saniyede olabildiğince çok doğru cevap bul!”
        </p>

        {/* 3 Game Colors Showcase */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 sm:gap-3 text-center">
          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-[#2563EB] shadow-xs" />
            <span className="text-xs font-bold text-slate-700">Mavi</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-[#E11D48] shadow-xs" />
            <span className="text-xs font-bold text-slate-700">Pembe-Kırmızı</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-[#EAB308] shadow-xs" />
            <span className="text-xs font-bold text-slate-700">Sarı</span>
          </div>
        </div>
      </div>

      {/* Primary Big Start Button */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button
          onClick={onStartGame}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold text-lg sm:text-xl rounded-2xl shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <Play className="w-6 h-6 fill-white group-hover:scale-110 transition-transform" />
          <span>Oyuna Başla</span>
        </button>

        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-1">
          <button
            onClick={onOpenHowToPlay}
            className="hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer py-1"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" />
            <span>Nasıl Oynanır?</span>
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={onOpenTests}
            className="hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer py-1"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Kural & Test Kontrolü</span>
          </button>
        </div>
      </div>
    </div>
  );
};
