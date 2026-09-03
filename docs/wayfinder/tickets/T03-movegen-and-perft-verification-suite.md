---
id: T03-movegen-and-perft-verification-suite
title: Move Generator Architecture and Perft Verification Suite
type: wayfinder:grilling
status: open
blocked_by:
  - T02-bitboard-representation-and-sliding-attack-technique
assignee: unassigned
---

## Question

How should the move generator structure pseudo-legal generation, check evasions, pin detection, and move encoding (16-bit packed structs) to ensure zero heap allocations per ply while passing standard Perft benchmark suites (Initial position depth 5: 4,865,609 nodes; Position 2 Kiwipete depth 4: 4,085,603 nodes)?
