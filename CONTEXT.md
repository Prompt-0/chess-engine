# Chess Engine & Interactive UI

A high-performance chess computation engine and interactive web interface for playing, analyzing, and inspecting chess games.

## Language

**Engine**:
The headless, compute-intensive calculation backend that performs move generation, board evaluation, and position search.
_Avoid_: Bot, AI agent, solver

**UCI**:
The standard Universal Chess Interface protocol used to communicate with chess engines via standard input and output streams.
_Avoid_: API, CLI protocol, chess RPC

**Bitboard**:
A 64-bit unsigned integer representing the occupancy or attack footprint of pieces across the 64 squares of a chessboard.
_Avoid_: Board array, square grid

**Ply**:
A single half-move made by either White or Black. Two consecutive plies constitute one full chess move.
_Avoid_: Turn, half-turn, move step

**Transposition Table**:
A fixed-size in-memory hash table indexed by Zobrist hash keys that caches search results, depths, evaluation bounds, and best moves to prevent redundant subtree exploration.
_Avoid_: Cache, hash map, memoizer

**Quiescence Search**:
An extension of the search algorithm at leaf nodes that evaluates only tactical captures and promotions until the position is calm, preventing the horizon effect.
_Avoid_: Capture search, tactical resolver

**Tapered Evaluation**:
A heuristic evaluation scoring function that computes both opening and endgame values simultaneously and interpolates between them based on the current material game phase.
_Avoid_: Static score, hybrid eval

**Principal Variation (PV)**:
The sequence of best moves predicted by the search algorithm assuming optimal play from both sides.
_Avoid_: Best line, candidate sequence

**Evaluation Bar**:
A vertical graphical visualizer in the UI showing real-time winning probability and centipawn advantage for White or Black.
_Avoid_: Score bar, advantage meter

**Magic Bitboards**:
A technique using precomputed 64-bit magic multipliers and bit shifts to hash piece blocker configurations into sliding attack lookup tables.
_Avoid_: Ray tracer, collision map

**LERF (Little-Endian Rank-File)**:
The square numbering standard where square index 0 represents A1, 7 represents H1, and 63 represents H8.
_Avoid_: 2D coordinate, row-major index

**Perft**:
A deterministic verification procedure that walks the legal move tree to a specified depth and counts leaf nodes to validate chess rule correctness.
_Avoid_: Move counter, tree audit

**Pin Mask**:
A bitboard identifying pieces pinned against their King that are constrained to move exclusively along their ray of pin.
_Avoid_: Frozen piece, absolute bound

**Check Mask**:
A bitboard ray representing the squares where an attacked side can interpose or capture to resolve an active check.
_Avoid_: Block ray, defense line

**PVS (Principal Variation Search)**:
An alpha-beta optimization that proves non-PV moves cannot exceed the current best line using zero-width null-window searches.
_Avoid_: Scout search, null probe

**MVV-LVA**:
A move-ordering heuristic prioritizing captures that score the highest victim value with the lowest attacker value.
_Avoid_: Greedy capture, victim sort

**Killer Move**:
A quiet move that caused a beta-cutoff at the same search ply in a sibling sub-tree.
_Avoid_: Cutoff move, hot move

**Null-Move Pruning**:
A search optimization where passing the turn verifies if a shallower search still yields a beta cutoff to prune subtrees.
_Avoid_: Pass move, skip turn

**PeSTO Tables**:
Tomasz Michniewski's standardized Piece-Square Tables providing opening and endgame positional square bonuses for each piece type.
_Avoid_: Heatmap, square scores

**Game Phase**:
A material-weighted scalar representing the transition from Opening (Phase 24) to Endgame (Phase 0).
_Avoid_: Stage value, game clock

**Passed Pawn**:
A pawn with no opposing pawns on the same file or adjacent files ahead of it on its path to promotion.
_Avoid_: Free pawn, clear pawn

**Evaluator Trait**:
A decoupled interface abstraction allowing alternative scoring backends (HCE, NNUE) to be plugged into the search engine seamlessly.
_Avoid_: Evaluation function, score delegate

**Soft Limit**:
A search time threshold where the engine finishes its current iterative deepening depth and declines to start the next iteration.
_Avoid_: Target time, soft stop

**Hard Limit**:
An absolute time ceiling where the engine immediately interrupts search calculation to prevent losing on time.
_Avoid_: Maximum clock, hard kill

**UCI Protocol Loop**:
The asynchronous command processor reading UCI text commands from standard input while streaming real-time search telemetry to standard output.
_Avoid_: CLI reader, console listener




