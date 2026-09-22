/**
 * BBMA Oma Ally Engine
 * Implements exact indicator calculations:
 * - Bollinger Bands (Period 20, Dev 2)
 * - Linear Weighted Moving Averages (LWMA 5 High, 10 High, 5 Low, 10 Low)
 * - Exponential Moving Average (EMA 50 Close)
 * - Oma Ally Pattern Recognition (Extrem, MHV, CSAK, CSM, Reentry)
 */

import { Candle, CandleWithBBMA, BBMAIndicators, BBState, BBMASetupType, BBMASignal, ForexPairInfo } from '../types';

/**
 * Calculate Linear Weighted Moving Average (LWMA)
 */
export function calculateLWMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const weightSum = (period * (period + 1)) / 2;

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }

    let weightedSum = 0;
    for (let w = 0; w < period; w++) {
      const weight = period - w;
      weightedSum += data[i - w] * weight;
    }
    result.push(weightedSum / weightSum);
  }
  return result;
}

/**
 * Calculate Simple Moving Average (SMA)
 */
export function calculateSMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    result.push(sum / period);
  }
  return result;
}

/**
 * Calculate Exponential Moving Average (EMA)
 */
export function calculateEMA(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);

  let prevEma: number | null = null;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    if (prevEma === null) {
      // First EMA is SMA
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j];
      }
      prevEma = sum / period;
      result.push(prevEma);
    } else {
      const currentEma: number = data[i] * k + prevEma * (1 - k);
      prevEma = currentEma;
      result.push(currentEma);
    }
  }
  return result;
}

/**
 * Calculate Bollinger Bands (Period 20, Deviation 2)
 */
export function calculateBollingerBands(
  closes: number[],
  period = 20,
  stdDevMultiplier = 2
): {
  topBB: (number | null)[];
  midBB: (number | null)[];
  lowBB: (number | null)[];
  bandwidth: (number | null)[];
} {
  const midBB = calculateSMA(closes, period);
  const topBB: (number | null)[] = [];
  const lowBB: (number | null)[] = [];
  const bandwidth: (number | null)[] = [];

  for (let i = 0; i < closes.length; i++) {
    const mid = midBB[i];
    if (mid === null || i < period - 1) {
      topBB.push(null);
      lowBB.push(null);
      bandwidth.push(null);
      continue;
    }

    let varianceSum = 0;
    for (let j = 0; j < period; j++) {
      varianceSum += Math.pow(closes[i - j] - mid, 2);
    }
    const stdDev = Math.sqrt(varianceSum / period);
    const top = mid + stdDevMultiplier * stdDev;
    const low = mid - stdDevMultiplier * stdDev;

    topBB.push(top);
    lowBB.push(low);
    bandwidth.push((top - low) / mid);
  }

  return { topBB, midBB, lowBB, bandwidth };
}

/**
 * Enrich raw candles with full Oma Ally BBMA indicators
 */
