import { GameColor, RoundData, RoundSquare } from '../types/game';

const ALL_COLORS: GameColor[] = ['blue', 'pinkRed', 'yellow'];

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates an integer partition of total into `parts` counts,
 * such that one part is strictly greater than all other parts,
 * and every part is at least minPerPart.
 */
function generateValidCounts(
  total: number,
  parts: 2 | 3,
  minPerPart: number = 1
): number[] {
  // Try up to 100 times to pick a random valid combination
  for (let attempt = 0; attempt < 100; attempt++) {
    if (parts === 2) {
      // Must sum to total, c1 > c2, c2 >= minPerPart
      const maxLowerBound = Math.floor(total / 2) + 1;
      const maxUpperBound = total - minPerPart;
      const c1 = Math.floor(Math.random() * (maxUpperBound - maxLowerBound + 1)) + maxLowerBound;
      const c2 = total - c1;
      if (c1 > c2 && c2 >= minPerPart) {
        return [c1, c2];
      }
    } else {
      // parts === 3
      // Total sum = total. Pick c1 such that c1 > c2 and c1 > c3
      // Minimum c1 must be at least Math.floor(total / 3) + 1
      const minC1 = Math.floor(total / 3) + 1;
      const maxC1 = total - (2 * minPerPart);
      const c1 = Math.floor(Math.random() * (maxC1 - minC1 + 1)) + minC1;
      const remainder = total - c1;

      // Now split remainder into c2, c3 such that c2 < c1 and c3 < c1 and both >= minPerPart
      // c2 min is minPerPart, c2 max is remainder - minPerPart
      const minC2 = Math.max(minPerPart, remainder - (c1 - 1));
      const maxC2 = Math.min(c1 - 1, remainder - minPerPart);

      if (minC2 <= maxC2) {
        const c2 = Math.floor(Math.random() * (maxC2 - minC2 + 1)) + minC2;
        const c3 = remainder - c2;
        if (c1 > c2 && c1 > c3 && c2 >= minPerPart && c3 >= minPerPart) {
          return [c1, c2, c3];
        }
      }
    }
  }

  // Safe fallback if random loop didn't find one
  if (parts === 2) {
    const c1 = Math.floor(total / 2) + 2;
    return [c1, total - c1];
  } else {
    if (total === 9) return [5, 3, 1];
    return [8, 5, 3];
  }
}

/**
 * Balances winning color assignment to ensure fair distribution across rounds.
 */
function pickWinningColor(
  candidateColors: GameColor[],
  recentWinners: GameColor[]
): GameColor {
  // If recent winners are available, favor least recently won color
  const counts: Record<GameColor, number> = { blue: 0, pinkRed: 0, yellow: 0 };
  const lastFive = recentWinners.slice(-5);
  lastFive.forEach((c) => counts[c]++);

  // Filter candidates and sort by fewest wins in recent rounds
  const sorted = [...candidateColors].sort((a, b) => {
    if (counts[a] !== counts[b]) return counts[a] - counts[b];
    return Math.random() - 0.5;
  });

  return sorted[0];
}

/**
 * Generates a single round strictly complying with the stage rules.
 */
