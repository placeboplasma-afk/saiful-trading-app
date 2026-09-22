/**
 * BBMA Oma Ally TypeScript Types & Data Models
 */

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type BBMASetupType = 'EXTREME' | 'MHV' | 'CSAK' | 'CSM' | 'REENTRY';

export type SignalDirection = 'BUY' | 'SELL';

export type BBState = 'expanding' | 'flat' | 'narrow';

export interface BBMAIndicators {
  topBB: number;
  midBB: number;
  lowBB: number;
  ma5High: number;   // Linear Weighted MA 5 High
  ma10High: number;  // Linear Weighted MA 10 High
  ma5Low: number;    // Linear Weighted MA 5 Low
  ma10Low: number;   // Linear Weighted MA 10 Low
  ema50: number;     // Exponential MA 50 Close
  bbState: BBState;
  setup?: {
    type: BBMASetupType;
    direction: SignalDirection;
    label: string;
    description: string;
  };
}

export interface CandleWithBBMA extends Candle {
  indicators: BBMAIndicators;
}

export interface RuleCheck {
  rule: string;
  passed: boolean;
  note: string;
}

export interface BBMASignal {
  id: string;
  pair: string;
  timeframe: 'M15' | 'H1' | 'H4' | 'D1';
  type: BBMASetupType;
  direction: SignalDirection;
  rating: number; // 1 to 5 stars
  formulaCode: string; // e.g., 'REEM (5-Star)', 'RE-CSAK', 'EXT-REVERSE'
  currentPrice: number;
  entryZone: {
    min: number;
    max: number;
    label: string;
  };
  stopLoss: number;
  takeProfit1: number; // TP Wajib / opposite MA5/10
  takeProfit2: number; // Mid BB or opposite BB
  takeProfit3: number; // Extended target / CSM
  riskReward: string;
  pipsPotential: number;
  bbState: 'BB Mengembang (Trending)' | 'BB Mendatar (Sideway)';
  higherTfSetup: string;
  mediumTfSetup: string;
  lowerTfSetup: string;
  rulesChecked: RuleCheck[];
  summary: string;
  timestamp: number;
  timeAgo: string;
  status: 'ACTIVE' | 'PENDING' | 'HIT_TP1' | 'INVALIDATED';
}

export interface MultiTimeframeStep {
  timeframe: string;
  role: 'Setup' | 'Confirmation' | 'Trigger / Entry';
  setupName: string;
  status: 'VALID' | 'WAITING' | 'INVALID';
  detail: string;
}

export interface MTFMatrixItem {
  pair: string;
  higherTf: { tf: string; setup: string; state: 'BULLISH' | 'BEARISH' | 'NEUTRAL' };
  mediumTf: { tf: string; setup: string; state: 'BULLISH' | 'BEARISH' | 'NEUTRAL' };
  lowerTf: { tf: string; setup: string; state: 'BULLISH' | 'BEARISH' | 'NEUTRAL' };
  confluenceFormula: string;
  signalQuality: '5-BINTANG KEEMASAN' | '4-BINTANG TINGGI' | '3-BINTANG SEDERHANA' | 'MENUNGGU' | '5-STAR GOLDEN' | '4-STAR HIGH' | '3-STAR MODERATE' | 'WAITING';
  recommendedAction: string;
}

export interface ForexPairInfo {
  symbol: string;
  name: string;
  baseCurrency: string;
  quoteCurrency: string;
  pipDecimals: number;
  spreadPips: number;
  currentBid: number;
  currentAsk: number;
  dailyChange: number;
  icon: string;
}
