import React, { useState, useRef, useMemo } from 'react';
import { 
  CandleWithBBMA, 
  ForexPairInfo 
} from '../types';
import { 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Layers,
  Info,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface CandlestickChartProps {
  pair: ForexPairInfo;
  timeframe: 'M15' | 'H1' | 'H4' | 'D1';
  onTimeframeChange: (tf: 'M15' | 'H1' | 'H4' | 'D1') => void;
  candles: CandleWithBBMA[];
  allPairs: ForexPairInfo[];
  onPairChange: (pairSymbol: string) => void;
  onAskAIAboutPair: (pairSymbol: string, tf: string) => void;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  pair,
  timeframe,
  onTimeframeChange,
  candles,
  allPairs,
  onPairChange,
  onAskAIAboutPair,
}) => {
  // Indicator layer toggles
  const [showBB, setShowBB] = useState(true);
  const [showMAHigh, setShowMAHigh] = useState(true);
  const [showMALow, setShowMALow] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showSetups, setShowSetups] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(45); // number of visible candles
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Visible window of candles
  const visibleCandles = useMemo(() => {
    return candles.slice(Math.max(0, candles.length - zoomLevel));
  }, [candles, zoomLevel]);

  // Compute scale bounds
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (visibleCandles.length === 0) return { minPrice: 0, maxPrice: 1, priceRange: 1 };

    let min = Infinity;
    let max = -Infinity;

    visibleCandles.forEach((c) => {
      min = Math.min(min, c.low);
      max = Math.max(max, c.high);
      if (showBB) {
        if (c.indicators.topBB) max = Math.max(max, c.indicators.topBB);
        if (c.indicators.lowBB) min = Math.min(min, c.indicators.lowBB);
      }
      if (showEMA50 && c.indicators.ema50) {
        min = Math.min(min, c.indicators.ema50);
        max = Math.max(max, c.indicators.ema50);
      }
    });

    const padding = (max - min) * 0.08 || 0.001;
    return {
      minPrice: min - padding,
      maxPrice: max + padding,
      priceRange: max - min + padding * 2,
    };
  }, [visibleCandles, showBB, showEMA50]);

  // Chart Dimensions
  const chartHeight = 440;
  const priceAxisWidth = 75;
  const timeAxisHeight = 28;

  // Coordinate conversion helper
  const getY = (price: number) => {
    if (priceRange === 0) return chartHeight / 2;
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  const hoveredCandle = hoverIndex !== null && visibleCandles[hoverIndex] 
    ? visibleCandles[hoverIndex] 
    : visibleCandles[visibleCandles.length - 1];

  const latestCandle = visibleCandles[visibleCandles.length - 1];
  const isBullishSession = latestCandle ? latestCandle.close >= latestCandle.open : true;

  // Generate SVG path for a line series
  const getLinePath = (getValue: (c: CandleWithBBMA) => number | null | undefined, candleWidth: number) => {
    let path = '';
    visibleCandles.forEach((c, i) => {
      const val = getValue(c);
      if (val === null || val === undefined) return;
      const x = i * candleWidth + candleWidth / 2;
      const y = getY(val);
      if (!path) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return path;
  };

  // Bollinger Bands shaded area
  const getBBAreaPath = (candleWidth: number) => {
    if (!showBB || visibleCandles.length === 0) return '';
    let topPath = '';
    let lowPoints: string[] = [];

    visibleCandles.forEach((c, i) => {
      const top = c.indicators.topBB;
      const low = c.indicators.lowBB;
      if (!top || !low) return;
      const x = i * candleWidth + candleWidth / 2;
      const yTop = getY(top);
      const yLow = getY(low);

      if (!topPath) {
        topPath += `M ${x} ${yTop}`;
      } else {
        topPath += ` L ${x} ${yTop}`;
      }
      lowPoints.unshift(`L ${x} ${yLow}`);
    });

    return `${topPath} ${lowPoints.join(' ')} Z`;
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md">
      {/* Chart Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 py-3 gap-3">
        {/* Pair & Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Pair Dropdown */}
          <div className="relative">
            <select
              value={pair.symbol}
              onChange={(e) => onPairChange(e.target.value)}
              className="appearance-none rounded-xl border border-slate-700 bg-slate-800/90 py-1.5 pl-3 pr-8 text-sm font-bold text-white shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {allPairs.map((p) => (
                <option key={p.symbol} value={p.symbol} className="bg-slate-900 text-white">
                  {p.icon} {p.symbol} — {p.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              ▼
            </div>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
            {(['M15', 'H1', 'H4', 'D1'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  timeframe === tf
                    ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Current Pair Stats */}
          <div className="hidden items-center gap-2 text-xs sm:flex">
            <span className="font-mono text-sm font-bold text-white">
              {pair.currentBid.toFixed(pair.pipDecimals)}
            </span>
            <span
              className={`flex items-center font-medium ${
                pair.dailyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {pair.dailyChange >= 0 ? (
                <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="mr-0.5 h-3.5 w-3.5" />
              )}
              {pair.dailyChange >= 0 ? `+${pair.dailyChange}%` : `${pair.dailyChange}%`}
            </span>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
              Spread {pair.spreadPips}p
            </span>
          </div>
        </div>

        {/* Indicator Toggles & AI Analyze */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Layer toggles */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1 text-[11px]">
            <button
              onClick={() => setShowBB(!showBB)}
              className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition ${
                showBB ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40' : 'text-slate-500'
              }`}
              title="Bollinger Bands (20, 2)"
            >
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              BB
            </button>
            <button
              onClick={() => setShowMAHigh(!showMAHigh)}
              className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition ${
                showMAHigh ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40' : 'text-slate-500'
              }`}
              title="MA5 & MA10 High (LWMA)"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              MA High
            </button>
            <button
              onClick={() => setShowMALow(!showMALow)}
              className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition ${
                showMALow ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40' : 'text-slate-500'
              }`}
              title="MA5 & MA10 Low (LWMA)"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              MA Low
            </button>
            <button
              onClick={() => setShowEMA50(!showEMA50)}
              className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition ${
                showEMA50 ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/40' : 'text-slate-500'
              }`}
              title="EMA 50 Close (Arah Trend)"
            >
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              EMA50
            </button>
            <button
              onClick={() => setShowSetups(!showSetups)}
              className={`flex items-center gap-1 rounded px-2 py-0.5 font-medium transition ${
                showSetups ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40' : 'text-slate-500'
              }`}
              title="Label Corak BBMA (Ekstrem, MHV, CSAK, CSM, Reentry)"
            >
              Label
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 10, candles.length))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zum Keluar (Lihat Lebih Banyak)"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 20))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zum Masuk (Lihat Lebih Terperinci)"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Ask AI Advisor button for this specific chart */}
          <button
            onClick={() => onAskAIAboutPair(pair.symbol, timeframe)}
            className="flex items-center gap-1 rounded-xl bg-amber-500/10 px-2.5 py-1.5 text-xs font-bold text-amber-400 ring-1 ring-amber-500/30 transition hover:bg-amber-500/20 active:scale-95"
          >
            Tanya AI
          </button>
        </div>
      </div>

      {/* Floating Info Header (Current / Hovered Candle & BBMA Values) */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/60 bg-slate-950/60 px-4 py-2 text-xs">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px]">
          <span className="text-slate-400">
            MASA: <strong className="text-slate-200">{hoveredCandle?.time || '--'}</strong>
          </span>
          <span>
            Buka (O): <strong className="text-slate-200">{hoveredCandle?.open.toFixed(pair.pipDecimals)}</strong>
          </span>
          <span>
            Tinggi (H): <strong className="text-emerald-300">{hoveredCandle?.high.toFixed(pair.pipDecimals)}</strong>
          </span>
          <span>
            Rendah (L): <strong className="text-rose-300">{hoveredCandle?.low.toFixed(pair.pipDecimals)}</strong>
          </span>
          <span>
            Tutup (C): <strong className="text-white font-bold">{hoveredCandle?.close.toFixed(pair.pipDecimals)}</strong>
          </span>
          <span className="text-slate-500">|</span>
          {showBB && hoveredCandle?.indicators && (
            <>
              <span className="text-indigo-300">
                Top BB: {hoveredCandle.indicators.topBB.toFixed(pair.pipDecimals)}
              </span>
              <span className="text-amber-200">
                Mid BB: {hoveredCandle.indicators.midBB.toFixed(pair.pipDecimals)}
              </span>
              <span className="text-indigo-300">
                Low BB: {hoveredCandle.indicators.lowBB.toFixed(pair.pipDecimals)}
              </span>
            </>
          )}
          {showEMA50 && hoveredCandle?.indicators && (
            <span className="text-purple-300">
              EMA50: {hoveredCandle.indicators.ema50.toFixed(pair.pipDecimals)}
            </span>
          )}
        </div>

        {/* BB State Badge */}
        {latestCandle?.indicators && (
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                latestCandle.indicators.bbState === 'expanding'
                  ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40'
              }`}
            >
              {latestCandle.indicators.bbState === 'expanding'
                ? '⚡ BB Mengembang (Trending)'
                : '🛡️ BB Mendatar (Sideway)'}
            </span>
          </div>
        )}
      </div>

      {/* Main Interactive Candlestick SVG Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden select-none bg-gradient-to-b from-slate-950 to-slate-900"
        style={{ height: chartHeight + timeAxisHeight }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <svg
          className="w-full h-full"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const candleAreaWidth = rect.width - priceAxisWidth;
            if (mouseX >= 0 && mouseX <= candleAreaWidth) {
              const candleWidth = candleAreaWidth / visibleCandles.length;
              const idx = Math.floor(mouseX / candleWidth);
              if (idx >= 0 && idx < visibleCandles.length) {
                setHoverIndex(idx);
              }
            }
          }}
        >
          <defs>
            {/* Soft gradient for Bollinger Band fill */}
            <linearGradient id="bbGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal price levels) */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const y = chartHeight * ratio;
            const price = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1="0"
                  y1={y}
                  x2={`calc(100% - ${priceAxisWidth}px)`}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={`calc(100% - ${priceAxisWidth - 8}px)`}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {price.toFixed(pair.pipDecimals)}
                </text>
              </g>
            );
          })}

          {/* Render Candlesticks and indicators */}
          {(() => {
            if (visibleCandles.length === 0) return null;
            const containerWidth = containerRef.current?.clientWidth || 800;
            const candleAreaWidth = containerWidth - priceAxisWidth;
            const candleWidth = candleAreaWidth / visibleCandles.length;
            const barWidth = Math.max(3, candleWidth * 0.72);

            return (
              <>
                {/* 1. Bollinger Band Shaded Area */}
                {showBB && (
                  <path
                    d={getBBAreaPath(candleWidth)}
                    fill="url(#bbGradient)"
                    stroke="none"
                  />
                )}

                {/* 2. Top BB & Low BB Lines */}
                {showBB && (
                  <>
                    <path
                      d={getLinePath((c) => c.indicators.topBB, candleWidth)}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      opacity="0.9"
                    />
                    <path
                      d={getLinePath((c) => c.indicators.midBB, candleWidth)}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.8"
                      opacity="0.95"
                    />
                    <path
                      d={getLinePath((c) => c.indicators.lowBB, candleWidth)}
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      opacity="0.9"
                    />
                  </>
                )}

                {/* 3. EMA 50 Line */}
                {showEMA50 && (
                  <path
                    d={getLinePath((c) => c.indicators.ema50, candleWidth)}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="2"
                    opacity="0.95"
                  />
                )}

                {/* 4. MA 5 High & MA 10 High Lines (Linear Weighted) */}
                {showMAHigh && (
                  <>
                    <path
                      d={getLinePath((c) => c.indicators.ma5High, candleWidth)}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="1.5"
                      opacity="0.95"
                    />
                    <path
                      d={getLinePath((c) => c.indicators.ma10High, candleWidth)}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      opacity="0.85"
                    />
                  </>
                )}

                {/* 5. MA 5 Low & MA 10 Low Lines (Linear Weighted) */}
                {showMALow && (
                  <>
                    <path
                      d={getLinePath((c) => c.indicators.ma5Low, candleWidth)}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.5"
                      opacity="0.95"
                    />
                    <path
                      d={getLinePath((c) => c.indicators.ma10Low, candleWidth)}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      opacity="0.85"
                    />
                  </>
                )}

                {/* 6. Candlesticks */}
                {visibleCandles.map((c, i) => {
                  const xCenter = i * candleWidth + candleWidth / 2;
                  const isUp = c.close >= c.open;
                  const candleColor = isUp ? '#10b981' : '#f43f5e';
                  const candleBorder = isUp ? '#34d399' : '#fb7185';

                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);
                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);

                  const yTopBody = Math.min(yOpen, yClose);
                  const bodyHeight = Math.max(1.5, Math.abs(yClose - yOpen));

                  const isHovered = hoverIndex === i;

                  return (
                    <g key={c.timestamp}>
                      {/* Hover column highlight */}
                      {isHovered && (
                        <rect
                          x={i * candleWidth}
                          y={0}
                          width={candleWidth}
                          height={chartHeight}
                          fill="#38bdf8"
                          fillOpacity="0.08"
                        />
                      )}

                      {/* Wick */}
                      <line
                        x1={xCenter}
                        y1={yHigh}
                        x2={xCenter}
                        y2={yLow}
                        stroke={candleColor}
                        strokeWidth="1.2"
                      />

                      {/* Body */}
                      <rect
                        x={xCenter - barWidth / 2}
                        y={yTopBody}
                        width={barWidth}
                        height={bodyHeight}
                        fill={isUp ? '#064e3b' : '#881337'}
                        stroke={candleBorder}
                        strokeWidth="1"
                        rx="1"
                      />

                      {/* 7. BBMA Pattern Badges on Candlesticks */}
                      {showSetups && c.indicators.setup && (
                        <g transform={`translate(${xCenter}, ${c.indicators.setup.direction === 'BUY' ? yLow + 16 : yHigh - 16})`}>
                          <rect
                            x="-28"
                            y="-9"
                            width="56"
                            height="18"
                            rx="4"
                            fill={c.indicators.setup.direction === 'BUY' ? '#065f46' : '#9f1239'}
                            stroke={c.indicators.setup.direction === 'BUY' ? '#34d399' : '#f43f5e'}
                            strokeWidth="1"
                            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
                          />
                          <text
                            x="0"
                            y="3"
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="8.5"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            {c.indicators.setup.type}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* 8. Current Price Horizontal Marker */}
                {latestCandle && (
                  <g>
                    <line
                      x1="0"
                      y1={getY(latestCandle.close)}
                      x2={`calc(100% - ${priceAxisWidth}px)`}
                      y2={getY(latestCandle.close)}
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                    />
                    <g transform={`translate(${containerWidth - priceAxisWidth}, ${getY(latestCandle.close) - 10})`}>
                      <rect
                        x="0"
                        y="0"
                        width={priceAxisWidth}
                        height="20"
                        fill="#f59e0b"
                        rx="3"
                      />
                      <text
                        x="37"
                        y="14"
                        textAnchor="middle"
                        fill="#020617"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {latestCandle.close.toFixed(pair.pipDecimals)}
                      </text>
                    </g>
                  </g>
                )}

                {/* 9. Crosshair when hovering */}
                {hoverIndex !== null && visibleCandles[hoverIndex] && (
                  <g pointerEvents="none">
                    {/* Vertical line */}
                    <line
                      x1={hoverIndex * candleWidth + candleWidth / 2}
                      y1="0"
                      x2={hoverIndex * candleWidth + candleWidth / 2}
                      y2={chartHeight}
                      stroke="#94a3b8"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                      opacity="0.7"
                    />
                    {/* Horizontal line */}
                    <line
                      x1="0"
                      y1={getY(visibleCandles[hoverIndex].close)}
                      x2={`calc(100% - ${priceAxisWidth}px)`}
                      y2={getY(visibleCandles[hoverIndex].close)}
                      stroke="#94a3b8"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                      opacity="0.7"
                    />
                  </g>
                )}
              </>
            );
          })()}

          {/* Time axis labels */}
          {(() => {
            if (visibleCandles.length === 0) return null;
            const containerWidth = containerRef.current?.clientWidth || 800;
            const candleAreaWidth = containerWidth - priceAxisWidth;
            const candleWidth = candleAreaWidth / visibleCandles.length;
            const step = Math.max(1, Math.floor(visibleCandles.length / 7));

            return visibleCandles.map((c, i) => {
              if (i % step !== 0) return null;
              const x = i * candleWidth + candleWidth / 2;
              return (
                <text
                  key={c.timestamp}
                  x={x}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {c.time}
                </text>
              );
            });
          })()}
        </svg>

        {/* In-chart Oma Ally Indicator Legend */}
        <div className="pointer-events-none absolute bottom-9 left-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/85 px-3 py-1.5 text-[10px] backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <span className="h-0.5 w-3.5 bg-amber-400" />
            Mid BB (SMA 20)
          </div>
          <div className="flex items-center gap-1.5 text-indigo-400">
            <span className="h-0.5 w-3.5 border-t border-dashed border-indigo-400" />
            Top & Low BB (Dev 2)
          </div>
          <div className="flex items-center gap-1.5 text-orange-400">
            <span className="h-0.5 w-3.5 bg-orange-400" />
            MA 5/10 High
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="h-0.5 w-3.5 bg-cyan-400" />
            MA 5/10 Low
          </div>
          <div className="flex items-center gap-1.5 text-purple-400">
            <span className="h-0.5 w-3.5 bg-purple-400" />
            EMA 50
          </div>
        </div>
      </div>
    </div>
  );
};
