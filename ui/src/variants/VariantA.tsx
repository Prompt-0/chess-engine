import React, { useState } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Chessboard } from '../components/Chessboard';
import { EvalBar } from '../components/EvalBar';
import { Play, RotateCcw, ArrowUpDown, Activity, Cpu, Gauge, Zap } from 'lucide-react';

interface VariantProps {
  game: Chess;
  onMove: (move: { from: Square; to: Square; promotion?: string }) => void;
  onReset: () => void;
  onFlip: () => void;
  flipped: boolean;
}

export const VariantA: React.FC<VariantProps> = ({
  game,
  onMove,
  onReset,
  onFlip,
  flipped,
}) => {
  const [engineSearching, setEngineSearching] = useState(false);

  // Mock telemetry data simulating active engine search
  const telemetry = {
    depth: 18,
    seldepth: 24,
    score: 48,
    scoreType: 'cp' as const,
    nodes: 1842910,
    nps: 2640000,
    timeMs: 698,
    pv: ['e2e4', 'c7c5', 'g1f3', 'd7d6', 'd2d4', 'c5xd4', 'f3xd4'],
  };

  const moves = game.history({ verbose: true });
  const lastMove = moves.length > 0 ? { from: moves[moves.length - 1].from, to: moves[moves.length - 1].to } : null;

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-6 gap-6">
      {/* Header Bar */}
      <header className="flex items-center justify-between bg-slate-900/80 backdrop-blur border border-slate-800 px-6 py-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              AetherChess
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                v0.1.0 • Tournament HUD
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Negamax PVS • PeSTO Tapered HCE • Magic Bitboards
            </p>
          </div>
        </div>

        {/* Engine status indicator & clocks */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-slate-300">Engine Ready</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-sm">
            <div className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-sans">Black (Engine)</span>
              10:00
            </div>
            <div className="px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
              <span className="text-[10px] text-slate-400 block uppercase font-sans">White (Human)</span>
              10:00
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Eval Bar + Chessboard */}
        <div className="lg:col-span-8 flex gap-4 items-center justify-center bg-slate-900/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <EvalBar score={telemetry.score} scoreType={telemetry.scoreType} flipped={flipped} />
          <div className="flex-1 max-w-[580px]">
            <Chessboard
              game={game}
              onMove={onMove}
              flipped={flipped}
              interactive={true}
              lastMove={lastMove}
            />

            {/* Quick Action Buttons */}
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Game
                </button>
                <button
                  onClick={onFlip}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Flip Board
                </button>
              </div>

              <button
                onClick={() => setEngineSearching(!engineSearching)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {engineSearching ? 'Stop Engine' : 'Trigger Engine Move'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Telemetry & Move History */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Real-Time Search Gauges */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Search Telemetry
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Depth</span>
                <span className="text-xl font-mono font-bold text-slate-100">
                  {telemetry.depth}
                  <span className="text-xs text-slate-400 font-normal"> / {telemetry.seldepth}</span>
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1 flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-amber-400" /> Speed
                </span>
                <span className="text-xl font-mono font-bold text-slate-100">
                  {(telemetry.nps / 1000000).toFixed(2)}
                  <span className="text-xs text-slate-400 font-normal"> M/s</span>
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Nodes</span>
                <span className="text-base font-mono font-semibold text-slate-200">
                  {telemetry.nodes.toLocaleString()}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Time</span>
                <span className="text-base font-mono font-semibold text-slate-200">
                  {telemetry.timeMs} ms
                </span>
              </div>
            </div>

            {/* Principal Variation Line */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1.5 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> Best Line (PV)
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {telemetry.pv.map((move, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-emerald-300 font-medium"
                  >
                    {move}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Move Notation History */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex-1 min-h-[220px]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Move Record
            </h2>
            <div className="max-h-[240px] overflow-y-auto font-mono text-xs divide-y divide-slate-800/60">
              {moves.length === 0 ? (
                <div className="text-slate-400 py-4 text-center">No moves yet. Make a move on the board!</div>
              ) : (
                Array.from({ length: Math.ceil(moves.length / 2) }).map((_, turnIdx) => {
                  const whiteMove = moves[turnIdx * 2];
                  const blackMove = moves[turnIdx * 2 + 1];
                  return (
                    <div key={turnIdx} className="grid grid-cols-12 py-1 px-2 hover:bg-slate-800/40 rounded">
                      <span className="col-span-2 text-slate-400">{turnIdx + 1}.</span>
                      <span className="col-span-5 font-semibold text-slate-200">{whiteMove?.san}</span>
                      <span className="col-span-5 font-semibold text-slate-400">{blackMove?.san || ''}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
