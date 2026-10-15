import React from 'react';
import { Volume2, VolumeX, Flame, Clock, Award, ShieldCheck, HelpCircle } from 'lucide-react';
import { GameStatus } from '../types/game';

interface HeaderProps {
  status: GameStatus;
  timeLeft: number;
  score: number;
  currentRoundNumber: number;
  stageName: string;
  streak: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHowToPlay: () => void;
  onOpenTests: () => void;
  onQuitToMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  timeLeft,
  score,
  currentRoundNumber,
  stageName,
  streak,
  isMuted,
  onToggleMute,
  onOpenHowToPlay,
  onOpenTests,
  onQuitToMenu,
}) => {
  const isPlaying = status === 'PLAYING';
  const isLastTenSeconds = isPlaying && timeLeft <= 10 && timeLeft > 0;
  const formattedTime = Math.ceil(timeLeft);

  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-30 transition-all shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={isPlaying ? onQuitToMenu : undefined}
            className={`flex items-center gap-2 text-left group ${isPlaying ? 'cursor-pointer hover:opacity-85' : 'cursor-default'}`}
            title={isPlaying ? 'Ana Menüye Dön' : 'En Çok Olan Rengi Bul!'}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 via-rose-500 to-amber-400 flex items-center justify-center text-white font-black text-sm shadow-xs">
              R
            </div>
            <div>
              <span className="font-bold text-slate-900 text-base tracking-tight block leading-tight">
                En Çok Olan Rengi Bul!
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                Eğitici Dikkat Oyunu
              </span>
            </div>
          </button>
        </div>

        {/* In-Game Center HUD */}
        {isPlaying ? (
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Timer Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                isLastTenSeconds
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm animate-pulse'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
              title="Kalan Süre (Toplam 80 sn)"
            >
              <Clock
                className={`w-4 h-4 ${isLastTenSeconds ? 'text-rose-600' : 'text-slate-500'}`}
              />
              <span className="font-mono font-bold text-sm sm:text-base tabular-nums">
                {formattedTime}s
              </span>
            </div>

            {/* Score Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900"
              title="Toplam Doğru Puanı"
            >
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-700 font-medium hidden sm:inline">Puan:</span>
              <span className="font-mono font-bold text-sm sm:text-base tabular-nums">
                {score}
              </span>
            </div>

            {/* Round Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700"
              title={stageName}
            >
              <span className="text-xs font-semibold text-slate-500">Tur</span>
              <span className="font-mono font-bold text-sm sm:text-base text-slate-900 tabular-nums">
                {currentRoundNumber}
              </span>
            </div>

            {/* Streak Badge (only if streak >= 2) */}
            {streak >= 2 && (
              <div
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold animate-bounce"
                title={`${streak} Tur Üst Üste Doğru!`}
              >
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span className="tabular-nums font-mono">{streak} Seri</span>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span>80 Saniyelik Oturum</span>
            <span aria-hidden="true">·</span>
            <span>Görsel Algı & Hız</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* How to Play Guide Button */}
          <button
            onClick={onOpenHowToPlay}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Nasıl Oynanır?"
            aria-label="Nasıl Oynanır?"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Sound Toggle Button */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-rose-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* Verification & Self-Test Suite Button */}
          <button
            onClick={onOpenTests}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Kurallar & Sistem Doğrulama Testleri"
            aria-label="Sistem Testleri"
          >
            <ShieldCheck className="w-5 h-5 text-slate-600" />
          </button>

          {/* Quit button during active game */}
          {isPlaying && (
            <button
              onClick={onQuitToMenu}
              className="ml-1 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              Çıkış
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
