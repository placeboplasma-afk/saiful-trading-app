import React, { useState, useEffect } from 'react';
import { X, Calculator, ShieldCheck, DollarSign, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { BBMASignal, ForexPairInfo } from '../types';

interface RiskCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillSignal?: BBMASignal;
  allPairs: ForexPairInfo[];
}

export const RiskCalculatorModal: React.FC<RiskCalculatorModalProps> = ({
  isOpen,
  onClose,
  prefillSignal,
  allPairs,
}) => {
  const [accountBalance, setAccountBalance] = useState<number>(5000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [stopLossPips, setStopLossPips] = useState<number>(35);
  const [selectedPair, setSelectedPair] = useState<string>('EUR/USD');
  const [tpPips, setTpPips] = useState<number>(85);

  useEffect(() => {
    if (prefillSignal) {
      setSelectedPair(prefillSignal.pair);
      // Estimate pips to SL
      const current = prefillSignal.currentPrice;
      const sl = prefillSignal.stopLoss;
      const diff = Math.abs(current - sl);
      const isGold = prefillSignal.pair === 'XAU/USD';
      const isJpy = prefillSignal.pair.includes('JPY');

      let calculatedPips = isGold ? diff * 10 : isJpy ? diff * 100 : diff * 10000;
      setStopLossPips(Math.max(5, Math.round(calculatedPips)));
      setTpPips(Math.max(10, Math.round(prefillSignal.pipsPotential)));
    }
  }, [prefillSignal]);

  if (!isOpen) return null;

  // Pip value estimation per standard lot (100,000 units)
  const isGold = selectedPair === 'XAU/USD';
  const pipValuePerLot = isGold ? 10 : 10; // $10 per pip on 1.0 standard lot for EURUSD & Gold (0.10 moves)

  // Calculations
  const riskAmount = (accountBalance * riskPercent) / 100;
  const rawLotSize = stopLossPips > 0 ? riskAmount / (stopLossPips * pipValuePerLot) : 0;
  const recommendedLot = Math.max(0.01, Math.floor(rawLotSize * 100) / 100);

  const potentialRewardAmount = recommendedLot * stopLossPips * pipValuePerLot * (tpPips / stopLossPips);
  const riskRewardRatio = stopLossPips > 0 ? (tpPips / stopLossPips).toFixed(2) : '1.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white sm:text-base">
                Kalkulator Risiko &amp; Saiz Lot Oma Ally
              </h3>
              <p className="text-xs text-slate-400">
                Pelihara modal akaun dengan disiplin risiko 1-2% setiap dagangan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Inputs Form */}
        <div className="mt-5 space-y-4 text-xs">
          {/* Pair & Balance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Pasangan Mata Wang</label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
              >
                {allPairs.map((p) => (
                  <option key={p.symbol} value={p.symbol}>
                    {p.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Baki Akaun ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  value={accountBalance}
                  onChange={(e) => setAccountBalance(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-7 pr-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Risk % & Stop Loss Pips */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 font-medium">Peratus Risiko (%)</label>
                <span className="font-bold text-amber-400">{riskPercent}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.5% (Selamat)</span>
                <span>1-2% (Disyorkan Oma Ally)</span>
                <span>5% (Agresif)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Stop Loss (Pip)</label>
              <input
                type="number"
                value={stopLossPips}
                onChange={(e) => setStopLossPips(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                placeholder="cth. 35"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Dikira sehingga Cut-Loss Mid BB
              </span>
            </div>
          </div>

          {/* Take Profit Target Pips */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Sasaran Take Profit (Pip)</label>
            <input
              type="number"
              value={tpPips}
              onChange={(e) => setTpPips(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
              placeholder="cth. 85"
            />
          </div>

          {/* Calculation Output Cards */}
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-slate-900/90 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-slate-400 text-xs">Saiz Lot Disyorkan</span>
                <div className="font-mono text-xl font-extrabold text-amber-400">
                  {recommendedLot} <span className="text-xs font-normal text-slate-400">Lot</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-xs">Nisbah Risiko : Ganjaran (R:R)</span>
                <div className="font-mono text-base font-bold text-emerald-400">
                  1 : {riskRewardRatio}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-950 p-2 border border-rose-950/40">
                <div className="text-rose-400 font-medium text-[11px]">Risiko Kerugian Maksimum ($)</div>
                <div className="font-mono text-sm font-bold text-rose-300 mt-0.5">
                  -${riskAmount.toFixed(2)}
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-2 border border-emerald-950/40">
                <div className="text-emerald-400 font-medium text-[11px]">Sasaran Keuntungan ($)</div>
                <div className="font-mono text-sm font-bold text-emerald-300 mt-0.5">
                  +${potentialRewardAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end gap-2 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 transition hover:bg-amber-400"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
