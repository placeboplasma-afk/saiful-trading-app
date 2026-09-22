import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Brain, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { ForexPairInfo, BBMASignal } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePair?: ForexPairInfo;
  activeTimeframe?: string;
  activeSignal?: BBMASignal;
}

export const AIAdvisorDrawer: React.FC<AIAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  activePair,
  activeTimeframe = 'H4',
  activeSignal,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'assistant',
      text: `Salam sejahtera! Saya adalah **Penasihat AI BBMA Oma Ally**. 

Saya menyediakan pengesahan isyarat, analisis pelbagai rangka masa (MTF), zon kemasukan (entry), undang-undang cut-loss, dan panduan tepat mengikut hukum asal Oma Ally (Nor Akmar).

Anda boleh bertanya mengenai:
- **Pengesahan setup** (Ekstrem, MHV, CSAK, CSM, Reentry)
- **Semakan formula REEM 5-Bintang** merentasi rangka masa
- **Aras pembatalan/cut-loss** berpandukan garisan Mid BB
- **Analisis situasi semasa pasaran** bagi mana-mana pasangan mata wang`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // When activeSignal changes and drawer opens, trigger context note
  useEffect(() => {
    if (activeSignal && isOpen) {
      const signalNote: Message = {
        id: `sig-${activeSignal.id}-${Date.now()}`,
        sender: 'assistant',
        text: `📌 **Konteks Isyarat Dimuatkan: ${activeSignal.pair} ${activeSignal.direction} (${activeSignal.type})**
- **Kod Formula**: ${activeSignal.formulaCode}
- **Zon Kemasukan (Entry)**: ${activeSignal.entryZone.min} - ${activeSignal.entryZone.max}
- **Stop Loss / Cut-Loss**: ${activeSignal.stopLoss} (Hukum Mid BB)
- **TP1 (TP Wajib)**: ${activeSignal.takeProfit1} | **TP2**: ${activeSignal.takeProfit2}

Adakah anda ingin saya jalankan pengesahan pelbagai rangka masa (MTF) atau terangkan pengurusan risiko setup ini?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, signalNote]);
    }
  }, [activeSignal, isOpen]);

  const handleSend = async (customPrompt?: string) => {
    const promptToSend = customPrompt || input.trim();
    if (!promptToSend || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/bbma/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          pairContext: activePair
            ? {
                pair: activePair.symbol,
                timeframe: activeTimeframe,
                currentPrice: activePair.currentBid,
                trend: activePair.dailyChange >= 0 ? 'Bullish' : 'Bearish',
              }
            : undefined,
          signalContext: activeSignal,
        }),
      });

      const data = await response.json();

      const assistantMsg: Message = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.response || data.error || 'Tiada jawapan diterima daripada penasihat AI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Ralat menghubungi Penasihat BBMA: ${err.message}. Sila semak sambungan internet anda.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    `Analisis ${activePair?.symbol || 'EUR/USD'} pada rangka masa ${activeTimeframe} mengikut BBMA Oma Ally`,
    'Terangkan formula 5-Bintang REEM (Reentry-Ekstrem-MHV)',
    'Bagaimanakah membezakan antara Ekstrem Sahih dan Ekstrem Palsu?',
    'Apakah hukum Cut-Loss tepat untuk setup Reentry?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-950 shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md shadow-amber-500/20">
              <Brain className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Penasihat AI BBMA Oma Ally</h3>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.2 text-[10px] font-semibold text-amber-300 ring-1 ring-amber-500/30">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Konteks: {activePair?.symbol || 'Forex'} • {activeTimeframe}
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

        {/* Quick Suggestion Chips */}
        <div className="border-b border-slate-900 bg-slate-900/50 p-2.5">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 mb-1.5 px-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Cadangan Soalan Pantas:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                disabled={isLoading}
                className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-[11px] text-slate-300 transition hover:border-amber-500/50 hover:text-amber-300 disabled:opacity-50 text-left truncate max-w-full"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'border border-slate-800 bg-slate-900/90 text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-4 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                        title="Salin mesej"
                      >
                        {copiedId === msg.id ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Disalin' : 'Salin'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-xs text-slate-400">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
                <span>Penasihat AI Oma Ally sedang menganalisis Bollinger Bands &amp; Moving Average...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="border-t border-slate-800 bg-slate-950 p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya mengenai setup BBMA, cut-loss Mid BB, atau MTF..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>
          <div className="mt-2 text-center text-[10px] text-slate-500">
            Penasihat BBMA Oma Ally mematuhi prinsip sahih (Nor Akmar). Sentiasa amalkan pengurusan risiko ketat (1-2%).
          </div>
        </div>
      </div>
    </div>
  );
};
