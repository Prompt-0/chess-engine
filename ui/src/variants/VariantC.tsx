import React, { useState } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { Chessboard } from '../components/Chessboard';
import { RotateCcw, ArrowUpDown, History, Play, Sparkles } from 'lucide-react';

interface VariantProps {
  game: Chess;
  onMove: (move: { from: Square; to: Square; promotion?: string }) => void;
  onReset: () => void;
  onFlip: () => void;
  flipped: boolean;
}

export const VariantC: React.FC<VariantProps> = ({
  game,
  onMove,
  onReset,
  onFlip,
  flipped,
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const moves = game.history({ verbose: true });
  const lastMove = moves.length > 0 ? { from: moves[moves.length - 1].from, to: moves[moves.length - 1].to } : null;

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4">
      {/* Floating Ambient HUD Chips */}
      <div className="flex items-center gap-3 mb-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 px-5 py-2.5 rounded-full shadow-2xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase font-mono">
            Aether Zen
          </span>
        </div>

        <div className="h-4 w-[1px] bg-slate-800" />

        <span className="text-xs font-mono text-emerald-400 font-semibold">
          +0.42
        </span>

        <div className="h-4 w-[1px] bg-slate-800" />

        <span className="text-xs font-mono text-slate-400">
          D: 18 <span className="text-slate-600">|</span> 2.6M nps
        </span>

        <div className="h-4 w-[1px] bg-slate-800" />

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <History className="w-3.5 h-3.5" />
          {moves.length} moves
        </button>
      </div>

      {/* Centered Board Container with Integrated Ambient Glow */}
      <div className="relative flex items-center justify-center w-full max-w-[620px]">
        {/* Subtle Eval Line Glow on Left */}
        <div className="absolute -left-3 top-2 bottom-2 w-1.5 rounded-full bg-gradient-to-t from-slate-100 via-emerald-400 to-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.5)]" />

        <div className="w-full">
          <Chessboard
            game={game}
            onMove={onMove}
            flipped={flipped}
            interactive={true}
            lastMove={lastMove}
          />
        </div>
      </div>

      {/* Floating Action Controls */}
      <div className="flex items-center gap-4 mt-6 bg-slate-900/70 backdrop-blur-md px-6 py-2 rounded-2xl border border-slate-800 shadow-xl">
        <button
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-slate-100 transition rounded-lg hover:bg-slate-800 cursor-pointer"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onFlip}
          className="p-2 text-slate-400 hover:text-slate-100 transition rounded-lg hover:bg-slate-800 cursor-pointer"
          title="Flip Board"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
        <button
          onClick={() => {}}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          Engine Play
        </button>
      </div>

      {/* Slide-out Move History Drawer */}
      {showHistory && (
        <div className="absolute right-6 top-20 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl z-30">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Move History</span>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto font-mono text-xs divide-y divide-slate-800/60">
            {moves.length === 0 ? (
              <span className="text-slate-400 text-center block py-4">No moves yet</span>
            ) : (
              Array.from({ length: Math.ceil(moves.length / 2) }).map((_, turnIdx) => (
                <div key={turnIdx} className="grid grid-cols-12 py-1 px-1">
                  <span className="col-span-3 text-slate-400">{turnIdx + 1}.</span>
                  <span className="col-span-5 text-slate-200">{moves[turnIdx * 2]?.san}</span>
                  <span className="col-span-4 text-slate-400">{moves[turnIdx * 2 + 1]?.san || ''}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