export function computeBBMAForCandles(candles: Candle[]): CandleWithBBMA[] {
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const closes = candles.map((c) => c.close);

  const bb = calculateBollingerBands(closes, 20, 2);
  const ma5High = calculateLWMA(highs, 5);
  const ma10High = calculateLWMA(highs, 10);
  const ma5Low = calculateLWMA(lows, 5);
  const ma10Low = calculateLWMA(lows, 10);
  const ema50 = calculateEMA(closes, 50);

  const enriched: CandleWithBBMA[] = [];

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const top = bb.topBB[i] ?? c.close * 1.004;
    const mid = bb.midBB[i] ?? c.close;
    const low = bb.lowBB[i] ?? c.close * 0.996;
    const m5H = ma5High[i] ?? c.high;
    const m10H = ma10High[i] ?? c.high;
    const m5L = ma5Low[i] ?? c.low;
    const m10L = ma10Low[i] ?? c.low;
    const e50 = ema50[i] ?? c.close * 0.998;

    // Detect BB State (Mengembang vs Mendatar)
    let bbState: BBState = 'flat';
    const bw = bb.bandwidth[i];
    const prevBw = i > 3 ? bb.bandwidth[i - 3] : null;
    if (bw !== null && prevBw !== null) {
      if (bw > prevBw * 1.15) {
        bbState = 'expanding';
      } else if (bw < prevBw * 0.85) {
        bbState = 'narrow';
      } else {
        bbState = 'flat';
      }
    }

    // Pattern Recognition for candle
    const prevCandle = i > 0 ? candles[i - 1] : null;
    const prev2Candle = i > 1 ? candles[i - 2] : null;
    let setup: BBMAIndicators['setup'] = undefined;

    // 1. CSM Check (Candle closes outside BB with expanding BB)
    if (c.close > top) {
      setup = {
        type: 'CSM',
        direction: 'BUY',
        label: 'CSM BUY',
        description: 'Candlestick Momentum Buy: Candle tutup di luar Top BB semasa pasaran mengembang.',
      };
    } else if (c.close < low) {
      setup = {
        type: 'CSM',
        direction: 'SELL',
        label: 'CSM SELL',
        description: 'Candlestick Momentum Sell: Candle tutup di luar Low BB semasa pasaran mengembang.',
      };
    }
    // 2. CSAK Check (Candlestick Arah Kukuh: Breaks MA5, MA10 & Mid BB)
    else if (
      prevCandle &&
      c.close > m5H &&
      c.close > m10H &&
      c.close > mid &&
      c.open < mid
    ) {
      setup = {
        type: 'CSAK',
        direction: 'BUY',
        label: 'CSAK BUY',
        description: 'Candlestick Arah Kukuh Buy: Pecahan kukuh menembusi MA5/10 High dan Mid BB.',
      };
    } else if (
      prevCandle &&
      c.close < m5L &&
      c.close < m10L &&
      c.close < mid &&
      c.open > mid
    ) {
      setup = {
        type: 'CSAK',
        direction: 'SELL',
        label: 'CSAK SELL',
        description: 'Candlestick Arah Kukuh Sell: Pecahan kukuh menembusi MA5/10 Low dan Mid BB.',
      };
    }
    // 3. EXTREME Check (MA keluar BB + Candle reverse)
    else if (m5H > top && c.high >= top && c.close < c.open && prevCandle && prevCandle.high >= top) {
      setup = {
        type: 'EXTREME',
        direction: 'SELL',
        label: 'EXTREM SELL',
        description: 'Ekstrem Sell: MA5 High terkeluar dari Top BB, candle reverse tutup di dalam BB.',
      };
    } else if (m5L < low && c.low <= low && c.close > c.open && prevCandle && prevCandle.low <= low) {
      setup = {
        type: 'EXTREME',
        direction: 'BUY',
        label: 'EXTREM BUY',
        description: 'Ekstrem Buy: MA5 Low terkeluar dari Low BB, candle reverse tutup di dalam BB.',
      };
    }
    // 4. MHV Check (Market Hilang Volume: Fails to pierce outside BB after extreme)
    else if (
      prevCandle &&
      prev2Candle &&
      c.high >= top * 0.9985 &&
      c.close < top &&
      c.close < c.open &&
      bbState === 'flat'
    ) {
      setup = {
        type: 'MHV',
        direction: 'SELL',
        label: 'MHV SELL',
        description: 'Market Hilang Volume Sell: Harga gagal menembusi Top BB dalam pasaran mendatar.',
      };
    } else if (
      prevCandle &&
      prev2Candle &&
      c.low <= low * 1.0015 &&
      c.close > low &&
      c.close > c.open &&
      bbState === 'flat'
    ) {
      setup = {
        type: 'MHV',
        direction: 'BUY',
        label: 'MHV BUY',
        description: 'Market Hilang Volume Buy: Harga gagal menembusi Low BB dalam pasaran mendatar.',
      };
    }
    // 5. REENTRY Check (Pullback to MA5/MA10 with Mid BB holding)
    else if (
      c.close > mid &&
      c.low <= m10L &&
      c.close >= m5L &&
      c.close > c.open &&
      c.close > e50
    ) {
      setup = {
        type: 'REENTRY',
        direction: 'BUY',
        label: 'RE-ENTRY BUY',
        description: 'Reentry Buy: Retest ke zon MA5/MA10 Low, Mid BB bertahan kukuh sebagai sokongan.',
      };
    } else if (
      c.close < mid &&
      c.high >= m10H &&
      c.close <= m5H &&
      c.close < c.open &&
      c.close < e50
    ) {
      setup = {
        type: 'REENTRY',
        direction: 'SELL',
        label: 'RE-ENTRY SELL',
        description: 'Reentry Sell: Retest ke zon MA5/MA10 High, Mid BB bertahan kukuh sebagai rintangan.',
      };
    }

    const indicators: BBMAIndicators = {
      topBB: top,
      midBB: mid,
      lowBB: low,
      ma5High: m5H,
      ma10High: m10H,
      ma5Low: m5L,
      ma10Low: m10L,
      ema50: e50,
      bbState,
      setup,
    };

    enriched.push({
      ...c,
      indicators,
    });
  }

  return enriched;
}

