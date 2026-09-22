import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, ShieldAlert, Sparkles, AlertTriangle, ArrowRight, Star } from 'lucide-react';

interface OmaAllyHandbookProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OmaAllyHandbook: React.FC<OmaAllyHandbookProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'HUKUM' | 'EXTREM' | 'MHV' | 'CSAK' | 'CSM' | 'REENTRY' | 'MTF'>('HUKUM');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white sm:text-lg">
                Buku Panduan &amp; Undang-Undang BBMA Oma Ally
              </h2>
              <p className="text-xs text-slate-400">
                Hukum rasmi, anatomi setup, dan kod pelbagai rangka masa (Nor Akmar)
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'HUKUM', label: '1. Hukum Asas' },
            { id: 'EXTREM', label: '2. Extrem' },
            { id: 'MHV', label: '3. MHV' },
            { id: 'CSAK', label: '4. CSA & CSAK' },
            { id: 'CSM', label: '5. CSM' },
            { id: 'REENTRY', label: '6. Reentry (Golden)' },
            { id: 'MTF', label: '7. Multi-Timeframe' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap px-4 py-3 transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-amber-400 text-amber-300 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-xs text-slate-300 leading-relaxed space-y-6">
          {/* TAB 1: HUKUM ASAS */}
          {activeTab === 'HUKUM' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Hukum Asas Bollinger Bands &amp; Moving Average
                </h3>
                <p className="mt-1 text-slate-300">
                  BBMA dicipta oleh Oma Ally berdasarkan hubungan antara volatiliti harga (Bollinger Bands) dan momentum pasaran (Linear Weighted Moving Average).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Hukum Asas 1: Moving Average
                  </h4>
                  <p className="text-slate-300 mb-2">
                    <strong>Moving Average tidak boleh keluar dari Bollinger Bands.</strong>
                  </p>
                  <p className="text-slate-400">
                    Bila MA5 High atau MA5 Low menembusi atau terkeluar dari Top BB / Low BB, pasaran berada dalam keadaan tidak normal dan memberi amaran berlakunya <strong>EXTREM</strong>!
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Hukum Asas 2: Candlestick
                  </h4>
                  <p className="text-slate-300 mb-2">
                    <strong>Candlestick boleh keluar dari Bollinger Bands.</strong>
                  </p>
                  <p className="text-slate-400">
                    Bila Candlestick close di luar Top BB atau Low BB ketika BB mengembang, ia membentuk <strong>CSM (Candlestick Momentum)</strong>, tanda kekuatan trend yang berterusan.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-rose-950/60 bg-rose-950/20 p-4">
                <h4 className="font-bold text-rose-300 text-sm mb-1.5 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4" />
                  Hukum Cut-Loss Mutlak BBMA Oma Ally
                </h4>
                <p className="text-slate-300">
                  Syarat pembatalan (invalidation / cut loss) bagi sebarang setup Reentry atau Extreme adalah:
                  <strong className="text-white ml-1">
                    Bila Candlestick CLOSE (bukan sekadar shadow) melepasi garisan MID BB!
                  </strong>
                  {' '}Selagi Mid BB bertahan, setup masih sah dan berpotensi mencapai sasaran TP.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <h4 className="font-bold text-white mb-2">Tetapan Indikator Rasmi (Oma Ally)</h4>
                <ul className="space-y-1.5 font-mono text-[11px] text-slate-300">
                  <li>• <strong className="text-indigo-400">Bollinger Bands:</strong> Period 20, Deviation 2, Shift 0, Apply to Close</li>
                  <li>• <strong className="text-orange-400">MA 5 High &amp; MA 10 High:</strong> Linear Weighted (LWMA), Apply to High</li>
                  <li>• <strong className="text-cyan-400">MA 5 Low &amp; MA 10 Low:</strong> Linear Weighted (LWMA), Apply to Low</li>
                  <li>• <strong className="text-purple-400">EMA 50:</strong> Exponential Moving Average, Apply to Close</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: EXTREM */}
          {activeTab === 'EXTREM' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-bold text-amber-400 mb-1">Anatomi Lengkap Setup Extrem</h3>
                <p className="text-slate-300">
                  Extrem ialah setup awal pembalikan arah (early reversal). Ia terbahagi kepada 5 proses wajib:
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2.5 rounded-lg bg-slate-950 p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">1</span>
                    <div>
                      <strong>MA Terkeluar BB:</strong> MA5 High keluar dari Top BB (Extrem Sell) atau MA5 Low keluar dari Low BB (Extrem Buy).
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg bg-slate-950 p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">2</span>
                    <div>
                      <strong>Candlestick Uji Luar BB:</strong> Price membuat shadow melepasi Top BB / Low BB.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg bg-slate-950 p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">3</span>
                    <div>
                      <strong>Candlestick Reverse:</strong> Candle ditutup semula di dalam Bollinger Bands.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg bg-slate-950 p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px]">4</span>
                    <div>
                      <strong>Candlestick Retest:</strong> Candle seterusnya membuat retest ke Top BB / Low BB tanpa melepasi paras tertinggi/terendah candle reverse.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg bg-slate-950 p-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">5</span>
                    <div>
                      <strong className="text-emerald-300">TP Wajib:</strong> Take Profit wajib diambil pada MA bertentangan (MA5/10 Low untuk Extrem Sell, MA5/10 High untuk Extrem Buy).
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-900/50 bg-blue-950/20 p-4">
                <h4 className="font-bold text-blue-300 mb-1">Syarat Tambahan Extrem</h4>
                <p className="text-slate-300">
                  Extrem paling cantik dan berisiko rendah berlaku ketika <strong>BB Mendatar (Flat BB)</strong>. Jika BB sedang Mengembang (Expanding), Extrem berisiko menjadi fake kerana momentum trend masih kuat!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MHV */}
          {activeTab === 'MHV' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-bold text-cyan-400 mb-1">MHV (Market Hilang Volume)</h3>
                <p className="text-slate-300 mb-3">
                  MHV berlaku selepas fasa <strong>Extrem</strong> dan <strong>TP Wajib</strong>. Ia menandakan bahawa pasaran telah hilang tenaga untuk meneruskan perjalanan sebelumnya.
                </p>

                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-950 p-3">
                    <h5 className="font-bold text-white mb-1">Ciri-ciri Utama MHV:</h5>
                    <ul className="space-y-1 list-disc list-inside text-slate-300">
                      <li>Harga kembali cuba menguji Top BB (MHV Sell) atau Low BB (MHV Buy).</li>
                      <li>Candlestick <strong>GAGAL CLOSE di luar Bollinger Bands</strong> (hanya shadow sahaja atau ditutup di dalam).</li>
                      <li>Biasanya membentuk corak Double Top (Sell) atau Double Bottom (Buy).</li>
                      <li>Terbatal sekiranya ada candle yang berjaya close di luar Top/Low BB (menjadi CSM).</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CSA & CSAK */}
          {activeTab === 'CSAK' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-bold text-purple-400 mb-1">Perbezaan CSA vs CSAK</h3>
                <p className="text-slate-300 mb-3">
                  Candlestick Arah (CSA) dan Candlestick Arah Kukuh (CSAK) memberi isyarat awal pertukaran arah trend pasaran.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-950 p-3 border border-slate-800">
                    <h5 className="font-bold text-amber-300 mb-1">CSA (Candle Arah Awal)</h5>
                    <p className="text-slate-300">
                      Candle yang mematikan Extrem dan melepasi garisan MA5 & MA10 sahaja, tetapi <strong>belum melepasi Mid BB</strong>.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3 border border-purple-500/40">
                    <h5 className="font-bold text-purple-300 mb-1">CSAK (Candle Arah Kukuh)</h5>
                    <p className="text-slate-300">
                      Candle yang berjaya memecahkan dan ditutup melepasi <strong>MA5, MA10 DAN MID BB</strong> sekaligus!
                    </p>
                    <p className="text-[11px] text-emerald-400 mt-1">
                      ★ Menandakan pembukaan peluang Reentry yang berkuasa!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CSM */}
          {activeTab === 'CSM' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-bold text-emerald-400 mb-1">CSM (Candlestick Momentum)</h3>
                <p className="text-slate-300 mb-3">
                  Candlestick Momentum terbentuk apabila candle ditutup sepenuhnya <strong>di luar Bollinger Bands</strong> ketika Bollinger Bands sedang <strong>mengembang (expanding)</strong>.
                </p>

                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <h5 className="font-bold text-amber-300 mb-1">Pesanan Khas Oma Ally:</h5>
                  <p className="text-slate-200 font-semibold">
                    "Jangan sekali-kali tekan entry ketika CSM sedang berjalan! Itu adalah saat pasaran sangat laju dan berisiko tinggi. Tunggu harga membuat pullback ke MA5/MA10 untuk REENTRY!"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REENTRY */}
          {activeTab === 'REENTRY' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  REENTRY: 'Zon Emas' BBMA Oma Ally
                </h3>
                <p className="text-slate-300 mb-3">
                  Reentry adalah jantung kepada teknik BBMA Oma Ally. Ia memberikan nisbah Risk-to-Reward (R:R) terbaik dengan Stop Loss yang sangat ketat.
                </p>

                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-950 p-3 border border-emerald-500/30">
                    <h5 className="font-bold text-emerald-300 mb-1">Reentry Buy:</h5>
                    <p className="text-slate-300">
                      Berlaku selepas wujudnya <strong>CSAK Buy</strong> atau <strong>CSM Buy</strong>. Harga membuat pullback kembali ke zon <strong>MA5 Low / MA10 Low</strong>.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Syarat: Candle tidak boleh close di bawah Mid BB.
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-950 p-3 border border-rose-500/30">
                    <h5 className="font-bold text-rose-300 mb-1">Reentry Sell:</h5>
                    <p className="text-slate-300">
                      Berlaku selepas wujudnya <strong>CSAK Sell</strong> atau <strong>CSM Sell</strong>. Harga membuat pullback kembali ke zon <strong>MA5 High / MA10 High</strong>.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Syarat: Candle tidak boleh close di atas Mid BB.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MTF */}
          {activeTab === 'MTF' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-bold text-white mb-1">Formula Kod Rahsia Multi-Timeframe Oma Ally</h3>
                <p className="text-slate-300 mb-3">
                  Setiap setup di Timeframe Besar memerlukan pengesahan di Timeframe Sederhana dan Timeframe Kecil:
                </p>

                <div className="space-y-3">
                  <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-amber-300">1. KOD REEM (5-Star Holy Grail)</h5>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                        Winrate Tertinggi
                      </span>
                    </div>
                    <div className="mt-2 text-xs font-mono space-y-1 text-slate-200">
                      <div>• TF1 (H4): <strong>REENTRY</strong></div>
                      <div>• TF2 (H1): <strong>EXTREM</strong></div>
                      <div>• TF3 (M15): <strong>MHV</strong></div>
                    </div>
                    <p className="text-slate-300 text-[11px] mt-2">
                      Ini ialah setup paling diminati ramai pengikut Oma Ally kerana ia menjamin entry di pucuk/akar dengan risiko SL minimum!
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                    <h5 className="font-bold text-cyan-300">2. KOD RE-CSAK-EXT</h5>
                    <div className="mt-2 text-xs font-mono space-y-1 text-slate-300">
                      <div>• TF1 (H4): <strong>REENTRY</strong></div>
                      <div>• TF2 (H1): <strong>CSAK</strong></div>
                      <div>• TF3 (M15): <strong>EXTREM</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950 p-4 flex justify-between items-center text-xs text-slate-400">
          <span>Teknik BBMA Oma Ally • Warisan Ilmu Dagangan Forex Malaysia</span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-700 transition"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
