# Agent Guidelines for AetherChess

AetherChess is a monorepo containing a high-performance chess engine in Rust (UCI protocol), a WebSocket bridge in Node.js, and an analysis UI in React 19 + TypeScript.

---

## 🛠️ Verification & Test Commands
Before proposing code changes:
- **Test Engine**: `npm run test:engine` (executes `cargo test --manifest-path engine/Cargo.toml`)
- **Build Engine**: `npm run build:engine` (executes `cargo build --release --manifest-path engine/Cargo.toml`)
- **Build Frontend UI**: `npm run build:ui` (executes `tsc -b && vite build` in `ui/`)

---

## 🏛️ Monorepo Architecture
- `engine/`: Rust UCI calculation backend (Bitboards, Magic multipliers, Transposition tables, Alpha-Beta/PVS search, Quiescence, PeSTO evaluation).
- `bridge/`: WebSocket bridge translating stdio UCI streams to JSON events for web clients.
- `ui/`: Modern React 19 analysis interface with evaluation bars and move telemetry.

---

## 📋 Engineering Standards & Guardrails
1. **Engine Correctness**: Any change to move generation or bitboard manipulation must maintain 100% legal move perft counts.
2. **Deterministic Evaluation**: Evaluation scores and piece-square bonuses must stay consistent with the tapered game phase.
3. **Strict TypeScript in UI**: All React components and hooks in `ui/` must typecheck cleanly without `any`.
