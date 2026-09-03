import React from 'react';

interface EvalBarProps {
  score: number; // in centipawns or mate plies
  scoreType: 'cp' | 'mate';
  flipped?: boolean;
}

export const EvalBar: React.FC<EvalBarProps> = ({ score, scoreType, flipped = false }) => {
  let whiteWinProb = 0.5;
  let label = '0.0';

  if (scoreType === 'mate') {
    if (score > 0) {
      whiteWinProb = 1.0;
      label = `M${score}`;
    } else {
      whiteWinProb = 0.0;
      label = `-M${Math.abs(score)}`;
    }
  } else {
    // Sigmoid probability
    whiteWinProb = 1 / (1 + Math.pow(10, -score / 400));
    const pawns = (score / 100).toFixed(1);
    label = score > 0 ? `+${pawns}` : pawns;
  }

  // Bound between 3% and 97% for visible styling
  const clampedProb = Math.max(0.03, Math.min(0.97, whiteWinProb));
  const whiteHeightPercent = (clampedProb * 100).toFixed(1);

  return (
    <div className="relative flex flex-col items-center w-8 h-full min-h-[440px] max-h-[640px] bg-slate-900 border border-slate-700/60 rounded-lg overflow-hidden shadow-xl select-none">
      {/* Black's portion (top) */}
      <div className="w-full flex-1 bg-slate-950 flex items-start justify-center pt-2">
        {(!flipped && clampedProb < 0.5) && (
          <span className="text-[11px] font-mono font-bold text-slate-300">
            {label}
          </span>
        )}
      </div>

      {/* White's portion (bottom, dynamically sized) */}
      <div
        className="w-full bg-slate-100 transition-all duration-500 ease-out flex items-end justify-center pb-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        style={{ height: `${whiteHeightPercent}%` }}
      >
        {(!flipped && clampedProb >= 0.5) && (
          <span className="text-[11px] font-mono font-bold text-slate-900">
            {label}
          </span>
        )}
      </div>

      {/* 50% equilibrium notch */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-emerald-500/40 pointer-events-none" />
    </div>
  );
};
