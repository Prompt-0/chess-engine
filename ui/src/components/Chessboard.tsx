import React, { useState } from 'react';
import { Chess } from 'chess.js';
import type { Square, Move } from 'chess.js';
import { PieceIcon } from './ChessPieces';
import type { PieceCode } from './ChessPieces';

interface ChessboardProps {
  game: Chess;
  onMove: (move: { from: Square; to: Square; promotion?: string }) => void;
  flipped?: boolean;
  interactive?: boolean;
  lastMove?: { from: string; to: string } | null;
}

export const Chessboard: React.FC<ChessboardProps> = ({
  game,
  onMove,
  flipped = false,
  interactive = true,
  lastMove = null,
}) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);

  const inCheck = game.inCheck();
  const turn = game.turn();

  const handleSquareClick = (square: Square) => {
    if (!interactive) return;

    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalTargets([]);
        return;
      }

      // Check if clicking another friendly piece
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setLegalTargets(moves.map((m) => m.to));
        return;
      }

      // Check if this is a legal target
      if (legalTargets.includes(square)) {
        onMove({ from: selectedSquare, to: square, promotion: 'q' });
        setSelectedSquare(null);
        setLegalTargets([]);
        return;
      }

      setSelectedSquare(null);
      setLegalTargets([]);
    } else {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setLegalTargets(moves.map((m) => m.to));
      }
    }
  };

  const ranks = flipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1];
  const files = flipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  return (
    <div className="relative w-full max-w-[640px] aspect-square rounded-xl overflow-hidden shadow-2xl border border-slate-700/80 bg-slate-900 select-none">
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
        {ranks.map((rank, rankIdx) =>
          files.map((file, fileIdx) => {
            const square = `${file}${rank}` as Square;
            const isDark = (rankIdx + fileIdx) % 2 === 1;
            const piece = game.get(square);
            const isSelected = selectedSquare === square;
            const isTarget = legalTargets.includes(square);
            const isLastMoveFrom = lastMove?.from === square;
            const isLastMoveTo = lastMove?.to === square;
            const isCheckSquare = inCheck && piece?.type === 'k' && piece?.color === turn;

            // Luxury Dark Slate squares
            const baseBg = isDark ? 'bg-[#1e293b]' : 'bg-[#334155]';
            const hoverBg = interactive ? (isDark ? 'hover:bg-[#283548]' : 'hover:bg-[#3d4d65]') : '';

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${baseBg} ${hoverBg} ${
                  isSelected ? '!bg-amber-500/40 ring-2 ring-amber-400 inset-0' : ''
                } ${
                  isLastMoveFrom || isLastMoveTo ? '!bg-emerald-500/25' : ''
                } ${
                  isCheckSquare ? '!bg-rose-600/50 shadow-[inset_0_0_20px_rgba(225,29,72,0.8)]' : ''
                }`}
              >
                {/* Coordinates */}
                {fileIdx === 0 && (
                  <span
                    className={`absolute top-1 left-1.5 text-[10px] font-mono font-semibold ${
                      isDark ? 'text-slate-400/80' : 'text-slate-300/80'
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {rankIdx === 7 && (
                  <span
                    className={`absolute bottom-0.5 right-1.5 text-[10px] font-mono font-semibold ${
                      isDark ? 'text-slate-400/80' : 'text-slate-300/80'
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Legal Move Marker */}
                {isTarget && !piece && (
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/60 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse pointer-events-none" />
                )}
                {isTarget && piece && (
                  <div className="absolute inset-1 rounded-full border-4 border-emerald-400/70 shadow-[0_0_12px_rgba(52,211,153,0.5)] pointer-events-none" />
                )}

                {/* Piece Icon */}
                {piece && (
                  <div className="w-[82%] h-[82%] transition-transform duration-150 hover:scale-105 pointer-events-none">
                    <PieceIcon
                      piece={
                        (piece.color === 'w'
                          ? piece.type.toUpperCase()
                          : piece.type.toLowerCase()) as PieceCode
                      }
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
