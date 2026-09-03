---
id: T04-search-algorithm-and-pruning-heuristics
title: Search Algorithm and Pruning Heuristics
type: wayfinder:grilling
status: closed
blocked_by:
  - T03-movegen-and-perft-verification-suite
assignee: agy
---

## Question

How should the Negamax search stack be phased and structured across Alpha-Beta, Principal Variation Search (PVS), Iterative Deepening, Quiescence Search (preventing horizon effect), Transposition Table replacement strategies, and move ordering (TT move, MVV-LVA, Killer moves, History heuristic)?

## Resolution

The search algorithm and pruning pipeline decisions have been locked:

1. **Negamax with Principal Variation Search (PVS) & Aspiration Windows**:
   - Searches the 1st candidate move with a full $(\alpha, \beta)$ window.
   - All subsequent moves are probed with a zero-width window $(\alpha, \alpha + 1)$; full re-search occurs only if the null window fails high.
   - Uses aspiration windows ($[\text{score} - 35, \text{score} + 35]$) during iterative deepening to prune non-viable root subtrees.
2. **Quiescence Search**:
   - Evaluates only captures and promotions at leaf nodes.
   - Incorporates **Stand-Pat** evaluation cutoffs and **Delta Pruning** (pruning minor captures when even a queen capture cannot raise score above $\alpha$).
   - Orders captures strictly via **MVV-LVA**.
3. **6-Tier Move Ordering with Incremental Selection Sort**:
   - Tier 1: Transposition Table Best Move.
   - Tier 2: Good Captures / Promotions (MVV-LVA).
   - Tier 3: Killer Moves (2 slots per ply).
   - Tier 4: History Heuristic (`history[color][from][to]` incremented by $depth^2$).
   - Tier 5: Bad Captures (SEE < 0).
   - Tier 6: Quiet Moves.
   - Uses selection sort to pick the top move lazily per step, avoiding sorting all 35+ moves when early beta-cutoffs occur.
4. **Transposition Table (TT)**:
   - 16-byte packed entries (`key: u64`, `best_move: u16`, `score: i16`, `depth: u8`, `flag: u8`, `age: u8`).
   - Two-bucket replacement scheme: Slot 1 is `depth-preferred`; Slot 2 is `always-replace` with age preference.
   - Mate score normalization relative to search ply.
5. **Pruning & Reductions**:
   - **Null-Move Pruning (NMP)**: $R = 2 + \frac{depth}{6}$ when not in check and non-pawn material exists.
   - **Reverse Futility Pruning (RFP)**: Static cutoff at $depth \le 3$ when $\text{eval} - 120 \times depth \ge \beta$.
   - **Late Move Reductions (LMR)**: Depth reduced by 1 for quiet moves beyond move 4 in non-PV nodes.
