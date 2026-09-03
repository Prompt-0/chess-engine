# Wayfinder Map: High-Performance Chess Engine & Modern UI

## Destination

A complete, fully functional chess system featuring a high-performance, tournament-capable UCI chess engine written in Rust (2000+ Elo target, bitboards, magic bitboards, alpha-beta/PVS, iterative deepening, quiescence, transposition table, tapered HCE) paired with a modern, responsive web UI on port 3000 communicating via a local WebSocket UCI bridge on port 5001 for real-time play, analysis, and telemetry.

## Notes

- **Domain**: High-performance game tree search, bitwise algorithms, chess rules, Universal Chess Interface (UCI), web sockets, modern interactive UI design.
- **Relevant Skills**: `rust-patterns`, `react-best-practices`, `frontend-design`, `domain-modeling`, `systematic-debugging`, `test-driven-development`.
- **Standing Preferences**:
  - Zero-allocation inner search loop in Rust.
  - Strict Perft validation against standard test positions (Depth 1-5, Kiwipete).
  - Port constraints: UI on `3000`, Bridge on `5001`.
  - Refer to tickets by name, never bare numbers.

## Decisions so far

<!-- the index: one line per closed ticket, enough to judge relevance, then zoom the link for the detail the ticket holds -->

- [Project Scaffolding and Workspace Setup](./tickets/T01-project-scaffolding-and-workspace-setup.md): Configured monorepo workspace with Rust engine crate, Node.js WebSocket bridge on port 5001, and Vite/React/Tailwind UI on port 3000.
- [Bitboard Representation and Sliding Attack Technique](./tickets/T02-bitboard-representation-and-sliding-attack-technique.md): Fancy Magic Bitboards (~800KB table), hybrid bitboards + 64-square mailbox, 16-bit packed moves, and branchless castling masks.
- [Move Generator Architecture and Perft Verification Suite](./tickets/T03-movegen-and-perft-verification-suite.md): Strictly legal move generation with bitwise pin/check masks, 520-byte stack MoveList, staged captures/quiets generation, and 4-position Perft suite.
- [Chess Opening Books and Endgame Tablebases Feasibility](./tickets/T09-chess-openings-and-tablebases-research.md): Memory-mapped Polyglot (.bin) books in T06; Syzygy tablebases in Phase 2 via SyzygyPath UCI option and Lichess API fallback.





## Not yet specified

<!-- see "Fog of war": in-scope fog you can't ticket yet; graduates as the frontier advances -->

- **NNUE Evaluation Pipeline**: Designing the neural network architecture (e.g. 768->256x2->1), training dataset generation from self-play, int8/int16 SIMD quantization, and accumulator incremental updates (graduates after baseline HCE and search stability).
- **Automated SPSA / Texel Tuning**: Automated parameter optimization pipeline to tune piece-square and evaluation weights using self-play games against baseline versions.
- **Lazy SMP Multi-Threaded Search**: Scaling search over multiple CPU worker threads sharing a lock-free Transposition Table.
- **WebAssembly Compilation Target**: Compiling the engine core to WASM to allow zero-install, 100% in-browser offline analysis fallback.

## Out of scope

<!-- see "Out of scope": work ruled beyond the destination; closed, never graduates -->

- **Multi-user Cloud Matchmaking**: Multi-tenant server infrastructure, matchmaking queues, or user account authentication.
- **Proprietary Commercial Distribution**: Commercial DRM, closed-source obfuscation, or proprietary protocol extensions beyond standard UCI.
