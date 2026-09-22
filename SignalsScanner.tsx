import React, { useState, useMemo } from 'react';
import { BBMASignal, BBMASetupType, SignalDirection } from '../types';
import { 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Brain, 
  Calculator, 
  Compass, 
  ChevronRight,
  ShieldCheck,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';

interface SignalsScannerProps {
  signals: BBMASignal[];
  onSelectSignal: (signal: BBMASignal) => void;
  onVerifyWithAI: (signal: BBMASignal) => void;
  onOpenCalculatorWithSignal: (signal: BBMASignal) => void;
  selectedSignalId?: string;
}

export const SignalsScanner: React.FC<SignalsScannerProps> = ({
  signals,
  onSelectSignal,
  onVerifyWithAI,
  onOpenCalculatorWithSignal,
  selectedSignalId,
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedDirection, setSelectedDirection] = useState<string>('ALL');
  const [only5Stars, setOnly5Stars] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredSignals = useMemo(() => {
    return signals.filter((sig) => {
      if (selectedType !== 'ALL' && sig.type !== selectedType) return false;
      if (selectedDirection !== 'ALL' && sig.direction !== selectedDirection) return false;
      if (only5Stars && sig.rating < 5) return false;
      if (searchTerm && !sig.pair.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [signals, selectedType, selectedDirection, only5Stars, searchTerm]);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md">
      {/* Header and Filter Bar */}
      <div className="border-b border-slate-800 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-amber-400" />
              <h2 className="text-base font-bold text-white sm:text-lg">
                Pengimbas Isyarat Langsung BBMA
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                {filteredSignals.length} Aktif
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pengesanan corak masa nyata mengikut 5 setup &amp; formula MTF Oma Ally
            </p>
          </div>

          {/* Quick Search */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari pasangan (cth. XAU, EUR)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 w-36 sm:w-48"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {/* Setup Type Pills */}
          <div className="flex flex-wrap items-center rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
            {(['ALL', 'REENTRY', 'EXTREME', 'MHV', 'CSAK', 'CSM'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                  selectedType === t
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'Semua Setup' : t === 'EXTREME' ? 'EKSTREM' : t}
              </button>
            ))}
          </div>

          {/* Direction Filter */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
            <button
              onClick={() => setSelectedDirection('ALL')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                selectedDirection === 'ALL'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Arah
            </button>
            <button
              onClick={() => setSelectedDirection('BUY')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                selectedDirection === 'BUY'
                  ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Beli (Buy)
            </button>
            <button
              onClick={() => setSelectedDirection('SELL')}
              className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                selectedDirection === 'SELL'
                  ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/40'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Jual (Sell)
            </button>
          </div>

          {/* 5-Star REEM Filter */}
          <button
            onClick={() => setOnly5Stars(!only5Stars)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              only5Stars
                ? 'border-amber-500/60 bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
                : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>REEM 5-Bintang Sahaja</span>
          </button>
        </div>
      </div>

      {/* Signals List Grid */}
      <div className="p-4 sm:p-5">
        {filteredSignals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-400">Tiada isyarat aktif yang sepadan dengan penapis dipilih</p>
            <p className="text-xs text-slate-600 mt-1">Cuba tetapkan semula penapis untuk melihat semua setup BBMA</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredSignals.map((sig) => {
              const isBuy = sig.direction === 'BUY';
              const isSelected = selectedSignalId === sig.id;

              return (
                <div
                  key={sig.id}
                  className={`group relative flex flex-col justify-between rounded-xl border bg-slate-950/70 p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-amber-500 ring-1 ring-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  {/* Top Bar: Pair, Timeframe, Formula Code & Rating */}
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-white tracking-wide">
                          {sig.pair}
                        </span>
                        <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-300">
                          {sig.timeframe}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          • {sig.timeAgo}
                        </span>
                      </div>

                      {/* Stars & Formula Code */}
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 ring-1 ring-amber-500/30">
                          {sig.formulaCode}
                        </span>
                        <div className="flex text-amber-400 text-xs">
                          {'★'.repeat(sig.rating)}
                        </div>
                      </div>
                    </div>

                    {/* Direction & Setup Banner */}
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold ${
                            isBuy
                              ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30'
                          }`}
                        >
                          {isBuy ? (
                            <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5 stroke-[2.5]" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-extrabold ${
                                isBuy ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {sig.direction} {sig.type}
                            </span>
                            <span className="text-xs text-slate-400">
                              @ <strong className="font-mono text-white">{sig.currentPrice}</strong>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {sig.bbState}
                          </p>
                        </div>
                      </div>

                      {/* Risk:Reward Pill */}
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500">R : R</div>
                        <div className="font-mono text-xs font-bold text-amber-400">
                          {sig.riskReward}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          +{sig.pipsPotential} pips
                        </div>
                      </div>
                    </div>

                    {/* Entry, Stop Loss, and TP Grid */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                      {/* Entry Zone */}
                      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2">
                        <div className="text-[10px] font-medium text-slate-500">Zon Kemasukan (Entry)</div>
                        <div className="mt-0.5 font-mono text-[11px] font-bold text-slate-200">
                          {sig.entryZone.min} - {sig.entryZone.max}
                        </div>
                        <div className="text-[9px] text-amber-400 truncate mt-0.5">
                          {sig.entryZone.label}
                        </div>
                      </div>

                      {/* Stop Loss (Mid BB Rule) */}
                      <div className="rounded-lg border border-rose-950/60 bg-rose-950/20 p-2">
                        <div className="text-[10px] font-medium text-rose-400">Cut-Loss (SL)</div>
                        <div className="mt-0.5 font-mono text-[11px] font-bold text-rose-300">
                          {sig.stopLoss}
                        </div>
                        <div className="text-[9px] text-rose-400/80 truncate mt-0.5">
                          Pembatalan Mid BB
                        </div>
                      </div>

                      {/* Take Profit 1 & 2 */}
                      <div className="rounded-lg border border-emerald-950/60 bg-emerald-950/20 p-2">
                        <div className="text-[10px] font-medium text-emerald-400">TP Wajib (TP1)</div>
                        <div className="mt-0.5 font-mono text-[11px] font-bold text-emerald-300">
                          {sig.takeProfit1}
                        </div>
                        <div className="text-[9px] text-emerald-400/80 truncate mt-0.5">
                          TP2: {sig.takeProfit2}
                        </div>
                      </div>
                    </div>

                    {/* Multi-Timeframe Confluence Hierarchy */}
                    <div className="mt-3 rounded-lg border border-slate-800/60 bg-slate-900/30 p-2.5 text-xs">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                        <Zap className="h-3 w-3 text-amber-400" />
                        Keselarasan Pelbagai Rangka Masa (MTF)
                      </div>
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500">TF1 (Setup):</span>
                          <span className="font-mono text-amber-300">{sig.higherTfSetup}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500">TF2 (Pengesahan):</span>
                          <span className="font-mono text-cyan-300">{sig.mediumTfSetup}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500">TF3 (Pencetus):</span>
                          <span className="font-mono text-emerald-300">{sig.lowerTfSetup}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rules Verification Checklist */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
                      {sig.rulesChecked.map((rc, idx) => (
                        <div key={idx} className="flex items-center gap-1 text-slate-400" title={rc.note}>
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{rc.rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 gap-2">
                    <button
                      onClick={() => onSelectSignal(sig)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                    >
                      <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
                      <span>Lihat Carta</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenCalculatorWithSignal(sig)}
                        className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:text-white"
                        title="Kira saiz lot untuk cut loss ini"
                      >
                        <Calculator className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Saiz Lot</span>
                      </button>

                      <button
                        onClick={() => onVerifyWithAI(sig)}
                        className="flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-400 ring-1 ring-amber-500/40 transition hover:bg-amber-500/25 active:scale-95"
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>Sahkan dengan AI</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
