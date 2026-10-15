import React, { useState } from 'react';
import { RotateCcw, Trophy, Target, Clock, Zap, CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { GameStats, GAME_COLORS } from '../types/game';

interface GameOverModalProps {
  stats: GameStats;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  isNewHighScore,
  onPlayAgain,
  onGoHome,
}) => {
  const [showWrongDetails, setShowWrongDetails] = useState(false);

  // Encouraging child-friendly positive message based on score
  let encouragingMessage = 'Harika iş çıkardın!';
  let encouragingSub = 'Görsel dikkatin ve odaklanman gerçekten çok etkileyici!';

  if (stats.score >= 25) {
    encouragingMessage = 'Harika iş çıkardın!';
    encouragingSub = 'Göz açıp kapayıncaya kadar en çok olan rengi buldun, süpersin!';
  } else if (stats.score >= 15) {
    encouragingMessage = 'Dikkatin çok gelişiyor!';
    encouragingSub = 'Her turda renkleri hızlıca karşılaştırdın ve çok iyi odaklandın!';
  } else {
    encouragingMessage = 'Bir tur daha oynamaya ne dersin?';
    encouragingSub = 'Her denemede gözlerin renklere daha çok alışacak ve daha da hızlanacaksın!';
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 my-auto text-center">
        {/* Trophy / Star Header */}
        <div className="relative inline-flex items-center justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center shadow-inner">
            <Trophy className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>
          {isNewHighScore && (
            <div className="absolute -top-2 -right-3 px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Yeni Rekor!
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
          {encouragingMessage}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 font-medium mb-6 px-2">
          {encouragingSub}
        </p>

        {/* Primary Big Score Counter */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 mb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
            Toplam Puan (Doğru Renk)
          </span>
          <span className="text-4xl sm:text-5xl font-black font-mono text-blue-900 tabular-nums">
            {stats.score}
          </span>
        </div>

        {/* Comprehensive Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-left mb-6">
          {/* Completed Rounds */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Tamamlanan Tur</span>
            </div>
            <span className="text-lg font-black font-mono text-slate-800 tabular-nums">
              {stats.completedRounds}
            </span>
          </div>

          {/* Correct Choices */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Doğru Cevap</span>
            </div>
            <span className="text-lg font-black font-mono text-emerald-700 tabular-nums">
              {stats.correctClicks}
            </span>
          </div>

          {/* Wrong Choices */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Yanlış Tıklama</span>
            </div>
            <span className="text-lg font-black font-mono text-rose-600 tabular-nums">
              {stats.wrongClicks}
            </span>
          </div>

          {/* Accuracy Percentage */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <Target className="w-3.5 h-3.5 text-indigo-600" />
              <span>Doğruluk Oranı</span>
            </div>
            <span className="text-lg font-black font-mono text-slate-800 tabular-nums">
              %{stats.accuracy}
            </span>
          </div>

          {/* Avg Response Time */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Ortalama Süre</span>
            </div>
            <span className="text-lg font-black font-mono text-slate-800 tabular-nums">
              {stats.averageResponseTimeSec > 0 ? `${stats.averageResponseTimeSec} sn` : '-'}
            </span>
          </div>

          {/* Max Streak */}
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>En Uzun Seri</span>
            </div>
            <span className="text-lg font-black font-mono text-slate-800 tabular-nums">
              {stats.maxStreak}
            </span>
          </div>
        </div>

        {/* Expandable Wrong Clicks Detail (Child friendly & teacher review) */}
        {stats.wrongClickLogs.length > 0 && (
          <div className="mb-6 text-left">
            <button
              onClick={() => setShowWrongDetails(!showWrongDetails)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors py-1 cursor-pointer"
            >
              <span>Öğrenme İpuçları & Yanlış Seçimler ({stats.wrongClickLogs.length})</span>
              {showWrongDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showWrongDetails && (
              <div className="mt-2 max-h-40 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700">
                <p className="text-[11px] text-slate-500 mb-1 italic">
                  Yanlış seçimler öğrenmenin en doğal parçasıdır. İşte pratik yapılan turlar:
                </p>
                {stats.wrongClickLogs.map((log, idx) => {
                  const chosenName = GAME_COLORS[log.chosenColor].nameTr;
                  const correctName = GAME_COLORS[log.correctColor].nameTr;
                  return (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/60 last:border-0">
                      <span>Tur {log.roundNumber}:</span>
                      <span className="text-slate-600">
                        Seçilen: <strong className="text-rose-600">{chosenName}</strong> → En çok olan: <strong className="text-emerald-600">{correctName}</strong>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tekrar Oyna</span>
          </button>
          <button
            onClick={onGoHome}
            className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base rounded-2xl transition-all cursor-pointer"
          >
            Menüye Dön
          </button>
        </div>
      </div>
    </div>
  );
};
