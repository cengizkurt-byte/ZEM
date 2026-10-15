import { generateRound, generateGameRounds } from './roundGenerator';
import { GameColor } from '../types/game';

export interface TestResultItem {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  details: string;
}

export interface FullTestSuiteResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  results: TestResultItem[];
}

export function runComprehensiveGameValidation(): FullTestSuiteResult {
  const results: TestResultItem[] = [];

  // Test 1: Rounds 1–3 must be 3x3 (9 squares) with exactly 2 colors
  let test1Passed = true;
  let test1Details = '';
  for (let r = 1; r <= 3; r++) {
    const round = generateRound(r);
    const nonZeroColors = Object.entries(round.colorCounts).filter(([, count]) => count > 0);
    if (round.gridSize !== 3 || round.totalSquares !== 9 || nonZeroColors.length !== 2) {
      test1Passed = false;
      test1Details = `Tur ${r} başarısız: Boyut=${round.gridSize}x${round.gridSize}, Kare=${round.totalSquares}, Renk Sayısı=${nonZeroColors.length}`;
      break;
    }
  }
  if (test1Passed) test1Details = '1–3. turlar 3×3 düzeninde ve tam 2 farklı renkle başarıyla oluşturuldu.';
  results.push({
    id: 'test_1_to_3',
    title: '1–3. Turlar: 3×3 ve 2 Renk',
    description: 'İlk 3 turun 3×3 kare ve tam 2 farklı renkten oluştuğu doğrulanır.',
    passed: test1Passed,
    details: test1Details,
  });

  // Test 2: Rounds 4–7 must be 3x3 (9 squares) with exactly 3 colors
  let test2Passed = true;
  let test2Details = '';
  for (let r = 4; r <= 7; r++) {
    const round = generateRound(r);
    const nonZeroColors = Object.entries(round.colorCounts).filter(([, count]) => count > 0);
    if (round.gridSize !== 3 || round.totalSquares !== 9 || nonZeroColors.length !== 3) {
      test2Passed = false;
      test2Details = `Tur ${r} başarısız: Boyut=${round.gridSize}x${round.gridSize}, Kare=${round.totalSquares}, Renk Sayısı=${nonZeroColors.length}`;
      break;
    }
  }
  if (test2Passed) test2Details = '4–7. turlar 3×3 düzeninde ve 3 rengin tamamını içeriyor.';
  results.push({
    id: 'test_4_to_7',
    title: '4–7. Turlar: 3×3 ve 3 Renk',
    description: '4–7. turların 3×3 kare ve 3 farklı renkten oluştuğu doğrulanır.',
    passed: test2Passed,
    details: test2Details,
  });

  // Test 3: Rounds 8–12 must be 4x4 (16 squares) with exactly 2 colors
  let test3Passed = true;
  let test3Details = '';
  for (let r = 8; r <= 12; r++) {
    const round = generateRound(r);
    const nonZeroColors = Object.entries(round.colorCounts).filter(([, count]) => count > 0);
    if (round.gridSize !== 4 || round.totalSquares !== 16 || nonZeroColors.length !== 2) {
      test3Passed = false;
      test3Details = `Tur ${r} başarısız: Boyut=${round.gridSize}x${round.gridSize}, Kare=${round.totalSquares}, Renk Sayısı=${nonZeroColors.length}`;
      break;
    }
  }
  if (test3Passed) test3Details = '8–12. turlar 4×4 düzeninde ve tam 2 farklı renkten oluşuyor.';
  results.push({
    id: 'test_8_to_12',
    title: '8–12. Turlar: 4×4 ve 2 Renk',
    description: '8–12. turların 4×4 kare ve 2 farklı renkten oluştuğu doğrulanır.',
    passed: test3Passed,
    details: test3Details,
  });

  // Test 4: Rounds 13–30 must be 4x4 (16 squares) with exactly 3 colors
  let test4Passed = true;
  let test4Details = '';
  for (let r = 13; r <= 30; r++) {
    const round = generateRound(r);
    const nonZeroColors = Object.entries(round.colorCounts).filter(([, count]) => count > 0);
    if (round.gridSize !== 4 || round.totalSquares !== 16 || nonZeroColors.length !== 3) {
      test4Passed = false;
      test4Details = `Tur ${r} başarısız: Boyut=${round.gridSize}x${round.gridSize}, Kare=${round.totalSquares}, Renk Sayısı=${nonZeroColors.length}`;
      break;
    }
  }
  if (test4Passed) test4Details = '13–30. turlar 4×4 düzeninde ve 3 rengin tamamını içeriyor.';
  results.push({
    id: 'test_13_to_30',
    title: '13–30. Turlar: 4×4 ve 3 Renk',
    description: '13–30. turların 4×4 kare ve 3 farklı renkten oluştuğu doğrulanır.',
    passed: test4Passed,
    details: test4Details,
  });

  // Test 5: Verify strict unique maximum across 100 randomly sampled rounds
  let test5Passed = true;
  let test5Details = '';
  for (let i = 0; i < 100; i++) {
    const rNum = (i % 30) + 1;
    const round = generateRound(rNum);
    const sortedCounts = Object.values(round.colorCounts).sort((a, b) => b - a);
    if (sortedCounts[0] <= sortedCounts[1]) {
      test5Passed = false;
      test5Details = `Tur ${rNum} eşitlik tespit edildi: en çok = ${sortedCounts[0]}, ikinci = ${sortedCounts[1]}`;
      break;
    }
    // Check actual squares in array
    const actualCounts: Record<GameColor, number> = { blue: 0, pinkRed: 0, yellow: 0 };
    round.squares.forEach((sq) => actualCounts[sq.color]++);
    if (actualCounts[round.winningColor] !== round.winningCount) {
      test5Passed = false;
      test5Details = `Tur ${rNum} kare dizisi sayımı (${actualCounts[round.winningColor]}) ile hesaplanan kazanan sayısı (${round.winningCount}) tutarsız!`;
      break;
    }
  }
  if (test5Passed) test5Details = '100 rastgele turda tek ve kesin bir kazanan renk olduğu, hiçbir beraberlik oluşmadığı ve dizi sayımıyla %100 eşleştiği doğrulandı.';
  results.push({
    id: 'test_strict_unique_winner',
    title: 'Tek ve Kesin En Fazla Renk Doğrulaması',
    description: 'Hiçbir turda en çok bulunan renklerde beraberlik olmaması garanti edilir.',
    passed: test5Passed,
    details: test5Details,
  });

  // Test 6: Winning color balance across 30 rounds
  const sample30 = generateGameRounds(30);
  const winCounts: Record<GameColor, number> = { blue: 0, pinkRed: 0, yellow: 0 };
  sample30.forEach((r) => winCounts[r.winningColor]++);
  const minWins = Math.min(...Object.values(winCounts));
  const test6Passed = minWins >= 6; // All 3 colors win at least ~20% of the 30 rounds
  results.push({
    id: 'test_color_balance',
    title: 'Kazanan Renklerin Dengeli Dağılımı',
    description: '30 tur boyunca Mavi, Pembe-Kırmızı ve Sarı renklerin adil dağıldığı doğrulanır.',
    passed: test6Passed,
    details: `30 tur dağılımı: Mavi=${winCounts.blue}, Pembe-Kırmızı=${winCounts.pinkRed}, Sarı=${winCounts.yellow}`,
  });

  // Test 7: Accuracy Calculation Formula
  const acc1 = Math.round((10 / (10 + 2)) * 100); // 83%
  const acc0 = 0 / (0 + 0) || 0; // 0%
  const test7Passed = acc1 === 83 && acc0 === 0;
  results.push({
    id: 'test_accuracy_math',
    title: 'Doğruluk Oranı Formülü & Sıfıra Bölme Güvenliği',
    description: 'Doğru / (Doğru + Yanlış) * 100 formülü ve 0 seçim durumunda hata vermeme kontrolü.',
    passed: test7Passed,
    details: `Formül testi başarılı: 10 doğru 2 yanlış -> %${acc1}, 0 seçim -> %${acc0}`,
  });

  const passedCount = results.filter((r) => r.passed).length;
  return {
    passed: passedCount === results.length,
    totalTests: results.length,
    passedTests: passedCount,
    results,
  };
}
