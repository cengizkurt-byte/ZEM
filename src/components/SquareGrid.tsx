import React from 'react';
import { GameColor, GAME_COLORS, RoundSquare } from '../types/game';

interface SquareGridProps {
  squares: RoundSquare[];
  gridSize: 3 | 4;
  winningColor: GameColor;
  isLocked: boolean; // Locked briefly during transition to next round (approx 350ms)
  lastClickedSquareId: number | null;
  lastClickWasCorrect: boolean | null;
  onSquareClick: (square: RoundSquare, index: number) => void;
}

export const SquareGrid: React.FC<SquareGridProps> = ({
  squares,
  gridSize,
  isLocked,
  lastClickedSquareId,
  lastClickWasCorrect,
  onSquareClick,
}) => {
  const is3x3 = gridSize === 3;

  return (
    <div className="w-full flex flex-col items-center justify-center select-none">
      {/* Centered Board Card with tight padding and clean minimalist frame */}
      <div
        className="w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] p-2.5 sm:p-3.5 bg-white rounded-2xl border border-slate-300/80 shadow-xs transition-all"
      >
        <div
          className={`grid ${
            is3x3
              ? 'grid-cols-3 gap-1.5 sm:gap-2'
              : 'grid-cols-4 gap-1 sm:gap-1.5'
          }`}
          role="grid"
          aria-label={`${gridSize} çarpı ${gridSize} Renkli Kareler`}
        >
          {squares.map((sq, index) => {
            const colorDef = GAME_COLORS[sq.color];
            const isThisClicked = lastClickedSquareId === sq.id;
            const isSuccess = isThisClicked && lastClickWasCorrect === true;
            const isError = isThisClicked && lastClickWasCorrect === false;

            return (
              <button
                key={`${sq.id}-${index}`}
                type="button"
                disabled={isLocked}
                onClick={() => onSquareClick(sq, index)}
                aria-label={`${index + 1}. Kare, Renk: ${colorDef.nameTr}`}
                className={`
                  aspect-square w-full
                  ${is3x3 ? 'rounded-xl sm:rounded-2xl' : 'rounded-lg sm:rounded-xl'}
                  ${colorDef.bgClass}
                  transition-all duration-100 cursor-pointer
                  hover:opacity-90 active:scale-[0.97]
                  focus:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-700
                  disabled:cursor-default
                  ${
                    isSuccess
                      ? 'ring-4 ring-emerald-400 scale-[1.02] z-10'
                      : ''
                  }
                  ${
                    isError
                      ? 'animate-shake ring-4 ring-rose-400 z-10'
                      : ''
                  }
                `}
                style={{
                  minHeight: is3x3 ? '84px' : '64px',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
