import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  QrCode,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isAndroid, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [manifestCopied, setManifestCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'DIRECT' | 'APK_FILE' | 'QR' | 'ZIP'>('DIRECT');

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-afs4euyxqwnllczbbhza3l-953054931627.asia-east1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  const manifestJsonString = JSON.stringify({
    id: "/",
    name: "Saiful Othman Trading Apps",
    short_name: "Saiful BBMA",
    description: "Aplikasi isyarat Forex, pengimbas setup BBMA Oma Ally masa nyata, carta lilin interaktif, dan penasihat AI oleh Saiful Othman Trading Apps.",
    lang: "ms",
    dir: "ltr",
    theme_color: "#020617",
    background_color: "#020617",
    display: "standalone",
    orientation: "portrait",
    start_url: "/",
    scope: "/",
    categories: ["finance", "productivity", "utilities"],
    icons: [
      { src: `${appUrl}/pwa-192x192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
      { src: `${appUrl}/pwa-512x512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${appUrl}/pwa-maskable-512x512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(manifestJsonString);
    setManifestCopied(true);
    setTimeout(() => setManifestCopied(false), 2500);
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">APK Android &amp; Pemasangan</h3>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                  Sedia Android
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pasang sebagai Aplikasi Android Berdiri Sendiri (Native App) pada telefon anda
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

        {/* Tab Navigation */}
        <div className="mt-4 flex rounded-xl border border-slate-800 bg-slate-900/60 p-1 text-xs">
          <button
            onClick={() => setActiveTab('DIRECT')}
            className={`flex-1 rounded-lg py-2 font-semibold transition ${
              activeTab === 'DIRECT'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pasang 1-Klik (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('APK_FILE')}
            className={`flex-1 rounded-lg py-2 font-semibold transition ${
              activeTab === 'APK_FILE'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Penjana Fail .APK
          </button>
          <button
            onClick={() => setActiveTab('QR')}
            className={`flex-1 rounded-lg py-2 font-semibold transition ${
              activeTab === 'QR'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buka di Telefon
          </button>
          <button
            onClick={() => setActiveTab('ZIP')}
            className={`flex-1 rounded-lg py-2 font-semibold transition ${
              activeTab === 'ZIP'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fail .ZIP
          </button>
        </div>

        {/* Content Tabs */}
        <div className="mt-5 space-y-4 text-xs text-slate-300">
          {/* TAB 1: 1-Tap WebAPK Direct Install */}
          {activeTab === 'DIRECT' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-sm">
                    <Sparkles className="h-4 w-4" />
                    WebAPK Android Asli (Disyorkan)
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                    Segera &amp; 100% Selamat
                  </span>
                </div>
                <p className="mt-1.5 text-slate-300 leading-relaxed">
                  Pada peranti Android, Google Chrome akan menjana fail <strong>WebAPK</strong> berdaftar rasmi secara automatik dan memasangnya terus ke dalam skrin utama serta laci aplikasi telefon anda. Tidak memerlukan pindahan fail manual mahupun tetapan keselamatan berisiko.
                </p>
              </div>

              {isInstalled ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white text-sm">Aplikasi Sudah Dipasang!</div>
                    <p className="text-slate-300 mt-0.5">
                      Saiful Othman Trading Apps sedang berjalan sebagai aplikasi berdiri sendiri pada peranti ini.
                    </p>
                  </div>
                </div>
              ) : isInstallable ? (
                <div className="rounded-xl border border-emerald-500/40 bg-slate-900/90 p-4 text-center space-y-3">
                  <p className="font-semibold text-emerald-300 text-sm">
                    Sedia untuk dipasang terus pada telefon anda!
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Tekan butang di bawah untuk membuka pemasang aplikasi Android.
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 transition active:scale-98"
                  >
                    <Download className="h-4 w-4 stroke-[2.5]" />
                    <span>Pasang Terus Aplikasi Android</span>
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-amber-400" />
                    Cara pasang pada mana-mana telefon Android dalam 3 langkah mudah:
                  </div>
                  <ol className="space-y-2.5 text-slate-300 list-decimal list-inside pl-1">
                    <li className="leading-snug">
                      Buka pautan ini di pelayar <strong>Google Chrome</strong> pada telefon Android anda.
                    </li>
                    <li className="leading-snug">
                      Tekan ikon <strong>tiga titik bertindih (⋮)</strong> di sudut atas kanan Chrome.
                    </li>
                    <li className="leading-snug">
                      Pilih <strong>&ldquo;Pasang aplikasi&rdquo;</strong> (atau <strong>&ldquo;Tambah ke Skrin Utama / Add to Home screen&rdquo;</strong>).
                    </li>
                    <li className="leading-snug">
                      Tekan <strong>Pasang / Install</strong>. Sistem Android akan mencipta ikon aplikasi native di telefon anda.
                    </li>
                  </ol>
                </div>
              )}

              {/* Visual Chrome Step-by-Step Mockup Diagram */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Smartphone className="h-4 w-4" />
                    <span>Panduan Bergambar: Cara Pasang di Google Chrome</span>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                    Skrin Telefon
                  </span>
                </div>

                {/* Simulated Chrome UI Card */}
                <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 space-y-2.5 shadow-inner">
                  {/* Chrome Browser Header Bar */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex flex-1 items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
                      <span className="text-emerald-400 font-bold">🔒</span>
                      <span className="truncate">Saiful Othman Trading</span>
                    </div>
                    {/* Glowing 3 dots button indicator */}
                    <div className="relative flex items-center justify-center">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 font-bold ring-2 ring-amber-400 animate-pulse">
                        ⋮
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    </div>
                  </div>

                  {/* Illustrated Dropdown Menu */}
                  <div className="ml-auto w-56 rounded-xl border border-amber-500/40 bg-slate-900 p-2 shadow-xl space-y-1 text-[11px]">
                    <div className="px-2 py-1 text-slate-500 line-through">Tab baru</div>
                    <div className="px-2 py-1 text-slate-500 line-through">Sejarah</div>
                    {/* The Target Action Item Highlighted */}
                    <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border border-emerald-400 p-2 text-white font-bold shadow-md">
                      <div className="flex items-center gap-1.5">
                        <Download className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-200">Pasang aplikasi</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black animate-bounce">
                        TEKAN INI
                      </span>
                    </div>
                    <div className="px-2 py-1 text-slate-500 line-through">Tambah ke penanda halaman</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 bg-slate-950/60 rounded-lg p-2.5 border border-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Selepas anda tekan <strong>&ldquo;Pasang aplikasi&rdquo;</strong>, ikon <strong>Saiful Othman Trading Apps</strong> akan terus muncul di skrin utama telefon anda!
                  </span>
                </div>
              </div>

              {/* App Link Share */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 flex items-center justify-between gap-2">
                <div className="truncate font-mono text-[11px] text-slate-400">
                  {appUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Disalin' : 'Salin Pautan'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Standalone .APK Builder */}
          {activeTab === 'APK_FILE' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Download className="h-4 w-4 text-amber-400" />
                  Jana Pakej Fail .APK Berdiri Sendiri via PWABuilder
                </div>
                <p className="text-slate-300 leading-relaxed">
                  PWABuilder (dibangunkan bersama Google dan Microsoft) menukar Manifest PWA aplikasi ini menjadi fail <strong>.apk</strong> (untuk pemasangan terus sideload pada Android) atau <strong>.aab</strong> (untuk Google Play Store).
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-2">
                <div className="font-bold text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                  <span>Mengapa PWABuilder Tunjuk &ldquo;Missing Name&rdquo;?</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Pautan pra-tonton AI Studio (ais-dev / ais-pre) mempunyai perlindungan keselamatan Google. Sistem robot luar PWABuilder disekat oleh keselamatan Google tersebut, menyebabkan ia gagal membaca fail manifest secara automatik.
                </p>
                <div className="pt-1 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => setActiveTab('DIRECT')}
                    className="flex-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition text-center"
                  >
                    &larr; Cara Terbaik: Pasang Terus di Chrome
                  </button>
                  <button
                    onClick={handleCopyManifest}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 transition text-center"
                  >
                    {manifestCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{manifestCopied ? 'Manifest Disalin!' : 'Salin Kod Manifest JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Visual Breakdown of User's Screenshot */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 text-amber-400">
                  <span>📸 Penerangan Terperinci Gambar Tangkap Layar Anda:</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  {/* Card 1 */}
                  <div className="rounded-lg border border-slate-700 bg-slate-950 p-2.5 flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-800 text-[10px] font-bold text-slate-400">
                      1
                    </span>
                    <div>
                      <div className="font-bold text-slate-300">
                        Butang &ldquo;Package For Stores&rdquo; (Kelabu / Terkunci)
                      </div>
                      <p className="text-slate-400 text-[10px] mt-0.5">
                        Butang ini tidak boleh ditekan selagi ada tanda ralat merah di bawah.
                      </p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-red-500/20 text-[10px] font-bold text-red-300">
                      2
                    </span>
                    <div>
                      <div className="font-bold text-red-300">
                        Kotak &ldquo;Missing Name&rdquo; (Ralat Merah 🚨)
                      </div>
                      <p className="text-slate-300 text-[10px] mt-0.5">
                        Punca: Pautan preview disekat keselamatan Google, menyebabkan PWABuilder menyangka tiada nama &amp; deskripsi.
                      </p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-300">
                      3
                    </span>
                    <div>
                      <div className="font-bold text-emerald-300">
                        Tindakan Anda: Skrol ke &ldquo;Action Items&rdquo; di Bawah
                      </div>
                      <p className="text-slate-300 text-[10px] mt-0.5">
                        Skrol ke bahagian bawah skrin PWABuilder anda &rarr; klik <strong>&ldquo;Manifest&rdquo;</strong> &rarr; tampal kod JSON di atas untuk hilangkan ralat ini.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
                <div className="font-semibold text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Cara buka butang &ldquo;Package For Stores&rdquo; di PWABuilder:
                </div>
                <ul className="space-y-2 text-slate-300 text-[11px]">
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] text-amber-400 font-bold">1</span>
                    <span>Tekan butang <strong>&ldquo;Salin Kod Manifest JSON&rdquo;</strong> di atas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] text-amber-400 font-bold">2</span>
                    <span>Pada laman PWABuilder (seperti dalam skrin telefon anda), skrol ke bawah pada kad <strong>&ldquo;Action Items&rdquo;</strong> atau tekan <strong>&ldquo;Manifest&rdquo;</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] text-amber-400 font-bold">3</span>
                    <span>Tampal (paste) kod JSON yang telah disalin. Butang <strong>&ldquo;Package For Stores&rdquo;</strong> akan terus aktif!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] text-amber-400 font-bold">4</span>
                    <span>Pilih <strong>Android</strong> &rarr; Muat turun pakej <strong>.apk</strong> terus ke telefon anda.</span>
                  </li>
                </ul>

                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                >
                  <span>Buka Semula PWABuilder</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Developer CLI alternative */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="text-slate-300 font-bold">Alternatif Terminal CLI (Google Bubblewrap):</div>
                <div className="text-amber-300 select-all">npx @bubblewrap/cli init --manifest={appUrl}/manifest.webmanifest</div>
                <div className="text-amber-300 select-all">npx @bubblewrap/cli build</div>
              </div>
            </div>
          )}

          {/* TAB 3: QR Code to open directly on Android Phone */}
          {activeTab === 'QR' && (
            <div className="space-y-4 text-center">
              <p className="text-slate-300">
                Imbas kod QR ini menggunakan kamera telefon Android anda untuk terus membuka aplikasi di Chrome:
              </p>

              <div className="flex justify-center p-3">
                <div className="rounded-2xl border border-slate-800 bg-white p-4 shadow-xl">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}&color=020617&bgcolor=ffffff`}
                    alt="Imbas untuk buka pada Android"
                    className="h-44 w-44 rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Selepas dibuka dalam Chrome di telefon, tekan butang gesaan atau menu (⋮) &rarr; <strong>&ldquo;Pasang Aplikasi&rdquo;</strong>.
              </div>
            </div>
          )}

          {/* TAB 4: Download ZIP Archive */}
          {activeTab === 'ZIP' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2">
                <div className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                  <Download className="h-4 w-4 text-amber-400" />
                  Pakej Arkib Fail .ZIP Projek Lengkap
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Fail <strong>saiful-othman-trading-apps.zip</strong> mengandungi keseluruhan kod sumber lengkap aplikasi: komponen React, TypeScript, enjin pengiraan strategi BBMA Oma Ally, konfigurasi PWA, aset ikon resolusi tinggi, dan pelayan backend.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">saiful-othman-trading-apps.zip</div>
                    <div className="text-[11px] text-slate-400">Saiz: ~133 KB • Format: ZIP Archive</div>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                    Sedia Dimuat Turun
                  </span>
                </div>

                <a
                  href="/saiful-othman-trading-apps.zip"
                  download="saiful-othman-trading-apps.zip"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition active:scale-98"
                >
                  <Download className="h-4 w-4 stroke-[2.5]" />
                  <span>Muat Turun Fail .ZIP Sekarang</span>
                </a>

                <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2 text-[11px] text-slate-400">
                  <div className="font-bold text-slate-300">Kandungan Utama Fail ZIP:</div>
                  <ul className="space-y-1 pl-4 list-disc text-slate-400">
                    <li><strong className="text-slate-200">src/</strong>: Komponen carta lilin interaktif, pengimbas setup BBMA, kalkulator saiz lot, dan Penasihat AI Gemini.</li>
                    <li><strong className="text-slate-200">public/</strong>: Manifest PWA (Android WebAPK), ikon 192px &amp; 512px, favicon, dan fail sokongan.</li>
                    <li><strong className="text-slate-200">server.ts</strong>: Integrasi Express backend dan proksi AI Gemini API yang selamat.</li>
                    <li><strong className="text-slate-200">package.json</strong> &amp; konfigurasi Vite / Tailwind CSS siap bina.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 border-t border-slate-800 pt-4 flex justify-between items-center text-xs">
          <span className="text-slate-500 text-[11px]">
            Pakej: com.bbma.omaally.advisor
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-700 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
