---
id: T09-chess-openings-and-tablebases-research
title: Chess Opening Books and Endgame Tablebases Feasibility
type: wayfinder:research
status: closed
blocked_by: []
assignee: agy
---

## Question

What polyglot opening book formats and Syzygy endgame tablebase probe libraries or lightweight algorithms exist in the Rust chess ecosystem, and what are their runtime memory and disk footprint trade-offs for embedding into a local chess engine?

## Resolution

Investigated by research subagent. Full report recorded at [chess-openings-and-tablebases.md](../research/chess-openings-and-tablebases.md).

**Key Takeaways**:
1. **Polyglot `.bin` Opening Books**: High ROI, simple binary search over 16-byte records memory-mapped via `memmap2`. Requires separate `compute_polyglot_key` function to handle Polyglot's specific en-passant legality rule and big-endian decoding. Scheduled for integration during **T06 (UCI Protocol & Time Management)**.
2. **Syzygy Tablebases (3-4-5 Piece)**: Requires ~1.0 GB across 580 files (`.rtbw` and `.rtbz`). Probing in search (WDL) and root (DTZ) provides perfect play, but disk footprint is substantial. Deferred to **Phase 2** via standard `SyzygyPath` UCI option, with web UI client fallback via public Lichess Tablebase REST API.