export function generateRound(
  roundNumber: number,
  recentWinners: GameColor[] = []
): RoundData {
  let gridSize: 3 | 4;
  let totalSquares: 9 | 16;
  let activeColorsCount: 2 | 3;
  let stageName: string;

  if (roundNumber >= 1 && roundNumber <= 3) {
    gridSize = 3;
    totalSquares = 9;
    activeColorsCount = 2;
    stageName = 'Aşama 1: 3×3 · 2 Renk';
  } else if (roundNumber >= 4 && roundNumber <= 7) {
    gridSize = 3;
    totalSquares = 9;
    activeColorsCount = 3;
    stageName = 'Aşama 2: 3×3 · 3 Renk';
  } else if (roundNumber >= 8 && roundNumber <= 12) {
    gridSize = 4;
    totalSquares = 16;
    activeColorsCount = 2;
    stageName = 'Aşama 3: 4×4 · 2 Renk';
  } else {
    // 13-30 and subsequent continuous bonus rounds
    gridSize = 4;
    totalSquares = 16;
    activeColorsCount = 3;
    stageName = roundNumber <= 30 ? 'Aşama 4: 4×4 · 3 Renk' : 'Bonus Tur: 4×4 · Hızlı Karar';
  }

  // Select which colors participate
  let activeColors: GameColor[];
  if (activeColorsCount === 2) {
    // Pick 2 random distinct colors from ALL_COLORS
    const shuffled = shuffleArray(ALL_COLORS);
    activeColors = [shuffled[0], shuffled[1]];
  } else {
    activeColors = [...ALL_COLORS];
  }

  // Pick winning color with balance
  const winningColor = pickWinningColor(activeColors, recentWinners);
  const otherColors = activeColors.filter((c) => c !== winningColor);

  // Generate counts strictly satisfying totalSquares & single maximum
  const counts = generateValidCounts(totalSquares, activeColorsCount, 1);
  // counts[0] is the maximum count
  const winningCount = counts[0];
  const otherCounts = counts.slice(1);

  // Map counts to colors
  const colorCounts: Record<GameColor, number> = {
    blue: 0,
    pinkRed: 0,
    yellow: 0,
  };

  colorCounts[winningColor] = winningCount;
  // Shuffle other counts to prevent predictable second/third order
  const shuffledOtherCounts = shuffleArray(otherCounts);
  otherColors.forEach((color, idx) => {
    colorCounts[color] = shuffledOtherCounts[idx];
  });

  // Build the flat list of squares
  const rawSquares: RoundSquare[] = [];
  let squareId = 0;

  activeColors.forEach((color) => {
    const count = colorCounts[color];
    for (let i = 0; i < count; i++) {
      rawSquares.push({
        id: squareId++,
        color,
      });
    }
  });

  // Shuffle the square positions thoroughly
  const shuffledSquares = shuffleArray(rawSquares);

  // Re-verify counts from actual shuffled squares array
  const verifiedCounts: Record<GameColor, number> = {
    blue: 0,
    pinkRed: 0,
    yellow: 0,
  };
  shuffledSquares.forEach((sq) => {
    verifiedCounts[sq.color]++;
  });

  // Calculate actual winner from the verified array
  let maxCount = -1;
  let actualWinner: GameColor = winningColor;
  let isTie = false;

  (Object.keys(verifiedCounts) as GameColor[]).forEach((color) => {
    const c = verifiedCounts[color];
    if (c > maxCount) {
      maxCount = c;
      actualWinner = color;
      isTie = false;
    } else if (c === maxCount && c > 0) {
      isTie = true;
    }
  });

  // If there's any tie (mathematically prevented above, but defensive guard)
  if (isTie || maxCount !== winningCount || actualWinner !== winningColor) {
    // Fallback: fix one square to guarantee unique winner
    console.warn('Re-rolling round to maintain strict invariant');
    return generateRound(roundNumber, recentWinners);
  }

  return {
    roundNumber,
    gridSize,
    totalSquares,
    activeColors,
    squares: shuffledSquares,
    colorCounts: verifiedCounts,
    winningColor: actualWinner,
    winningCount: maxCount,
    stageName,
  };
}

/**
 * Pre-generates the initial 30 rounds for a game session,
 * guaranteeing consistent progression and balanced colors.
 */
export function generateGameRounds(count: number = 30): RoundData[] {
  const rounds: RoundData[] = [];
  const recentWinners: GameColor[] = [];

  for (let r = 1; r <= count; r++) {
    const round = generateRound(r, recentWinners);
    rounds.push(round);
    recentWinners.push(round.winningColor);
  }

  return rounds;
}
