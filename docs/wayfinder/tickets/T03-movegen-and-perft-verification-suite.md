---
id: T03-movegen-and-perft-verification-suite
title: Move Generator Architecture and Perft Verification Suite
type: wayfinder:grilling
status: closed
blocked_by:
  - T02-bitboard-representation-and-sliding-attack-technique
assignee: agy
---

## Question

How should the move generator structure pseudo-legal generation, check evasions, pin detection, and move encoding (16-bit packed structs) to ensure zero heap allocations per ply while passing standard Perft benchmark suites (Initial position depth 5: 4,865,609 nodes; Position 2 Kiwipete depth 4: 4,085,603 nodes)?

## Resolution

The move generation and verification architecture has been settled through grilling:

1. **Strictly Legal Move Generation via Bitwise Pin and Check Masks**:
   - Computes `checkers` bitboard at the start of generation:
     - **Double Check**: Only generates King evasions to unattacked squares.
     - **Single Check**: Restricts non-King piece destinations to `check_mask` (capturing the checking piece or interposing along the attack ray).
     - **Not in Check**: Unpinned pieces generate moves freely; pinned pieces are masked to legal moves along their specific pin ray.
   - Eliminates speculative `make_move`/`unmake_move` rollbacks. Every generated move is guaranteed 100% legal.
2. **Zero-Allocation Stack `MoveList`**:
   - Implements a fixed-capacity 256-element stack array (`MoveList { moves: [Move; 256], count: usize }`).
   - Occupies only 520 bytes on the execution stack, eliminating heap allocation overhead and allocator lock contention in inner search loops.
3. **Staged Move Generation**:
   - Supports decoupled generation: `generate_captures` (used for Quiescence Search and MVV-LVA move ordering), `generate_quiets`, and `generate_all`.
   - Maximizes search efficiency by avoiding quiet move generation when early captures cause beta cutoffs.
4. **Standard 4-Position Perft Suite & CLI Benchmark**:
   - Position 1 (Initial): Depths 1–5 ($D_5 = 4,865,609$ nodes).
   - Position 2 (Kiwipete): Depths 1–4 ($D_4 = 4,085,603$ nodes) testing en-passant discoveries, pins, and castling rights.
   - Position 3 (Endgame): Depths 1–5 testing pawn promotions and check evasions.
   - Position 4 (Tactical): Depths 1–4 testing promotion-captures and king safety.
   - Harness includes both automated `cargo test` unit tests and interactive CLI divide/NPS reporting.
