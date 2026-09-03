import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface VariantMeta {
  key: string;
  name: string;
  desc: string;
}

interface PrototypeSwitcherProps {
  variants: VariantMeta[];
  current: string;
  onChange: (key: string) => void;
}

export const PrototypeSwitcher: React.FC<PrototypeSwitcherProps> = ({
  variants,
  current,
  onChange,
}) => {
  const currentIndex = variants.findIndex((v) => v.key === current);
  const currentVariant = variants[currentIndex] ?? variants[0];

  const prev = () => {
    const nextIdx = (currentIndex - 1 + variants.length) % variants.length;
    onChange(variants[nextIdx].key);
  };

  const next = () => {
    const nextIdx = (currentIndex + 1) % variants.length;
    onChange(variants[nextIdx].key);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.hasAttribute('contenteditable')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, variants]);

  return (
    <aside aria-label="Prototype Variant Switcher" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-slate-700/80 shadow-2xl text-slate-100 select-none">
      <button
        onClick={prev}
        className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
        title="Previous Variant (Left Arrow)"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center min-w-[220px]">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
            Variant {currentVariant.key}
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {currentVariant.name}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-0.5">
          {currentVariant.desc}
        </span>
      </div>

      <button
        onClick={next}
        className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
        title="Next Variant (Right Arrow)"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </aside>
  );
};
