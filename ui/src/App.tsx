import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { Square } from 'chess.js';
import { VariantA } from './variants/VariantA';
import { VariantB } from './variants/VariantB';
import { VariantC } from './variants/VariantC';
import { PrototypeSwitcher } from './components/PrototypeSwitcher';
import type { VariantMeta } from './components/PrototypeSwitcher';

const VARIANTS: VariantMeta[] = [
  {
    key: 'A',
    name: 'Grandmaster HUD',
    desc: 'Tournament command deck with high-density gauges and live clocks',
  },
  {
    key: 'B',
    name: 'Analytical Studio',
    desc: 'Wide workbench with PeSTO breakdown, search tree, and UCI console',
  },
  {
    key: 'C',
    name: 'Minimalist Zen',
    desc: 'Distraction-free board with ambient glassmorphism HUD chips',
  },
];

export function App() {
  const [variant, setVariant] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('variant')?.toUpperCase();
    return VARIANTS.some((meta) => meta.key === v) ? v! : 'A';
  });

  const [game, setGame] = useState<Chess>(() => new Chess());
  const [flipped, setFlipped] = useState<boolean>(false);

  const handleVariantChange = (newKey: string) => {
    setVariant(newKey);
    const url = new URL(window.location.href);
    url.searchParams.set('variant', newKey);
    window.history.replaceState(null, '', url.toString());
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('variant')?.toUpperCase();
      if (v && VARIANTS.some((meta) => meta.key === v)) {
        setVariant(v);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleMove = (move: { from: Square; to: Square; promotion?: string }) => {
    try {
      const newGame = new Chess(game.fen());
      const result = newGame.move(move);
      if (result) {
        setGame(newGame);
      }
    } catch {
      // Illegal move rejected
    }
  };

  const handleReset = () => {
    setGame(new Chess());
  };

  const handleFlip = () => {
    setFlipped((f) => !f);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-24 selection:bg-emerald-500/30">
      <main className="flex-1 flex flex-col items-center justify-center">
        {variant === 'A' && (
          <VariantA
            game={game}
            onMove={handleMove}
            onReset={handleReset}
            onFlip={handleFlip}
            flipped={flipped}
          />
        )}
        {variant === 'B' && (
          <VariantB
            game={game}
            onMove={handleMove}
            onReset={handleReset}
            onFlip={handleFlip}
            flipped={flipped}
          />
        )}
        {variant === 'C' && (
          <VariantC
            game={game}
            onMove={handleMove}
            onReset={handleReset}
            onFlip={handleFlip}
            flipped={flipped}
          />
        )}
      </main>

      {/* Floating Prototype Variant Switcher */}
      <PrototypeSwitcher
        variants={VARIANTS}
        current={variant}
        onChange={handleVariantChange}
      />
    </div>
  );
}

export default App;
