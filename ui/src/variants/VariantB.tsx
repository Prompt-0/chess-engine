import React, { useState } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Chessboard } from '../components/Chessboard';
import { EvalBar } from '../components/EvalBar';
import { Terminal, Shield, GitFork, BarChart3, RotateCcw, ArrowUpDown, Copy, Check } from 'lucide-react';

interface VariantProps {
  game: Chess;
  onMove: (move: { from: Square; to: Square; promotion?: string }) => void;
  onReset: () => void;
  onFlip: () => void;
  flipped: boolean;
}

export const VariantB: React.FC<VariantProps> = ({
  game,
  onMove,
  onReset,
  onFlip,
  flipped,
}) => {
  const [activeTab, setActiveTab] = useState<'eval' | 'tree' | 'console'>('eval');
  const [copiedFen, setCopiedFen] = useState(false);
  const [customUci, setCustomUci] = useState('');
  const [consoleLog, setConsoleLog] = useState<string[]>([
    'info string AetherChess 0.1.0 (x86_64-unknown-linux-gnu)',
    'info string Transposition Table allocated 64 MB (4,194,304 entries)',
    'info depth 14 seldepth 18 score cp 42 nodes 421000 nps 2840000 pv e2e4 c7c5',
    'info depth 15 seldepth 20 score cp 45 nodes 890000 nps 2910000 pv e2e4 c7c5 g1f3',
  ]);

  const fen = game.fen();
  const moves = game.history({ verbose: true });
  const lastMove = moves.length > 0 ? { from: moves[moves.length - 1].from, to: moves[moves.length - 1].to } : null;

  const copyFen = () => {
    navigator.clipboard.writeText(fen);
    setCopiedFen(true);
    setTimeout(() => setCopiedFen(false), 2000);
  };

  const handleSendUci = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUci.trim()) return;
    setConsoleLog((prev) => [...prev, `> ${customUci}`, `info string executed: ${customUci}`]);
    setCustomUci('');
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-6 gap-6">
      {/* Top Banner with FEN Inspector */}
      <header className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-mono font-bold text-sm">
            B
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Analytical Studio & Deep Inspector
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Evaluation Decomposition • PV Tree Analysis • UCI Protocol Inspector
            </p>
          </div>
        </div>

        {/* FEN Bar */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 w-full md:w-auto max-w-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400">FEN</span>
          <input
            readOnly
            value={fen}
            className="bg-transparent font-mono text-xs text-slate-300 flex-1 outline-none truncate"
          />
          <button
            onClick={copyFen}
            className="p-1 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Copy FEN"
          >
            {copiedFen ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Studio Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Board + Eval Bar */}
        <div className="lg:col-span-6 flex flex-col items-center gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex gap-4 items-center justify-center w-full">
            <EvalBar score={45} scoreType="cp" flipped={flipped} />
            <div className="flex-1 max-w-[500px]">
              <Chessboard
                game={game}
                onMove={onMove}
                flipped={flipped}
                interactive={true}
                lastMove={lastMove}
              />
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center justify-center gap-3 w-full pt-2">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Board
            </button>
            <button
              onClick={onFlip}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Invert Perspective
            </button>
          </div>
        </div>

        {/* Right Column: Deep Analytical Workbench */}
        <div className="lg:col-span-6 flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[580px]">
          {/* Workbench Tabs */}
          <nav aria-label="Analytical Workbench Tabs" className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2">
            <button
              onClick={() => setActiveTab('eval')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'eval'
                  ? 'bg-slate-900 border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              PeSTO Breakdown
            </button>
            <button
              onClick={() => setActiveTab('tree')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'tree'
                  ? 'bg-slate-900 border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitFork className="w-4 h-4" />
              Search Variations
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
                activeTab === 'console'
                  ? 'bg-slate-900 border-indigo-400 text-indigo-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-4 h-4" />
              UCI Protocol Console
            </button>
          </nav>

          {/* Tab Content Panels */}
          <div className="p-6 flex-1 flex flex-col">
            {activeTab === 'eval' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block">Static Handcrafted Evaluation</span>
                    <span className="text-2xl font-mono font-bold text-slate-100">+0.45 <span className="text-xs text-slate-400 font-normal">pawn advantage</span></span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                    Game Phase: 24 / 24 (Opening)
                  </div>
                </div>

                {/* Sub-component Bars */}
                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span className="font-semibold">Material Delta</span>
                      <span className="text-emerald-400">+0.20 cp</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '55%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span className="font-semibold">PeSTO Positional Tables</span>
                      <span className="text-emerald-400">+0.35 cp</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-300">
                      <span className="font-semibold">Pawn Structure (Passed / Doubled)</span>
                      <span className="text-rose-400">-0.15 cp</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-slate-300 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-indigo-400" />
                      <span className="font-semibold">King Safety & Shield</span>
                      <span className="text-emerald-400">+0.05 cp</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '51%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Transposition Table Telemetry */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">TT Occupancy</span>
                    <span className="text-sm font-mono font-bold text-slate-200">28.4%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">TT Cutoff Rate</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">82.1%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Null Move Pruning</span>
                    <span className="text-sm font-mono font-bold text-slate-200">14,290</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tree' && (
              <div className="flex flex-col gap-4 text-xs font-mono">
                <div className="text-slate-400">Multi-PV Candidate Branches (Depth 16):</div>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-950 rounded-lg border border-emerald-500/40">
                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                      <span className="text-emerald-400">#1: 1. e4 (+0.48)</span>
                      <span>Nodes: 840K</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                      <span className="text-slate-300">#2: 1. d4 (+0.38)</span>
                      <span>Nodes: 512K</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">d4 Nf6 c4 e6 Nf3 d5 Nc3 c6 e3 Nbd7</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                      <span className="text-slate-300">#3: 1. c4 (+0.25)</span>
                      <span>Nodes: 320K</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">c4 e5 Nc3 Nf6 g3 d5 cxd5 Nxd5 Bg2</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'console' && (
              <div className="flex flex-col h-full gap-3">
                <div className="flex-1 bg-slate-950 rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-y-auto max-h-[360px] border border-slate-800 space-y-1">
                  {consoleLog.map((log, idx) => (
                    <div key={idx} className={log.startsWith('>') ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {log}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendUci} className="flex gap-2">
                  <input
                    type="text"
                    value={customUci}
                    onChange={(e) => setCustomUci(e.target.value)}
                    placeholder="Enter UCI command (e.g. go depth 15, isready, ucinewgame)..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition cursor-pointer"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
