---
id: T05-tapered-evaluation-and-pesto-tuning
title: Tapered Evaluation and PeSTO Piece-Square Tuning
type: wayfinder:grilling
status: closed
blocked_by:
  - T03-movegen-and-perft-verification-suite
assignee: agy
---

## Question

How should the Tapered Hand-Crafted Evaluation (HCE) balance material, PeSTO piece-square tables, pawn structure (doubled/isolated/passed), mobility, and king safety across opening and endgame phases, while defining a clean Evaluator abstraction seam for a future NNUE evaluator?

## Resolution

The static evaluation architecture and tuning heuristics have been settled through grilling:

1. **24-Point Tapered Linear Interpolation**:
   - Material phase weights: Knight = 1, Bishop = 1, Rook = 2, Queen = 4 (Maximum phase = 24).
   - Dynamic phase calculation: $\text{phase} = \min(24, \sum \text{piece\_weights})$.
   - Formula:
     $$\text{score} = \frac{\text{opening\_score} \times \text{phase} + \text{endgame\_score} \times (24 - \text{phase})}{24}$$
   - Symmetrized relative to side-to-move for Negamax consistency.
2. **Dual Opening & Endgame PeSTO Piece-Square Tables**:
   - Tomasz Michniewski’s calibrated PeSTO tables provide opening and endgame square-value offsets for each piece type.
   - Distinct material values:
     - Opening: P = 82, N = 337, B = 365, R = 477, Q = 1025.
     - Endgame: P = 94, N = 281, B = 297, R = 512, Q = 936.
3. **Pawn Structure & King Safety**:
   - **Doubled Pawns**: $-15\text{ cp}$ penalty per doubled file.
   - **Isolated Pawns**: $-20\text{ cp}$ penalty.
   - **Passed Pawns**: Rank-scaled bonuses ($+10, +25, +55, +110, +180\text{ cp}$ on ranks 4..8).
   - **King Safety**: $+20\text{ cp}$ for intact pawn shield on castled flank; $-30\text{ cp}$ per open file directed at the King.
4. **Clean Evaluator Trait Seam**:
   - Defines `pub trait Evaluator: Send + Sync { fn evaluate(&self, pos: &Position) -> i16; }`.
   - `TaperedEvaluator` implements this trait for baseline HCE.
   - The future Phase 2 `NnueEvaluator` will implement the identical trait without requiring refactoring of search tree routines.
