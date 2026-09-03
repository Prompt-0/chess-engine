---
id: T02-bitboard-representation-and-sliding-attack-technique
title: Bitboard Representation and Sliding Attack Technique
type: wayfinder:grilling
status: open
blocked_by:
  - T01-project-scaffolding-and-workspace-setup
assignee: unassigned
---

## Question

How should the board state and bitboard primitives be represented, and which sliding attack lookup strategy (Fancy Magic Bitboards vs Plain Magic Bitboards vs BMI2/PEXT intrinsics with precomputed ray fallback) will deliver optimal cache friendliness, lookup latency, and cross-platform compatibility?
