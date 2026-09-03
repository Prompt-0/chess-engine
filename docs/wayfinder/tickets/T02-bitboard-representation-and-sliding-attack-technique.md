---
id: T02-bitboard-representation-and-sliding-attack-technique
title: Bitboard Representation and Sliding Attack Technique
type: wayfinder:grilling
status: closed
blocked_by:
  - T01-project-scaffolding-and-workspace-setup
assignee: agy
---

## Question

How should the board state and bitboard primitives be represented, and which sliding attack lookup strategy (Fancy Magic Bitboards vs Plain Magic Bitboards vs BMI2/PEXT intrinsics with precomputed ray fallback) will deliver optimal cache friendliness, lookup latency, and cross-platform compatibility?

## Resolution

The architectural decisions for board representation and attack generation were settled through grilling:

1. **Fancy Magic Bitboards**:
   - Adopt precomputed 64-bit magic numbers with square-indexed offsets into a shared flat attack table (~800 KB total size).
   - Guarantees $O(1)$ attack lookup in 3 instructions (`AND`, `MUL`, `SHR`) with maximum L2/L3 cache locality.
   - 100% portable across x86_64, aarch64, and WebAssembly without architecture-specific CPU instruction bugs or microcode stalls.
2. **Hybrid Board Representation (Bitboards + Mailbox)**:
   - 12 piece bitboards (`pieces[color][piece_type]`) + 2 color bitboards + 1 combined occupancy bitboard.
   - Redundant 64-element `[Option<Piece>; 64]` mailbox array for instantaneous piece queries during move execution, unmaking, and MVV-LVA capture scoring.
3. **16-bit Packed Move Representation**:
   - Packed `u16` encoding:
     - Bits `0..5`: `from` square (0..63)
     - Bits `6..11`: `to` square (0..63)
     - Bits `12..15`: 4-bit flag (Quiet, Double Push, Castles, Captures, Promotions, EP).
   - Zero heap allocation, register-resident, and trivially sortable.
4. **Zero-Branching Castling Rights Updates**:
   - 4-bit integer bitfield updated unconditionally with `castling_rights &= CASTLING_MASKS[from] & CASTLING_MASKS[to]`.
