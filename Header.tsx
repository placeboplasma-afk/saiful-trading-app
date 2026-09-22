import React from 'react';
import { 
  TrendingUp, 
  Brain, 
  BookOpen, 
  Calculator, 
  Clock, 
  Activity, 
  Sparkles,
  Volume2,
  VolumeX,
  Smartphone,
  ShieldAlert,
  Download
} from 'lucide-react';

interface HeaderProps {
  onOpenAIAdvisor: () => void;
  onOpenHandbook: () => void;
  onOpenCalculator: () => void;
  onOpenAndroidInstall: () => void;
  activeSignalsCount: number;
  goldenCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAIAdvisor,
  onOpenHandbook,
  onOpenCalculator,
  onOpenAndroidInstall,
  activeSignalsCount,
  goldenCount,
  soundEnabled,
  onToggleSound,
}) => {
  // Determine current active forex sessions (UTC-based)
  const now = new Date();
  const utcHour = now.getUTCHours();
  
  const isLondon = utcHour >= 8 && utcHour < 16;
  const isNewYork = utcHour >= 13 && utcHour < 21;
  const isTokyo = utcHour >= 0 && utcHour < 9;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/40">
            <TrendingUp className="h-5 w-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Saiful Othman <span className="text-amber-400">Trading Apps</span>
              </h1>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-300 ring-1 ring-amber-500/30">
                BBMA OMA ALLY PRO
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">
              Aplikasi Analisis Teknikal BBMA Oma Ally (MA5/10 • EMA50 • Ekstrem • MHV • Reentry)
            </p>
          </div>
        </div>

        {/* Live Market Sessions */}
        <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5 lg:flex">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span>Sesi Pasaran:</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium ${
              isLondon ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30' : 'text-slate-500'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isLondon ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              London
            </span>
            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium ${
              isNewYork ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30' : 'text-slate-500'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isNewYork ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              New York
            </span>
            <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium ${
              isTokyo ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30' : 'text-slate-500'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isTokyo ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              Tokyo
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Alert Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Senyapkan amaran isyarat' : 'Aktifkan bunyi amaran isyarat'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-amber-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
          </button>

          {/* Android APK / App Install */}
          <button
            onClick={onOpenAndroidInstall}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20 active:scale-95"
            title="Pasang Aplikasi Android / Muat Turun APK"
          >
            <Smartphone className="h-4 w-4 text-emerald-400" />
            <span className="hidden sm:inline">Android APK</span>
          </button>

          {/* Download ZIP */}
          <a
            href="/saiful-othman-trading-apps.zip"
            download="saiful-othman-trading-apps.zip"
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20 active:scale-95"
            title="Muat Turun Fail ZIP Lengkap Projek"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Fail ZIP</span>
          </a>

          {/* Lot Size & Risk Calculator */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <Calculator className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Kalkulator Lot</span>
          </button>

          {/* Oma Ally Handbook */}
          <button
            onClick={onOpenHandbook}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
          >
            <BookOpen className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Panduan BBMA</span>
          </button>

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAIAdvisor}
            className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/25 transition hover:brightness-110 active:scale-95"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            <Brain className="h-4 w-4 fill-slate-950 text-slate-950" />
            <span>Penasihat AI</span>
            <Sparkles className="h-3 w-3 text-slate-950" />
          </button>
        </div>
      </div>

      {/* Secondary Bar with Quick Setup Stats */}
      <div className="border-t border-slate-900 bg-slate-950 px-4 py-1.5 text-xs text-slate-400 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">{activeSignalsCount}</span>
              <span>Isyarat Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-amber-400 ring-2 ring-amber-400/20" />
              <span className="font-semibold text-amber-300">{goldenCount}</span>
              <span className="text-slate-300">Setup REEM 5-Bintang</span>
            </div>
            <div className="hidden items-center gap-1.5 md:flex">
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Peraturan Indikator:</span>
              <span className="text-amber-400 font-mono text-[11px]">BB(20,2)</span>
              <span className="text-orange-400 font-mono text-[11px]">MA5/10 High</span>
              <span className="text-cyan-400 font-mono text-[11px]">MA5/10 Low</span>
              <span className="text-purple-400 font-mono text-[11px]">EMA50</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-slate-900 px-2 py-0.5 text-[11px] text-slate-400 border border-slate-800">
              Peraturan Cut-Loss: <span className="text-rose-400 font-medium">Candle Tutup Luar Mid BB</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