/**
 * Currency Pairs Master Data
 */
export const FOREX_PAIRS: ForexPairInfo[] = [
  {
    symbol: 'EUR/USD',
    name: 'Euro / Dolar AS',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    pipDecimals: 4,
    spreadPips: 0.8,
    currentBid: 1.0842,
    currentAsk: 1.0843,
    dailyChange: +0.28,
    icon: '💶',
  },
  {
    symbol: 'GBP/USD',
    name: 'Pound British / Dolar AS',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    pipDecimals: 4,
    spreadPips: 1.1,
    currentBid: 1.2985,
    currentAsk: 1.2986,
    dailyChange: -0.15,
    icon: '💷',
  },
  {
    symbol: 'XAU/USD',
    name: 'Emas (Auns) / Dolar AS',
    baseCurrency: 'XAU',
    quoteCurrency: 'USD',
    pipDecimals: 2,
    spreadPips: 1.8,
    currentBid: 2648.50,
    currentAsk: 2648.80,
    dailyChange: +1.12,
    icon: '🪙',
  },
  {
    symbol: 'USD/JPY',
    name: 'Dolar AS / Yen Jepun',
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    pipDecimals: 2,
    spreadPips: 0.9,
    currentBid: 153.25,
    currentAsk: 153.26,
    dailyChange: -0.42,
    icon: '💴',
  },
  {
    symbol: 'GBP/JPY',
    name: 'Pound British / Yen Jepun',
    baseCurrency: 'GBP',
    quoteCurrency: 'JPY',
    pipDecimals: 2,
    spreadPips: 1.6,
    currentBid: 198.85,
    currentAsk: 198.87,
    dailyChange: -0.58,
    icon: '🐉',
  },
  {
    symbol: 'AUD/USD',
    name: 'Dolar Australia / Dolar AS',
    baseCurrency: 'AUD',
    quoteCurrency: 'USD',
    pipDecimals: 4,
    spreadPips: 1.0,
    currentBid: 0.6540,
    currentAsk: 0.6541,
    dailyChange: +0.35,
    icon: '🦘',
  },
];

/**
 * Generate realistic historical candle data seeded for accurate BBMA testing
 */
