import React from 'react';
import { MTFMatrixItem } from '../types';
import { Layers, ShieldCheck, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

interface MultiTimeframeMatrixProps {
  onSelectPair: (symbol: string) => void;
}

export const MultiTimeframeMatrix: React.FC<MultiTimeframeMatrixProps> = ({ onSelectPair }) => {
  const mtfData: MTFMatrixItem[] = [
    {
      pair: 'XAU/USD',
      higherTf: { tf: 'H4', setup: 'Reentry Buy', state: 'BULLISH' },
      mediumTf: { tf: 'H1', setup: 'Ekstrem Buy', state: 'BULLISH' },
      lowerTf: { tf: 'M15', setup: 'MHV Buy', state: 'BULLISH' },
      confluenceFormula: 'REEM (Reentry - Ekstrem - MHV)',
      signalQuality: '5-BINTANG KEEMASAN',
      recommendedAction: 'Laksana Buy pada MA5/10 Low. Cut loss jika candle tutup di bawah Mid BB.',
    },
    {
      pair: 'EUR/USD',
      higherTf: { tf: 'H4', setup: 'Sideway pada Top BB', state: 'NEUTRAL' },
      mediumTf: { tf: 'H1', setup: 'Ekstrem Sell', state: 'BEARISH' },
      lowerTf: { tf: 'M15', setup: 'CSAK Sell', state: 'BEARISH' },
      confluenceFormula: 'EXT-CSAK (Peralihan Arah)',
      signalQuality: '4-BINTANG TINGGI',
      recommendedAction: 'Sedia Sell Limit pada MA5/10 High semasa pullback. Batal jika melepasi Top BB.',
    },
    {
      pair: 'GBP/JPY',
      higherTf: { tf: 'H4', setup: 'CSM Sell (Mengembang)', state: 'BEARISH' },
      mediumTf: { tf: 'H1', setup: 'Reentry Sell', state: 'BEARISH' },
      lowerTf: { tf: 'M15', setup: 'Ekstrem Sell', state: 'BEARISH' },
      confluenceFormula: 'REEM (Sambungan CSM)',
      signalQuality: '5-BINTANG KEEMASAN',
      recommendedAction: 'Peluang tinggi penyambungan trend Sell di MA5/10 High.',
    },
    {
      pair: 'USD/JPY',
      higherTf: { tf: 'D1', setup: 'Penolakan Mid BB', state: 'BEARISH' },
      mediumTf: { tf: 'H4', setup: 'CSAK Sell', state: 'BEARISH' },
      lowerTf: { tf: 'H1', setup: 'Menunggu Reentry', state: 'NEUTRAL' },
      confluenceFormula: 'RE-CSAK Tertangguh',
      signalQuality: '3-BINTANG SEDERHANA',
      recommendedAction: 'JANGAN kejar CSAK. Tunggu harga menyentuh MA5/10 High sebelum masuk posisi.',
    },
    {
      pair: 'GBP/USD',
      higherTf: { tf: 'H1', setup: 'Ekstrem Buy Tercapai', state: 'BULLISH' },
      mediumTf: { tf: 'M15', setup: 'MHV Buy', state: 'BULLISH' },
      lowerTf: { tf: 'M5', setup: 'CSAK Buy Pecah', state: 'BULLISH' },
      confluenceFormula: 'EXT-MHV-CSAK',
      signalQuality: '4-BINTANG TINGGI',
      recommendedAction: 'Pusingan balik sah berisiko rendah intrahari Buy ke arah Mid BB.',
    },
    {
      pair: 'AUD/USD',
      higherTf: { tf: 'H4', setup: 'Dalam BB (Mendatar)', state: 'NEUTRAL' },
      mediumTf: { tf: 'H1', setup: 'Persilangan MA5/10', state: 'NEUTRAL' },
      lowerTf: { tf: 'M15', setup: 'Tiada Corak Jelas', state: 'NEUTRAL' },
      confluenceFormula: 'Tiada Keselarasan (BB Mendatar)',
      signalQuality: 'MENUNGGU',
      recommendedAction: 'Tiada setup jelas. Prinsip Oma Ally: Tunggu pembentukan Ekstrem atau CSAK.',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md overflow-hidden">
      <div className="border-b border-slate-800 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white sm:text-lg">
              Matriks Pelbagai Rangka Masa (MTF) Oma Ally
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            H4 (Setup) → H1 (Pengesahan) → M15 (Pencetus/Entry)
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Hukum mutlak BBMA: Jangan sesekali berdagang hanya pada satu timeframe. Entry keemasan berlaku apabila ketiga-tiga rangka masa memenuhi formula Oma Ally.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-800 bg-slate-950 text-slate-400 font-semibold">
            <tr>
              <th className="py-3 px-4">Pasangan Forex</th>
              <th className="py-3 px-3">TF1: Setup (H4/D1)</th>
              <th className="py-3 px-3">TF2: Pengesahan (H1)</th>
              <th className="py-3 px-3">TF3: Pencetus (M15)</th>
              <th className="py-3 px-3">Kod Oma Ally</th>
              <th className="py-3 px-3">Kualiti</th>
              <th className="py-3 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {mtfData.map((row) => {
              const isGolden = row.signalQuality.includes('KEEMASAN');
              const isHigh = row.signalQuality.includes('TINGGI');
              const isWaiting = row.signalQuality === 'MENUNGGU';

              return (
                <tr
                  key={row.pair}
                  className="hover:bg-slate-800/40 transition cursor-pointer"
                  onClick={() => onSelectPair(row.pair)}
                >
                  {/* Pair */}
                  <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                    {row.pair}
                  </td>

                  {/* TF 1 Setup */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${
                        row.higherTf.state === 'BULLISH'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : row.higherTf.state === 'BEARISH'
                          ? 'bg-rose-500/15 text-rose-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.higherTf.tf}: {row.higherTf.setup}
                    </span>
                  </td>

                  {/* TF 2 Confirmation */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${
                        row.mediumTf.state === 'BULLISH'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : row.mediumTf.state === 'BEARISH'
                          ? 'bg-rose-500/15 text-rose-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.mediumTf.tf}: {row.mediumTf.setup}
                    </span>
                  </td>

                  {/* TF 3 Trigger */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${
                        row.lowerTf.state === 'BULLISH'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : row.lowerTf.state === 'BEARISH'
                          ? 'bg-rose-500/15 text-rose-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {row.lowerTf.tf}: {row.lowerTf.setup}
                    </span>
                  </td>

                  {/* Code */}
                  <td className="py-3.5 px-3 font-mono text-[11px] text-amber-300 whitespace-nowrap">
                    {row.confluenceFormula}
                  </td>

                  {/* Quality */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isGolden
                          ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40'
                          : isHigh
                          ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                          : isWaiting
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40'
                      }`}
                    >
                      {isGolden && <Sparkles className="h-3 w-3" />}
                      {row.signalQuality}
                    </span>
                  </td>

                  {/* Action / View */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPair(row.pair);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-200 transition hover:bg-slate-700 hover:text-white"
                    >
                      <span>Carta</span>
                      <ArrowRight className="h-3 w-3 text-amber-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
