import { useState, useEffect, useRef, useCallback } from 'react';
import { GameStatus, RoundData, RoundSquare, GameStats, GameColor } from './types/game';
import { generateGameRounds, generateRound } from './utils/roundGenerator';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { SquareGrid } from './components/SquareGrid';
import { StartScreen } from './components/StartScreen';
import { GameOverModal } from './components/GameOverModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { TestReportModal } from './components/TestReportModal';
import { Sparkles } from 'lucide-react';

const TOTAL_SESSION_SECONDS = 80;
const POSITIVE_PRAISES = [
  'Harika!',
  'Aferin!',
  'Doğru bildin!',
  'Süpersin!',
  'Mükemmel!',
  'Harikasın!',
  'Çok iyi!',
];

export default function App() {
  // Game state
  const [status, setStatus] = useState<GameStatus>('MENU');
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SESSION_SECONDS);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);

  // Statistics
  const [score, setScore] = useState<number>(0);
  const [correctClicks, setCorrectClicks] = useState<number>(0);
  const [wrongClicks, setWrongClicks] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [roundResponseTimes, setRoundResponseTimes] = useState<number[]>([]);
  const [wrongClickLogs, setWrongClickLogs] = useState<GameStats['wrongClickLogs']>([]);

  // Persistent High Score
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('encok_renk_highscore');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Sound Mute State
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Interaction feedback states
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lastClickedSquareId, setLastClickedSquareId] = useState<number | null>(null);
  const [lastClickWasCorrect, setLastClickWasCorrect] = useState<boolean | null>(null);
  const [positiveToast, setPositiveToast] = useState<string | null>(null);
  const [showSoftRedFlash, setShowSoftRedFlash] = useState<boolean>(false);

  // Modals
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [showTests, setShowTests] = useState<boolean>(false);

  // Timing references
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartTimeRef = useRef<number>(0);
  const roundStartTimeRef = useRef<number>(0);
  const statusRef = useRef<GameStatus>('MENU');
  statusRef.current = status;

  // Safe sound mute toggling
  const handleToggleMute = useCallback(() => {
    const updated = soundManager.toggleMute();
    setIsMuted(updated);
  }, []);

  // Finish the game session
  const finishGame = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setStatus('FINISHED');
    setTimeLeft(0);
    setIsLocked(false);
    setPositiveToast(null);

    soundManager.playGameOver();

    // Check high score
    setScore((currentScore) => {
      const savedHigh = parseInt(localStorage.getItem('encok_renk_highscore') || '0', 10);
      if (currentScore > savedHigh) {
        localStorage.setItem('encok_renk_highscore', String(currentScore));
        setHighScore(currentScore);
        setIsNewHighScore(true);
      } else {
        setIsNewHighScore(false);
      }
      return currentScore;
    });
  }, []);

  // Timer loop based on real timestamp delta
  useEffect(() => {
    if (status === 'PLAYING') {
      sessionStartTimeRef.current = Date.now();

      timerIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - sessionStartTimeRef.current) / 1000;
        const remaining = Math.max(0, TOTAL_SESSION_SECONDS - elapsed);

        setTimeLeft(remaining);

        if (remaining <= 0) {
          finishGame();
        }
      }, 100);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [status, finishGame]);

  // Start fresh game session
  const handleStartGame = () => {
    // Generate initial 30 rounds
    const initialRounds = generateGameRounds(30);
    setRounds(initialRounds);
    setCurrentRoundIndex(0);

    // Reset stats
    setScore(0);
    setCorrectClicks(0);
    setWrongClicks(0);
    setCurrentStreak(0);
    setMaxStreak(0);
    setRoundResponseTimes([]);
    setWrongClickLogs([]);
    setIsNewHighScore(false);

    // Reset feedbacks
    setIsLocked(false);
    setLastClickedSquareId(null);
    setLastClickWasCorrect(null);
    setPositiveToast(null);
    setShowSoftRedFlash(false);

    // Start 80s countdown
    setTimeLeft(TOTAL_SESSION_SECONDS);
    sessionStartTimeRef.current = Date.now();
    roundStartTimeRef.current = Date.now();
    setStatus('PLAYING');
  };

  // Current active round
  const currentRound = rounds[currentRoundIndex] || null;

  // Handle clicking any square on the board
  const handleSquareClick = (square: RoundSquare, squareIndex: number) => {
    if (status !== 'PLAYING' || isLocked || !currentRound) return;

    const isCorrect = square.color === currentRound.winningColor;
    setLastClickedSquareId(square.id);
    setLastClickWasCorrect(isCorrect);

    if (isCorrect) {
      // 1. Play success audio
      soundManager.playSuccess();

      // 2. Compute response time for this completed round
      const elapsedRoundTime = (Date.now() - roundStartTimeRef.current) / 1000;
      setRoundResponseTimes((prev) => [...prev, elapsedRoundTime]);

      // 3. Update score and streak (earned once per round)
      setScore((s) => s + 1);
      setCorrectClicks((c) => c + 1);
      setCurrentStreak((curr) => {
        const next = curr + 1;
        setMaxStreak((max) => Math.max(max, next));
        return next;
      });

      // 4. Random child-friendly praise toast
      const randomPraise =
        POSITIVE_PRAISES[Math.floor(Math.random() * POSITIVE_PRAISES.length)];
      setPositiveToast(randomPraise);

      // 5. Lock input briefly to let child see visual success feedback (~380ms)
      setIsLocked(true);

      setTimeout(() => {
        // Only advance if game is still running
        if (statusRef.current === 'PLAYING') {
          // Check if we need to generate bonus round past round 30
          setRounds((prevRounds) => {
            if (currentRoundIndex + 1 >= prevRounds.length) {
              const recentWinners: GameColor[] = prevRounds.slice(-5).map((r) => r.winningColor);
              const bonusRound = generateRound(prevRounds.length + 1, recentWinners);
              return [...prevRounds, bonusRound];
            }
            return prevRounds;
          });

          setCurrentRoundIndex((idx) => idx + 1);
          roundStartTimeRef.current = Date.now();
          setLastClickedSquareId(null);
          setLastClickWasCorrect(null);
          setPositiveToast(null);
          setIsLocked(false);
        }
      }, 380);
    } else {
      // Wrong Click Behavior:
      // 1. Play gentle non-scary audio
      soundManager.playGentleError();

      // 2. Increment wrong clicks count and reset streak
      setWrongClicks((w) => w + 1);
      setCurrentStreak(0);

      // 3. Log the wrong click for analysis
      setWrongClickLogs((logs) => [
        ...logs,
        {
          roundNumber: currentRound.roundNumber,
          chosenColor: square.color,
          correctColor: currentRound.winningColor,
          squareIndex,
          timestamp: Date.now(),
        },
      ]);

      // 4. Gentle soft red screen overlay for 200ms
      setShowSoftRedFlash(true);
      setTimeout(() => {
        setShowSoftRedFlash(false);
      }, 200);

      // 5. Clear square highlight after 250ms so the child can try another square immediately on the same round!
      setTimeout(() => {
        setLastClickedSquareId(null);
        setLastClickWasCorrect(null);
      }, 250);
    }
  };

  // Quit to menu
  const handleQuitToMenu = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setStatus('MENU');
    setIsLocked(false);
    setPositiveToast(null);
  };

  // Compute final statistics
  const totalPicks = correctClicks + wrongClicks;
  const accuracy = totalPicks > 0 ? Math.round((correctClicks / totalPicks) * 100) : 0;
  const averageResponseTimeSec =
    roundResponseTimes.length > 0
      ? Number(
          (
            roundResponseTimes.reduce((acc, t) => acc + t, 0) /
            roundResponseTimes.length
          ).toFixed(1)
        )
      : 0;

  const gameStats: GameStats = {
    score,
    completedRounds: score,
    correctClicks,
    wrongClicks,
    accuracy,
    averageResponseTimeSec,
    maxStreak,
    currentStreak,
    roundResponseTimes,
    wrongClickLogs,
  };

  return (
    <div className="min-h-screen bg-[#EAEAEA] text-slate-800 flex flex-col relative overflow-x-hidden">
      {/* Gentle Red Overlay on Wrong Choice (150-250ms, unobtrusive, non-scary) */}
      <div
        className={`fixed inset-0 z-40 bg-rose-500/20 pointer-events-none transition-opacity duration-150 ${
          showSoftRedFlash ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Main App Navigation Header */}
      <Header
        status={status}
        timeLeft={timeLeft}
        score={score}
        currentRoundNumber={currentRound?.roundNumber || 1}
        stageName={currentRound?.stageName || ''}
        streak={currentStreak}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenTests={() => setShowTests(true)}
        onQuitToMenu={handleQuitToMenu}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-4xl mx-auto relative">
        {status === 'MENU' && (
          <StartScreen
            onStartGame={handleStartGame}
            highScore={highScore}
            onOpenHowToPlay={() => setShowHowToPlay(true)}
            onOpenTests={() => setShowTests(true)}
          />
        )}

        {status === 'PLAYING' && currentRound && (
          <div className="w-full flex flex-col items-center justify-center">
            {/* Top Round & Stage Indicator */}
            <div className="mb-3 sm:mb-4 flex flex-col items-center text-center">
              <span className="text-xs sm:text-sm font-bold text-slate-600 bg-white/60 px-3.5 py-1 rounded-full border border-slate-300/60 shadow-2xs">
                {currentRound.stageName}
              </span>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                Sayıca en çok olan renge tıkla!
              </p>
            </div>

            {/* Praise Toast Overlay */}
            <div className="h-7 sm:h-8 mb-2 flex items-center justify-center">
              {positiveToast ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-md animate-bounce">
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>{positiveToast}</span>
                </div>
              ) : null}
            </div>

            {/* Interactive Color Grid */}
            <SquareGrid
              squares={currentRound.squares}
              gridSize={currentRound.gridSize}
              winningColor={currentRound.winningColor}
              isLocked={isLocked}
              lastClickedSquareId={lastClickedSquareId}
              lastClickWasCorrect={lastClickWasCorrect}
              onSquareClick={handleSquareClick}
            />

            {/* Timer Progress Bar */}
            <div className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] mt-4">
              <div className="w-full bg-slate-300/80 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-100 ease-linear ${
                    timeLeft <= 10
                      ? 'bg-rose-500'
                      : timeLeft <= 30
                      ? 'bg-amber-500'
                      : 'bg-blue-600'
                  }`}
                  style={{
                    width: `${(timeLeft / TOTAL_SESSION_SECONDS) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mt-1 px-1">
                <span>Başlangıç</span>
                <span>80 sn Oturum</span>
                <span>Bitiş</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen Modal */}
        {status === 'FINISHED' && (
          <GameOverModal
            stats={gameStats}
            isNewHighScore={isNewHighScore}
            onPlayAgain={handleStartGame}
            onGoHome={() => setStatus('MENU')}
          />
        )}
      </main>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}

      {/* System & Rules Validation Test Modal */}
      {showTests && (
        <TestReportModal onClose={() => setShowTests(false)} />
      )}

      {/* Subtle Footer */}
      <footer className="w-full py-3 text-center text-xs text-slate-500 border-t border-slate-200/80 bg-white/40">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>En Çok Olan Rengi Bul! · İlkokul Eğitici Dikkat Oyunu</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHowToPlay(true)}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Yönerge
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setShowTests(true)}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Kural Kontrolleri
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