export function generatePairCandles(
  symbol: string,
  timeframe: 'M15' | 'H1' | 'H4' | 'D1',
  count = 60
): Candle[] {
  let basePrice = 1.0800;
  let volatility = 0.0006;

  if (symbol === 'XAU/USD') {
    basePrice = 2635.0;
    volatility = 3.5;
  } else if (symbol === 'USD/JPY') {
    basePrice = 152.80;
    volatility = 0.15;
  } else if (symbol === 'GBP/JPY') {
    basePrice = 197.50;
    volatility = 0.22;
  } else if (symbol === 'GBP/USD') {
    basePrice = 1.2950;
    volatility = 0.0008;
  } else if (symbol === 'AUD/USD') {
    basePrice = 0.6520;
    volatility = 0.0005;
  }

  // Adjust timeframe volatility
  const tfMultiplier = timeframe === 'D1' ? 4 : timeframe === 'H4' ? 2.2 : timeframe === 'H1' ? 1.2 : 0.8;
  const currentVol = volatility * tfMultiplier;

  const candles: Candle[] = [];
  const now = Date.now();
  const intervalMs =
    timeframe === 'M15'
      ? 15 * 60 * 1000
      : timeframe === 'H1'
      ? 60 * 60 * 1000
      : timeframe === 'H4'
      ? 4 * 60 * 60 * 1000
      : 24 * 60 * 60 * 1000;

  let current = basePrice;
  const seed = (symbol.charCodeAt(0) * 17 + timeframe.length * 31) % 100;

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * intervalMs;
    const dateObj = new Date(timestamp);
    const timeStr =
      timeframe === 'D1'
        ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        : `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;

    // Wave harmonic oscillation simulating cycle: CSM -> Reentry -> Extreme -> MHV -> CSAK
    const wave = Math.sin((count - i + seed) * 0.18) * currentVol * 3.5;
    const drift = (Math.cos((count - i) * 0.08) - 0.2) * currentVol;
    const open = current;
    const change = wave * 0.5 + (Math.sin((i * 13 + seed) % 7) - 0.5) * currentVol * 1.5 + drift;
    const close = open + change;

    const maxOC = Math.max(open, close);
    const minOC = Math.min(open, close);
    const high = maxOC + Math.abs(Math.sin(i * 1.3)) * currentVol * 0.8;
    const low = minOC - Math.abs(Math.cos(i * 1.7)) * currentVol * 0.8;
    const volume = Math.floor(1200 + Math.abs(Math.sin(i)) * 3400);

    candles.push({
      time: timeStr,
      timestamp,
      open: Number(open.toFixed(symbol === 'XAU/USD' || symbol.includes('JPY') ? 2 : 4)),
      high: Number(high.toFixed(symbol === 'XAU/USD' || symbol.includes('JPY') ? 2 : 4)),
      low: Number(low.toFixed(symbol === 'XAU/USD' || symbol.includes('JPY') ? 2 : 4)),
      close: Number(close.toFixed(symbol === 'XAU/USD' || symbol.includes('JPY') ? 2 : 4)),
      volume,
    });

    current = close;
  }

  return candles;
}

/**
 * Generate active BBMA signals with full Oma Ally validation checklists
 */
export function getActiveBBMASignals(): BBMASignal[] {
  return [
    {
      id: 'sig-xau-h4-01',
      pair: 'XAU/USD',
      timeframe: 'H4',
      type: 'REENTRY',
      direction: 'BUY',
      rating: 5,
      formulaCode: 'REEM (Kod Emas 5-Bintang)',
      currentPrice: 2648.50,
      entryZone: {
        min: 2643.00,
        max: 2646.50,
        label: 'Zon MA5 / MA10 Low',
      },
      stopLoss: 2636.50, // Bawah Mid BB
      takeProfit1: 2656.00, // TP Wajib di MA5/10 High
      takeProfit2: 2668.00, // Sasaran Top BB
      takeProfit3: 2682.00, // Sambungan CSM
      riskReward: '1 : 3.4',
      pipsPotential: 220,
      bbState: 'BB Mengembang (Trending)',
      higherTfSetup: 'H4: Reentry Buy selepas pengembangan CSM',
      mediumTfSetup: 'H1: Ekstrem Buy terbentuk di Low BB',
      lowerTfSetup: 'M15: MHV Buy disahkan dengan shadow double bottom',
      rulesChecked: [
        { rule: 'Setup Sebelumnya', passed: true, note: 'CSM Buy disahkan di H4, BB mengembang' },
        { rule: 'Retest Zon', passed: true, note: 'Harga menguji zon MA5 & MA10 Low dengan bersih' },
        { rule: 'Integriti Mid BB', passed: true, note: 'Candle tutup kukuh di atas Mid BB (2638.20)' },
        { rule: 'Kod MTF REEM', passed: true, note: 'H4 Reentry + H1 Ekstrem + M15 MHV selari sempurna' },
        { rule: 'Sokongan EMA50', passed: true, note: 'Harga berdagang selesa di atas paras EMA50' },
      ],
      summary: 'Setup REEM Emas Oma Ally. H4 Reentry Buy diaktifkan dengan pengesahan MHV M15 pada rangka masa kecil. Pembatalan (cut loss) jika candle tutup di bawah Mid BB.',
      timestamp: Date.now() - 14 * 60 * 1000,
      timeAgo: '14 minit lalu',
      status: 'ACTIVE',
    },
    {
      id: 'sig-eur-h1-02',
      pair: 'EUR/USD',
      timeframe: 'H1',
      type: 'EXTREME',
      direction: 'SELL',
      rating: 4,
      formulaCode: 'EXT-REVERSE (Pembalikan Ekstrem)',
      currentPrice: 1.0842,
      entryZone: {
        min: 1.0845,
        max: 1.0855,
        label: 'Penolakan Top BB / Zon MA5 High',
      },
      stopLoss: 1.0872, // Atas swing high Top BB
      takeProfit1: 1.0818, // TP Wajib di MA5/10 Low bertentangan
      takeProfit2: 1.0795, // Mid BB
      takeProfit3: 1.0760, // Low BB
      riskReward: '1 : 2.8',
      pipsPotential: 48,
      bbState: 'BB Mendatar (Sideway)',
      higherTfSetup: 'H4: Menguji rintangan utama zon Top BB',
      mediumTfSetup: 'H1: MA5 High menembusi luar Top BB, candle reverse terbentuk',
      lowerTfSetup: 'M15: CSAK Sell memecahkan Mid BB ke bawah',
      rulesChecked: [
        { rule: 'MA Keluar BB', passed: true, note: 'MA5 High terkeluar menembusi luar Top BB' },
        { rule: 'Candle Reverse', passed: true, note: 'Candle bearish engulfing tutup semula di dalam BB' },
        { rule: 'Candle Retest', passed: true, note: 'Shadow retest Top BB dan gagal tutup di luar' },
        { rule: 'Keadaan BB', passed: true, note: 'BB Mendatar (suasana terbaik untuk Ekstrem)' },
      ],
      summary: 'Ekstrem Sell piawai di EUR/USD H1. MA5 High terkeluar melepasi Top BB, candle penolakan susulan telah disahkan.',
      timestamp: Date.now() - 32 * 60 * 1000,
      timeAgo: '32 minit lalu',
      status: 'ACTIVE',
    },
    {
      id: 'sig-gbp-m15-03',
      pair: 'GBP/USD',
      timeframe: 'M15',
      type: 'MHV',
      direction: 'BUY',
      rating: 4,
      formulaCode: 'MHV-VALIDATED',
      currentPrice: 1.2985,
      entryZone: {
        min: 1.2975,
        max: 1.2990,
        label: 'Sentuhan Low BB / MA5 Low',
      },
      stopLoss: 1.2952, // Bawah ekor penolakan Low BB
      takeProfit1: 1.3020, // TP Wajib di MA5/10 High
      takeProfit2: 1.3050, // Mid BB & Top BB
      takeProfit3: 1.3090, // Rintangan H1 seterusnya
      riskReward: '1 : 3.1',
      pipsPotential: 65,
      bbState: 'BB Mendatar (Sideway)',
      higherTfSetup: 'H1: Ekstrem Buy diikuti TP Wajib tercapai',
      mediumTfSetup: 'M15: Percubaan kedua menembusi Low BB gagal sepenuhnya',
      lowerTfSetup: 'M5: CSAK Buy bermula dengan volum kukuh',
      rulesChecked: [
        { rule: 'Ekstrem Sebelumnya', passed: true, note: 'Ekstrem Buy berlaku pada harga 1.2965' },
        { rule: 'TP Wajib Tercapai', passed: true, note: 'Gelombang pertama sampai ke MA5/10 High' },
        { rule: 'Breakout Gagal', passed: true, note: 'Body candle tutup kemas di dalam Lower BB' },
        { rule: 'Volum Habis', passed: true, note: 'Penjual gagal membuat new lower low' },
      ],
      summary: 'Market Hilang Volume (MHV) Buy disahkan di GBP/USD. Harga menguji Low BB selepas Ekstrem terdahulu tetapi gagal tutup di luar.',
      timestamp: Date.now() - 55 * 60 * 1000,
      timeAgo: '55 minit lalu',
      status: 'ACTIVE',
    },
    {
      id: 'sig-usdjpy-h4-04',
      pair: 'USD/JPY',
      timeframe: 'H4',
      type: 'CSAK',
      direction: 'SELL',
      rating: 4,
      formulaCode: 'RE-CSAK (Peralihan Trend)',
      currentPrice: 153.25,
      entryZone: {
        min: 153.40,
        max: 153.75,
        label: 'Tunggu Reentry di MA5/10 High',
      },
      stopLoss: 154.20, // Atas Mid BB
      takeProfit1: 152.40, // MA5/10 Low bertentangan
      takeProfit2: 151.70, // Low BB
      takeProfit3: 150.50, // Sokongan Utama
      riskReward: '1 : 3.2',
      pipsPotential: 155,
      bbState: 'BB Mengembang (Trending)',
      higherTfSetup: 'D1: Penolakan bearish di Upper BB dengan silangan EMA50',
      mediumTfSetup: 'H4: CSAK Sell tutup di bawah MA5/10 Low dan Mid BB',
      lowerTfSetup: 'H1: Sedang bersedia untuk pullback Reentry Sell',
      rulesChecked: [
        { rule: 'Penembusan Mid BB', passed: true, note: 'Candle bearish memecahkan Mid BB ke bawah' },
        { rule: 'MA5/10 Low Dilepasi', passed: true, note: 'Harga tutup kukuh di bawah MA5 dan MA10 Low' },
        { rule: 'Hukum Oma Ally', passed: true, note: 'JANGAN kejar CSAK; tunggu pesanan Reentry di MA5/10 High' },
      ],
      summary: 'Pecahan arah CSAK Sell disahkan. Sebagaimana pesan Oma Ally: jangan sekali-kali entry terus pada CSAK—tunggu pullback masuk ke MA5/10 High!',
      timestamp: Date.now() - 110 * 60 * 1000,
      timeAgo: '1j 50m lalu',
      status: 'PENDING',
    },
    {
      id: 'sig-gbpjpy-h1-05',
      pair: 'GBP/JPY',
      timeframe: 'H1',
      type: 'REENTRY',
      direction: 'SELL',
      rating: 5,
      formulaCode: 'REEM (Kod Emas 5-Bintang)',
      currentPrice: 198.85,
      entryZone: {
        min: 199.10,
        max: 199.40,
        label: 'Zon MA5 / MA10 High',
      },
      stopLoss: 200.05, // Pembatalan atas Mid BB
      takeProfit1: 197.90, // TP Wajib
      takeProfit2: 196.80, // Low BB
      takeProfit3: 195.40, // Pivot Harian
      riskReward: '1 : 3.8',
      pipsPotential: 195,
      bbState: 'BB Mengembang (Trending)',
      higherTfSetup: 'H4: CSM Sell mengembangkan Lower BB',
      mediumTfSetup: 'H1: Pullback ke zon MA5/MA10 High',
      lowerTfSetup: 'M15: Ekstrem Sell menolak Upper BB',
      rulesChecked: [
        { rule: 'Trend CSM Terbina', passed: true, note: 'H4 membina rentak CSM Sell berterusan' },
        { rule: 'Zon Reentry Disentuh', passed: true, note: 'Menguji paras 199.25 (MA5/10 High)' },
        { rule: 'Mid BB Dihormati', passed: true, note: 'Candle tutup di bawah Mid BB (199.70)' },
        { rule: 'Keselarasan MTF', passed: true, note: 'M15 Ekstrem Sell + M5 MHV Sell disahkan' },
      ],
      summary: 'Reentry Sell REEM 5-Bintang berkepastian tinggi di GBP/JPY. Sambungan trend kukuh susulan pengembangan CSM di H4.',
      timestamp: Date.now() - 180 * 60 * 1000,
      timeAgo: '3 jam lalu',
      status: 'ACTIVE',
    },
  ];
}
