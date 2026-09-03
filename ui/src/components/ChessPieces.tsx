import React from 'react';

export type PieceCode = 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';

export const PieceIcon: React.FC<{ piece: PieceCode; className?: string }> = ({ piece, className = "w-full h-full" }) => {
  const isWhite = piece === piece.toUpperCase();
  const type = piece.toLowerCase();

  const fill = isWhite ? "#ffffff" : "#0f172a";
  const stroke = isWhite ? "#334155" : "#94a3b8";
  const accent = isWhite ? "#f1f5f9" : "#64748b";

  switch (type) {
    case 'p':
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <path
            d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 L 34,39.5 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'n':
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m 22,10 c 10.5,1 16.5,8 16,29 L 15,39 C 15,30 11.5,23.5 9,21 c -1.5,-1.5 -2.5,-3.5 -2.5,-6 0,-3.5 2,-6 5,-6 3,0 5,2 7,4 1.5,-2 4,-3 6.5,-3 z" />
            <path d="M 24 18 A 2 2 0 1 1 20 18 A 2 2 0 1 1 24 18 Z" fill={accent} />
          </g>
        </svg>
      );
    case 'b':
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.14,39.5 36,39.5 C 32,39.5 13,39.5 9,39.5 C 7.86,39.5 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" />
            <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
            <circle cx="22.5" cy="8" r="2.5" fill={accent} />
            <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" />
          </g>
        </svg>
      );
    case 'r':
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9,39 L 36,39 L 36,36 L 9,36 z" />
            <path d="M 12,36 L 12,32 L 33,32 L 33,36 z" />
            <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 z" />
            <path d="M 34,14 L 31,17 L 14,17 L 11,14" />
            <path d="M 14,17 L 14,29.5 L 31,29.5 L 31,17" />
            <path d="M 14,29.5 L 12,32 L 33,32 L 31,29.5" />
          </g>
        </svg>
      );
    case 'q':
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 9 26 C 17.5 24.5 30 24.5 36 26 L 38 14 L 31 25 L 22.5 12 L 14 25 L 7 14 Z" />
            <path d="M 9 26 C 9 28 10.5 34 13 36 C 18 37 27 37 32 36 C 34.5 34 36 28 36 26 Z" />
            <circle cx="6" cy="12" r="2" fill={accent} />
            <circle cx="14" cy="9" r="2" fill={accent} />
            <circle cx="22.5" cy="8" r="2" fill={accent} />
            <circle cx="31" cy="9" r="2" fill={accent} />
            <circle cx="39" cy="12" r="2" fill={accent} />
            <path d="M 11 38.5 L 34 38.5" strokeWidth="2" />
          </g>
        </svg>
      );
    case 'k':
      return (
        <svg viewBox="0 0 45 45" className={className}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8" />
            <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" />
            <path d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 C 36.5,35 37.5,31 37.5,31 C 37.5,28 35.5,25 35.5,25 C 33,26 27,27 22.5,27 C 18,27 12,26 9.5,25 C 9.5,25 7.5,28 7.5,31 C 7.5,31 8.5,35 11.5,37 z" />
            <circle cx="22.5" cy="20" r="2.5" fill={accent} />
          </g>
        </svg>
      );
    default:
      return null;
  }
};
