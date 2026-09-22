/**
 * BBMA Oma Ally Signal & Advisor Pro
 * @license Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { CandlestickChart } from './components/CandlestickChart';
import { SignalsScanner } from './components/SignalsScanner';
import { MultiTimeframeMatrix } from './components/MultiTimeframeMatrix';
import { AIAdvisorDrawer } from './components/AIAdvisorDrawer';
import { OmaAllyHandbook } from './components/OmaAllyHandbook';
import { RiskCalculatorModal } from './components/RiskCalculatorModal';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { 
  FOREX_PAIRS, 
  generatePairCandles, 
  computeBBMAForCandles, 
  getActiveBBMASignals 
} from './utils/bbmaEngine';
import { 
  ForexPairInfo, 
  CandleWithBBMA, 
  BBMASignal 
} from './types';
import { 
  BarChart3, 
  Compass, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Zap, 
  BookOpen, 
  Brain,
  ShieldCheck,
  Radio,
  Smartphone,
  Download
} from 'lucide-react';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [pairs, setPairs] = useState<ForexPairInfo[]>(FOREX_PAIRS);
  const [selectedPairSymbol, setSelectedPairSymbol] = useState<string>('XAU/USD');
  const [timeframe, setTimeframe] = useState<'M15' | 'H1' | 'H4' | 'D1'>('H4');
  const [signals, setSignals] = useState<BBMASignal[]>(getActiveBBMASignals());
  const [selectedSignal, setSelectedSignal] = useState<BBMASignal | undefined>(signals[0]);

  // PWA & Android Installation
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // Modal / Drawer states
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAndroidInstallOpen, setIsAndroidInstallOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active view tab (for mobile & tab switching)
  const [activeMainTab, setActiveMainTab] = useState<'CHART' | 'SIGNALS' | 'MTF_MATRIX'>('CHART');

  // Currently active pair object
  const activePair = useMemo(() => {
    return pairs.find((p) => p.symbol === selectedPairSymbol) || pairs[0];
  }, [pairs, selectedPairSymbol]);

  // Candlestick data with calculated BBMA indicators
  const candles: CandleWithBBMA[] = useMemo(() => {
    const raw = generatePairCandles(activePair.symbol, timeframe, 65);
    return computeBBMAForCandles(raw);
  }, [activePair.symbol, timeframe]);

  // Simulated live market price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setPairs((prevPairs) =>
        prevPairs.map((p) => {
          const delta = (Math.random() - 0.49) * (p.symbol === 'XAU/USD' ? 0.35 : p.symbol.includes('JPY') ? 0.04 : 0.0001);
          const newBid = Math.max(0.1, Number((p.currentBid + delta).toFixed(p.pipDecimals)));
          const newAsk = Number((newBid + p.spreadPips * (p.pipDecimals === 4 ? 0.0001 : 0.01)).toFixed(p.pipDecimals));
          return {
            ...p,
            currentBid: newBid,
            currentAsk: newAsk,
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Quick select pair handler
  const handleSelectPair = useCallback((symbol: string) => {
    setSelectedPairSymbol(symbol);
    const matchingSignal = signals.find((s) => s.pair === symbol);
    if (matchingSignal) {
      setSelectedSignal(matchingSignal);
    }
  }, [signals]);

  // Select signal from scanner
  const handleSelectSignal = useCallback((sig: BBMASignal) => {
    setSelectedSignal(sig);
    setSelectedPairSymbol(sig.pair);
    setTimeframe(sig.timeframe);
    setActiveMainTab('CHART');
  }, []);

  // Open AI advisor with signal context
  const handleVerifyWithAI = useCallback((sig: BBMASignal) => {
    setSelectedSignal(sig);
    setSelectedPairSymbol(sig.pair);
    setTimeframe(sig.timeframe);
    setIsAIAdvisorOpen(true);
  }, []);

  // Open calculator with signal
  const handleOpenCalculatorWithSignal = useCallback((sig: BBMASignal) => {
    setSelectedSignal(sig);
    setSelectedPairSymbol(sig.pair);
    setIsCalculatorOpen(true);
  }, []);

  // Ask AI about specific pair from chart
  const handleAskAIAboutPair = useCallback((pairSymbol: string, tf: string) => {
    setSelectedPairSymbol(pairSymbol);
    setTimeframe(tf as any);
    setIsAIAdvisorOpen(true);
  }, []);

  // Audio beep on signal alerts
  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const goldenSetupsCount = useMemo(() => {
    return signals.filter((s) => s.rating === 5).length;
  }, [signals]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      {/* Top Navigation & Status Bar */}
      <Header
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
        onOpenHandbook={() => setIsHandbookOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAndroidInstall={() => setIsAndroidInstallOpen(true)}
        activeSignalsCount={signals.length}
        goldenCount={goldenSetupsCount}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Android Direct APK & App Installation Banner */}
      {!isInstalled && (
        <div className="border-b border-emerald-500/25 bg-gradient-to-r from-emerald-950/60 via-slate-950 to-slate-900 px-4 py-2 text-xs">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-slate-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Smartphone className="h-3.5 w-3.5" />
              </span>
              <span>
                <strong className="text-white">Pasang di Telefon Android:</strong> Dapatkan WebAPK dipasang terus ke skrin utama telefon anda dengan akses pantas dan carta luar talian.
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isInstallable ? (
                <button
                  onClick={install}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition active:scale-95"
                >
                  <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Pasang Aplikasi di Telefon</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAndroidInstallOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition active:scale-95"
                >
                  <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Pemasangan Android / Kod QR</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Market Pairs Ticker */}
      <div className="border-b border-slate-900 bg-slate-950/80 px-4 py-2">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 shrink-0 mr-2">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">SENARAI PANTAUAN:</span>
          </div>

          {pairs.map((p) => {
            const isSelected = p.symbol === selectedPairSymbol;
            const isPositive = p.dailyChange >= 0;

            return (
              <button
                key={p.symbol}
                onClick={() => handleSelectPair(p.symbol)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition ${
                  isSelected
                    ? 'bg-slate-800 text-white ring-1 ring-amber-500/60 shadow-sm'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <span className="font-mono font-bold text-slate-200">{p.symbol}</span>
                <span className="font-mono font-medium text-white">{p.currentBid.toFixed(p.pipDecimals)}</span>
                <span
                  className={`flex items-center text-[10px] font-semibold ${
                    isPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPositive ? <TrendingUp className="mr-0.5 h-2.5 w-2.5" /> : <TrendingDown className="mr-0.5 h-2.5 w-2.5" />}
                  {isPositive ? `+${p.dailyChange}%` : `${p.dailyChange}%`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-5 sm:px-6">
        {/* Navigation Tabs for Mobile / Flexible Layout Switcher */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMainTab('CHART')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeMainTab === 'CHART'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Carta Interaktif BBMA</span>
            </button>

            <button
              onClick={() => setActiveMainTab('SIGNALS')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeMainTab === 'SIGNALS'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Pengimbas Isyarat Langsung</span>
              <span className="rounded-full bg-slate-950/40 px-1.5 py-0.2 text-[10px] font-mono">
                {signals.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab('MTF_MATRIX')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                activeMainTab === 'MTF_MATRIX'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Matriks MTF Oma Ally</span>
            </button>
          </div>

          {/* Quick Context Pill */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1">
              Fokus Semasa: <strong className="text-white font-mono">{activePair.symbol}</strong> ({timeframe})
            </span>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        {activeMainTab === 'CHART' && (
          <div className="space-y-6">
            {/* Interactive Candlestick Chart */}
            <CandlestickChart
              pair={activePair}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              candles={candles}
              allPairs={pairs}
              onPairChange={handleSelectPair}
              onAskAIAboutPair={handleAskAIAboutPair}
            />

            {/* Quick Context Strip: Selected Signal Overview for This Pair */}
            {selectedSignal && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30 font-bold font-mono text-sm">
                      {selectedSignal.type.slice(0, 3)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          Isyarat Aktif: {selectedSignal.pair} {selectedSignal.direction} {selectedSignal.type}
                        </h4>
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          {selectedSignal.formulaCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {selectedSignal.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsCalculatorOpen(true)}
                      className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                    >
                      Kira Saiz Lot
                    </button>
                    <button
                      onClick={() => setIsAIAdvisorOpen(true)}
                      className="rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                    >
                      Sahkan dengan Penasihat AI
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Side-by-side MTF Matrix Sneak Peek */}
            <MultiTimeframeMatrix onSelectPair={handleSelectPair} />
          </div>
        )}

        {activeMainTab === 'SIGNALS' && (
          <div className="space-y-6">
            <SignalsScanner
              signals={signals}
              onSelectSignal={handleSelectSignal}
              onVerifyWithAI={handleVerifyWithAI}
              onOpenCalculatorWithSignal={handleOpenCalculatorWithSignal}
              selectedSignalId={selectedSignal?.id}
            />
          </div>
        )}

        {activeMainTab === 'MTF_MATRIX' && (
          <div className="space-y-6">
            <MultiTimeframeMatrix onSelectPair={handleSelectPair} />

            {/* Educational MTF Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h3 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Cara Berdagang Matriks MTF Oma Ally
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                BBMA Oma Ally memerlukan 3 tahap rangka masa (timeframe) untuk ketepatan tinggi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <div className="font-bold text-amber-300 mb-1">1. Rangka Masa Setup (H4 / D1)</div>
                  <p className="text-slate-400">
                    Kenal pasti asas setup: Adakah terdapat <strong>Reentry</strong> atau <strong>CSM</strong> mengikut trend pada carta besar?
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <div className="font-bold text-cyan-300 mb-1">2. Rangka Masa Pengesahan (H1)</div>
                  <p className="text-slate-400">
                    Semak struktur harga: Cari <strong>Ekstrem</strong> atau <strong>CSAK</strong> untuk mengesahkan penyertaan pasaran.
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                  <div className="font-bold text-emerald-300 mb-1">3. Rangka Masa Pencetus / Entry (M15 / M5)</div>
                  <p className="text-slate-400">
                    Tentukan kemasukan berisiko rendah: Tunggu <strong>MHV</strong> atau <strong>Ekstrem</strong> untuk entry tepat pada ekor candle dengan stop loss ketat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-2">
          <span>Saiful Othman Trading Apps • Didedikasikan untuk teknik BBMA ciptaan Oma Ally</span>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Bollinger Bands (20,2)</span>
            <span>LWMA 5/10 High & Low</span>
            <span>EMA 50</span>
            <span>Peraturan Cut-Loss Mid BB Ketat</span>
          </div>
        </div>
      </footer>

      {/* AI Advisor Drawer */}
      <AIAdvisorDrawer
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
        activePair={activePair}
        activeTimeframe={timeframe}
        activeSignal={selectedSignal}
      />

      {/* Oma Ally Mastery Handbook Modal */}
      <OmaAllyHandbook
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      {/* Risk & Position Size Calculator Modal */}
      <RiskCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        prefillSignal={selectedSignal}
        allPairs={pairs}
      />

      {/* Android APK & Install Modal */}
      <AndroidInstallModal
        isOpen={isAndroidInstallOpen}
        onClose={() => setIsAndroidInstallOpen(false)}
      />
    </div>
  );
}
